import { pool } from './src/database/db.js';

async function updateDb() {
  console.log('Starting DB migration to Hostuner pricing...');
  await pool.query('DELETE FROM hosting_packages;');
  await pool.query(`
    INSERT INTO hosting_packages (name, slug, category, tagline, disk_space_mb, bandwidth_mb, addon_domains, cpu_cores, ram_mb, free_domain, free_ssl, price_monthly, price_annual, features, is_popular, display_order)
    VALUES
    ('Hosting Mini', 'hosting-mini', 'shared_hosting', 'Solusi terjangkau untuk website personal, portofolio, dan blog pemula.', 60, 5120, 0, 1.0, 512, FALSE, TRUE, 10000, 50000, '["60 MB Storage Space", "5 GB Bandwidth", "100 Subdomains", "5 MySQL Databases", "100 FTP Accounts", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb, FALSE, 1),
    ('Hosting Pro', 'hosting-pro', 'shared_hosting', 'Pilihan paling populer untuk UKM dan toko online dengan bonus gratis domain.', 600, -1, -1, 2.0, 1024, TRUE, TRUE, 30000, 300000, '["600 MB Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain (.com / .net / .us / .info)", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb, TRUE, 2),
    ('Hosting Enterprise', 'hosting-enterprise', 'cloud_hosting', 'Kapasitas besar dan performa maksimal untuk instansi, portal berita, dan bisnis.', 1200, -1, -1, 4.0, 2048, TRUE, TRUE, 50000, 500000, '["1.200 MB (1.2 GB) Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain Pilihan", "CloudLinux OS + Varnish Cache", "cPanel Access", "Prioritas Support 24/7"]'::jsonb, FALSE, 3);
  `);
  console.log('Hosting packages updated in DB');

  await pool.query('DELETE FROM domain_extensions;');
  await pool.query(`
    INSERT INTO domain_extensions (tld, price_register_annual, price_renew_annual, require_ktp, is_active)
    VALUES
    ('.com', 250000, 250000, FALSE, TRUE),
    ('.co.id', 300000, 300000, TRUE, TRUE),
    ('.org', 270000, 270000, FALSE, TRUE),
    ('.web.id', 60000, 60000, TRUE, TRUE),
    ('.us', 115000, 115000, FALSE, TRUE),
    ('.info', 350000, 350000, FALSE, TRUE),
    ('.id', 250000, 250000, TRUE, TRUE),
    ('.net', 250000, 250000, FALSE, TRUE);
  `);
  console.log('Domain extensions updated in DB');
  await pool.end();
}

updateDb().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
