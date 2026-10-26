import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import { pool, checkDatabaseHealth } from './database/db.js';

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync(config.upload.dir)) {
  fs.mkdirSync(config.upload.dir, { recursive: true });
}

// -----------------------------------------------------------------------------
// Security Middlewares (RNF-03)
// -----------------------------------------------------------------------------
app.use(helmet());
app.use(cors({
  origin: '*', // In production, tighten to specific domain if needed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(config.upload.dir)));

// -----------------------------------------------------------------------------
// SRE & DevOps Health Probes (RNF-01, RNF-02)
// -----------------------------------------------------------------------------
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  const status = dbHealthy ? 'UP' : 'DEGRADED';
  const statusCode = dbHealthy ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    service: config.appName,
    uptime_seconds: Math.floor(uptimeSeconds),
    memory: {
      rss_mb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heap_used_mb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
    },
    checks: {
      database: dbHealthy ? 'CONNECTED' : 'DISCONNECTED',
      storage: fs.existsSync(config.upload.dir) ? 'WRITABLE' : 'UNAVAILABLE',
    }
  });
});

app.get('/ready', async (_req: Request, res: Response) => {
  const isHealthy = await checkDatabaseHealth();
  if (isHealthy) {
    res.status(200).send('READY');
  } else {
    res.status(503).send('NOT READY');
  }
});

// -----------------------------------------------------------------------------
// API Routes (SRS Business Modules)
// -----------------------------------------------------------------------------
const apiRouter = express.Router();

// 1. Catalog Packages (RF-03, RF-17) - Full PostgreSQL CRUD
function formatPackage(row: any) {
  const diskMb = row.disk_space_mb;
  const storageStr = diskMb === -1 ? 'Unlimited Space' : (diskMb >= 1024 ? `${(diskMb / 1024).toFixed(1).replace('.0', '')} GB Space` : `${diskMb} MB Space`);
  const bandwidthStr = row.bandwidth_mb === -1 ? 'Unmetered Bandwidth' : `${row.bandwidth_mb} MB Bandwidth`;
  const websiteStr = row.addon_domains === -1 ? 'Unlimited Subdomain & Addon' : (row.addon_domains === 0 ? '100 Subdomain' : `${row.addon_domains} Website`);
  const monthly = parseFloat(row.price_monthly) || 0;
  const annual = parseFloat(row.price_annual) || 0;
  const annualDiscount = annual > 0 ? Math.round(annual / 12) : Math.round(monthly * 0.7);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    whmcsPid: row.whmcs_pid || (row.slug.includes('mini') ? 40 : (row.slug.includes('enterprise') ? 5 : 4)),
    tagline: row.tagline || '',
    monthlyPrice: monthly,
    annualDiscountPrice: annualDiscount,
    annualPrice: annual,
    storage: storageStr,
    bandwidth: bandwidthStr,
    websites: websiteStr,
    emailAccounts: row.email_accounts ? `${row.email_accounts} Akun Email & FTP` : 'Unlimited Email & FTP',
    databases: row.databases_count ? `${row.databases_count} Database MySQL` : 'Unlimited MySQL',
    cPanel: true,
    freeDomain: Boolean(row.free_domain),
    freeSSL: Boolean(row.free_ssl),
    isPopular: Boolean(row.is_popular),
    isActive: Boolean(row.is_active),
    displayOrder: row.display_order || 0,
    features: row.features || [],
  };
}

