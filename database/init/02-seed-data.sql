-- =============================================================================
-- CV. BUANA LOGIKA UTAMA - SISTEM PENJUALAN LAYANAN WEB HOSTING
-- Seed Initial Master Data & Default Admin Account
-- =============================================================================

-- 1. Default Administrator & Demo Customer
-- Password for both is 'BuanaAdmin2026!' and 'Pelanggan2026!' (bcrypt hashed with salt 10)
-- Hash: $2a$10$wTfZl33o2kR.PZ3/oX7jheOeqw2r7rG0v6B9L1y5hM.Z7M3lSjV2m (for demo purposes)
-- We also insert an argon2/bcrypt safe pre-computed string
INSERT INTO users (id, email, password_hash, full_name, phone, company, role, is_active)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'admin@buanalogikautama.co.id', '$2b$10$P82U1tEdfR9M61b9GZgT8OiM8G9bU6qKSmFmZ4hZpP.pMbmXjYpWy', 'Administrator CV. Buana', '081234567890', 'CV. Buana Logika Utama', 'admin', TRUE),
    ('a0000000-0000-0000-0000-000000000002', 'pelanggan@example.com', '$2b$10$P82U1tEdfR9M61b9GZgT8OiM8G9bU6qKSmFmZ4hZpP.pMbmXjYpWy', 'Budi Santoso', '085712345678', 'PT. Solusi Mandiri', 'customer', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Master Hosting Packages (Shared Hosting, Cloud Hosting, VPS)
INSERT INTO hosting_packages (name, slug, category, tagline, disk_space_mb, bandwidth_mb, addon_domains, cpu_cores, ram_mb, free_domain, free_ssl, price_monthly, price_annual, features, is_popular, display_order)
VALUES
    (
        'Hosting Mini',
        'hosting-mini',
        'shared_hosting',
        'Solusi terjangkau untuk website personal, portofolio, dan blog pemula.',
        60, -- 60 MB SSD
        5120, -- 5 GB Bandwidth
        0,
        1.0,
        512,
        FALSE,
        TRUE,
        10000,
        50000,
        '["60 MB Storage Space", "5 GB Bandwidth", "100 Subdomains", "5 MySQL Databases", "100 FTP Accounts", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb,
        FALSE,
        1
    ),
    (
        'Hosting Pro',
        'hosting-pro',
        'shared_hosting',
        'Pilihan paling populer untuk UKM dan toko online dengan bonus gratis domain.',
        600, -- 600 MB SSD
        -1, -- Unmetered
        -1, -- Unlimited Addon Domains
        2.0,
        1024,
        TRUE,
        TRUE,
        30000,
        300000,
        '["600 MB Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain (.com / .net / .us / .info)", "CloudLinux OS + Varnish Cache", "cPanel Access"]'::jsonb,
        TRUE,
        2
    ),
    (
        'Hosting Enterprise',
        'hosting-enterprise',
        'cloud_hosting',
        'Kapasitas besar dan performa maksimal untuk instansi, portal berita, dan bisnis.',
        1200, -- 1.2 GB SSD
        -1, -- Unmetered
        -1, -- Unlimited Addon Domains
        4.0,
        2048,
        TRUE,
        TRUE,
        50000,
        500000,
        '["1.200 MB (1.2 GB) Storage Space", "Unmetered Bandwidth", "Unlimited Subdomains", "Unlimited MySQL Databases", "Unlimited FTP Accounts", "Gratis Domain Pilihan", "CloudLinux OS + Varnish Cache", "cPanel Access", "Prioritas Support 24/7"]'::jsonb,
        FALSE,
        3
    ),
    (
        'VPS Cloud Starter',
        'vps-cloud-starter',
        'vps_server',
        'Server virtual dengan kontrol root penuh untuk developer dan aplikasi dinamis.',
        51200, -- 50 GB NVMe
        1048576, -- 1 TB Bandwidth
        -1,
        2.0,
        4096,
        FALSE,
        TRUE,
        180000,
        1950000,
        '["2 vCPU Cores", "4 GB Dedicated RAM", "50 GB NVMe Disk", "1 Dedicated Public IPv4", "Full Root SSH Access", "Pilihan OS: Ubuntu / Debian / AlmaLinux", "Automated Snapshot"]'::jsonb,
        FALSE,
        4
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. Master Domain Extensions
INSERT INTO domain_extensions (tld, price_register_annual, price_renew_annual, require_ktp, is_active)
VALUES
    ('.com', 250000, 250000, FALSE, TRUE),
    ('.co.id', 300000, 300000, TRUE, TRUE),
    ('.org', 270000, 270000, FALSE, TRUE),
    ('.web.id', 60000, 60000, TRUE, TRUE),
    ('.us', 115000, 115000, FALSE, TRUE),
    ('.info', 350000, 350000, FALSE, TRUE),
    ('.id', 250000, 250000, TRUE, TRUE),
    ('.net', 250000, 250000, FALSE, TRUE)
ON CONFLICT (tld) DO UPDATE SET
    price_register_annual = EXCLUDED.price_register_annual,
    price_renew_annual = EXCLUDED.price_renew_annual;

-- 4. Master Payment Methods
INSERT INTO payment_methods (code, name, account_number, account_holder, instructions, is_active, display_order)
VALUES
    (
        'bca_transfer',
        'Bank Central Asia (BCA)',
        '123-456-7890',
        'CV. BUANA LOGIKA UTAMA',
        'Transfer manual ke rekening BCA, sertakan 3 digit kode unik pesanan Anda lalu unggah bukti transfer pada menu pembayaran.',
        TRUE,
        1
    ),
    (
        'mandiri_transfer',
        'Bank Mandiri',
        '987-654-3210-123',
        'CV. BUANA LOGIKA UTAMA',
        'Transfer manual ke rekening Bank Mandiri. Pembayaran akan diverifikasi oleh finance maksimal 1x24 jam kerja.',
        TRUE,
        2
    ),
    (
        'qris',
        'QRIS (GoPay, OVO, Dana, ShopeePay, Mobile Banking)',
        'NMID: ID1029384756',
        'CV. BUANA LOGIKA UTAMA',
        'Pindai QR code QRIS menggunakan aplikasi e-wallet atau m-banking Anda. Konfirmasi otomatis / unggah bukti bayar.',
        TRUE,
        3
    )
ON CONFLICT (code) DO NOTHING;

-- 5. Master FAQs
INSERT INTO faqs (category, question, answer, display_order)
VALUES
    ('Hosting', 'Berapa lama proses aktivasi layanan hosting setelah pembayaran?', 'Layanan hosting akan aktif secara instan maksimal 15 menit setelah pembayaran berhasil diverifikasi oleh tim verifikasi kami.', 1),
    ('Domain', 'Apakah saya memerlukan KTP untuk pendaftaran domain .id atau .co.id?', 'Ya, sesuai dengan regulasi PANDI, pendaftaran domain berakhiran .id memerlukan foto KTP, sedangkan .co.id memerlukan KTP, SIUP/NIB, dan Akta Perusahaan.', 2),
    ('Garansi', 'Apakah ada garansi uang kembali?', 'CV. Buana Logika Utama memberikan garansi 30 hari uang kembali (30-day money-back guarantee) untuk seluruh paket shared hosting.', 3),
    ('Teknis', 'Apakah disediakan fasilitas migrasi website gratis dari provider lama?', 'Ya, tim teknis kami siap membantu pemindahan file website, database, dan email dari hosting lama Anda ke CV. Buana Logika Utama tanpa downtime.', 4);