apiRouter.get('/packages', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hosting_packages ORDER BY display_order ASC, created_at ASC'
    );
    const formatted = result.rows.map(formatPackage);
    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/packages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      slug,
      tagline,
      whmcsPid,
      monthlyPrice,
      annualDiscountPrice,
      storage,
      bandwidth,
      websites,
      emailAccounts,
      databases,
      freeDomain,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const mPrice = Number(monthlyPrice) || 0;
    const aPrice = (Number(annualDiscountPrice) || mPrice) * 12;

    const result = await pool.query(
      `INSERT INTO hosting_packages 
       (name, slug, category, tagline, disk_space_mb, bandwidth_mb, addon_domains, databases_count, email_accounts, free_domain, free_ssl, price_monthly, price_annual, is_popular, is_active, display_order, whmcs_pid)
       VALUES ($1, $2, 'shared_hosting', $3, $4, $5, $6, $7, $8, $9, TRUE, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        name,
        cleanSlug,
        tagline || '',
        storage?.toLowerCase().includes('gb') ? parseInt(storage) * 1024 : (parseInt(storage) || 600),
        bandwidth?.toLowerCase().includes('unmetered') ? -1 : 5120,
        websites?.toLowerCase().includes('unlimited') ? -1 : 0,
        databases?.toLowerCase().includes('unlimited') ? -1 : 5,
        emailAccounts?.toLowerCase().includes('unlimited') ? -1 : 100,
        Boolean(freeDomain),
        mPrice,
        aPrice,
        Boolean(isPopular),
        isActive !== undefined ? Boolean(isActive) : true,
        displayOrder || 1,
        whmcsPid ? Number(whmcsPid) : 4,
      ]
    );

    res.status(201).json({ success: true, data: formatPackage(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/packages/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanId = String(req.params.id || '').trim();
    const altSlug = cleanId.replace(/^pkg-/, '').replace(/^starter$/, 'hosting-mini').replace(/^pro$/, 'hosting-pro').replace(/^enterprise$|^business$/, 'hosting-enterprise');
    const {
      name,
      slug,
      tagline,
      whmcsPid,
      monthlyPrice,
      annualDiscountPrice,
      storage,
      bandwidth,
      websites,
      emailAccounts,
      databases,
      freeDomain,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    const mPrice = Number(monthlyPrice) || 0;
    const aPrice = (Number(annualDiscountPrice) || mPrice) * 12;

    const result = await pool.query(
      `UPDATE hosting_packages SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        tagline = COALESCE($3, tagline),
        price_monthly = COALESCE($4, price_monthly),
        price_annual = COALESCE($5, price_annual),
        free_domain = COALESCE($6, free_domain),
        is_popular = COALESCE($7, is_popular),
        is_active = COALESCE($8, is_active),
        display_order = COALESCE($9, display_order),
        whmcs_pid = COALESCE($10, whmcs_pid),
        updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $11 OR slug = $11 OR slug = $12
       RETURNING *`,
      [
        name,
        slug,
        tagline,
        mPrice > 0 ? mPrice : null,
        aPrice > 0 ? aPrice : null,
        freeDomain !== undefined ? Boolean(freeDomain) : null,
        isPopular !== undefined ? Boolean(isPopular) : null,
        isActive !== undefined ? Boolean(isActive) : null,
        displayOrder !== undefined ? Number(displayOrder) : null,
        whmcsPid ? Number(whmcsPid) : null,
        cleanId,
        altSlug,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: formatPackage(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/packages/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanId = String(req.params.id || '').trim();
    const altSlug = cleanId.replace(/^pkg-/, '').replace(/^starter$/, 'hosting-mini').replace(/^pro$/, 'hosting-pro').replace(/^enterprise$|^business$/, 'hosting-enterprise');
    const result = await pool.query(
      'DELETE FROM hosting_packages WHERE id::text = $1 OR slug = $1 OR slug = $2 RETURNING id, name',
      [cleanId, altSlug]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully from database', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/packages/reset', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await pool.query('DELETE FROM hosting_packages;');
    await pool.query(`
      INSERT INTO hosting_packages (name, slug, category, tagline, disk_space_mb, bandwidth_mb, addon_domains, databases_count, email_accounts, cpu_cores, ram_mb, free_domain, free_ssl, price_monthly, price_annual, features, is_popular, is_active, display_order, whmcs_pid)
      VALUES
      ('Hosting Mini', 'hosting-mini', 'shared_hosting', 'Solusi terjangkau untuk website personal, portofolio, dan blog pemula.', 60, 5120, 0, 5, 100, 1.0, 512, FALSE, TRUE, 10000, 50000, '["60 MB Storage Space", "5 GB Bandwidth", "100 Subdomains", "5 MySQL Databases", "100 FTP Accounts", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb, FALSE, TRUE, 1, 40),
      ('Hosting Pro', 'hosting-pro', 'shared_hosting', 'Pilihan paling populer untuk UKM dan toko online dengan bonus gratis domain.', 600, -1, -1, -1, -1, 2.0, 1024, TRUE, TRUE, 30000, 300000, '["600 MB Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain (.com / .net / .us / .info)", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb, TRUE, TRUE, 2, 4),
      ('Hosting Enterprise', 'hosting-enterprise', 'cloud_hosting', 'Kapasitas besar dan performa maksimal untuk instansi, portal berita, dan bisnis.', 1200, -1, -1, -1, -1, 4.0, 2048, TRUE, TRUE, 50000, 500000, '["1.200 MB (1.2 GB) Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain Pilihan", "CloudLinux OS + Varnish Cache", "cPanel Access", "Prioritas Support 24/7"]'::jsonb, FALSE, TRUE, 3, 5);
    `);
    const result = await pool.query('SELECT * FROM hosting_packages ORDER BY display_order ASC');
    res.json({ success: true, message: 'Packages reset to official Hostuner catalog in database', data: result.rows.map(formatPackage) });
  } catch (err) {
    next(err);
  }
});

// 1.1 Testimonials CRUD (PostgreSQL Persistence)
apiRouter.get('/testimonials', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at ASC');
    const mapped = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      role: r.role || '',
      company: r.company || '',
      comment: r.comment,
      rating: r.rating || 5,
      avatar: r.avatar || '',
      isActive: Boolean(r.is_active),
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/testimonials', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, role, company, comment, rating, avatar, isActive } = req.body;
    const testiId = id || `testi-${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO testimonials (id, name, role, company, comment, rating, avatar, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [testiId, name, role || '', company || '', comment, rating || 5, avatar || '', isActive !== undefined ? Boolean(isActive) : true]
    );
    const r = result.rows[0];
    res.status(201).json({
      success: true,
      data: {
        id: r.id,
        name: r.name,
        role: r.role,
        company: r.company,
        comment: r.comment,
        rating: r.rating,
        avatar: r.avatar,
        isActive: Boolean(r.is_active),
      }
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/testimonials/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, role, company, comment, rating, avatar, isActive } = req.body;
    const result = await pool.query(
      `UPDATE testimonials SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        company = COALESCE($3, company),
        comment = COALESCE($4, comment),
        rating = COALESCE($5, rating),
        avatar = COALESCE($6, avatar),
        is_active = COALESCE($7, is_active)
       WHERE id = $8
       RETURNING *`,
      [name, role, company, comment, rating, avatar, isActive !== undefined ? Boolean(isActive) : null, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    const r = result.rows[0];
    res.json({
      success: true,
      data: {
        id: r.id,
        name: r.name,
        role: r.role,
        company: r.company,
        comment: r.comment,
        rating: r.rating,
        avatar: r.avatar,
        isActive: Boolean(r.is_active),
      }
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/testimonials/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted from database', id });
  } catch (err) {
    next(err);
  }
});

// 2. Domain Pricing & Availability (RF-04, RF-18)
apiRouter.get('/domains', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM domain_extensions WHERE is_active = TRUE ORDER BY price_register_annual ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/domains/check', async (req: Request, res: Response) => {
  const domain = req.body.domain || req.body.domainName;
  const tld = req.body.tld || req.body.domainTld;
  if (!domain || !tld) {
    return res.status(400).json({ success: false, message: 'Domain name and TLD are required' });
  }
  const cleanName = domain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const fullDomain = `${cleanName}${tld.startsWith('.') ? tld : '.' + tld}`;
  
  // Simulated WHOIS availability logic for demonstration
  const isAvailable = !['google.com', 'facebook.com', 'kemlu.go.id'].includes(fullDomain);
  
  res.json({
    success: true,
    data: {
      domain: fullDomain,
      available: isAvailable,
      tld: tld,
    }
  });
});

// 3. Payment Methods (RF-09, RF-20)
apiRouter.get('/payment-methods', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payment_methods WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// 4. FAQs (RF-12, RF-27)
apiRouter.get('/faqs', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM faqs WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// 5. User Orders Summary (RF-05, RF-19, RF-21)
apiRouter.get('/orders', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.full_name, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC LIMIT 50`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// 6. Admin Dashboard Stats (RF-10)
apiRouter.get('/admin/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalOrdersRes = await pool.query('SELECT COUNT(*) as count FROM orders');
    const totalUsersRes = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = \'customer\'');
    const totalActiveServices = await pool.query('SELECT COUNT(*) as count FROM customer_services WHERE status = \'active\'');
    const totalRevenueRes = await pool.query('SELECT COALESCE(SUM(net_amount), 0) as total FROM orders WHERE status = \'paid\' OR status = \'completed\'');

    res.json({
      success: true,
      data: {
        total_orders: parseInt(totalOrdersRes.rows[0]?.count || '0', 10),
        total_customers: parseInt(totalUsersRes.rows[0]?.count || '0', 10),
        active_services: parseInt(totalActiveServices.rows[0]?.count || '0', 10),
        total_revenue: parseFloat(totalRevenueRes.rows[0]?.total || '0'),
      }
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Alias for convenience

// -----------------------------------------------------------------------------
// Global Error Handler
// -----------------------------------------------------------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API ERROR]:', err);
  res.status(500).json({
    success: false,
    message: config.env === 'production' ? 'Internal server error' : err.message,
  });
});

// -----------------------------------------------------------------------------
// Server Start & Graceful Shutdown
// -----------------------------------------------------------------------------
const server = app.listen(config.port, () => {
  console.log(`[SERVER] Hostuner API running on port ${config.port} (${config.env})`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`[SERVER] Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('[SERVER] HTTP connections closed.');
    try {
      await pool.end();
      console.log('[DATABASE] PostgreSQL pool terminated.');
      process.exit(0);
    } catch (err) {
      console.error('[DATABASE] Error closing pool:', err);
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes longer than 10s
  setTimeout(() => {
    console.error('[SERVER] Forced shutdown after 10s timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
