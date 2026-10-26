-- =============================================================================
-- CV. BUANA LOGIKA UTAMA - SISTEM PENJUALAN LAYANAN WEB HOSTING
-- Database Initialization & Schema Definition (PostgreSQL 16)
-- Adheres to SRS Requirements (RF-01 s/d RF-29 & RNF-01 s/d RNF-10)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- -----------------------------------------------------------------------------
-- 1. Users & Roles (RF-01, RF-02, RF-11, RF-15, RF-16, RF-26)
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'staff');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    company VARCHAR(150),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    role user_role DEFAULT 'customer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- -----------------------------------------------------------------------------
-- 2. Hosting & VPS Packages (RF-03, RF-17)
-- -----------------------------------------------------------------------------
CREATE TYPE package_category AS ENUM ('shared_hosting', 'cloud_hosting', 'vps_server', 'dedicated_server');

CREATE TABLE IF NOT EXISTS hosting_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    category package_category DEFAULT 'shared_hosting' NOT NULL,
    tagline VARCHAR(255),
    disk_space_mb INTEGER NOT NULL, -- in Megabytes, -1 for unlimited
    bandwidth_mb INTEGER NOT NULL,  -- in Megabytes, -1 for unlimited
    addon_domains INTEGER DEFAULT 1 NOT NULL,
    databases_count INTEGER DEFAULT 5 NOT NULL,
    email_accounts INTEGER DEFAULT 10 NOT NULL,
    cpu_cores NUMERIC(3, 1) DEFAULT 1.0,
    ram_mb INTEGER DEFAULT 1024,
    free_domain BOOLEAN DEFAULT FALSE NOT NULL,
    free_ssl BOOLEAN DEFAULT TRUE NOT NULL,
    price_monthly NUMERIC(12, 2) NOT NULL,
    price_annual NUMERIC(12, 2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_packages_category ON hosting_packages(category);
CREATE INDEX idx_packages_active ON hosting_packages(is_active);

-- -----------------------------------------------------------------------------
-- 3. Domain Extensions & Pricing (RF-04, RF-18)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS domain_extensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tld VARCHAR(30) UNIQUE NOT NULL, -- e.g., '.com', '.id', '.co.id'
    price_register_annual NUMERIC(12, 2) NOT NULL,
    price_renew_annual NUMERIC(12, 2) NOT NULL,
    min_years INTEGER DEFAULT 1,
    max_years INTEGER DEFAULT 10,
    require_ktp BOOLEAN DEFAULT FALSE, -- e.g. for .id / .co.id
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. Payment Methods (RF-09, RF-20)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'bca_transfer', 'mandiri', 'qris'
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(100),
    account_holder VARCHAR(150),
    instructions TEXT,
    qr_code_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. Orders (RF-05, RF-19, RF-21, RF-25)
-- -----------------------------------------------------------------------------
CREATE TYPE order_status AS ENUM (
    'pending_payment',
    'waiting_verification',
    'paid',
    'completed',
    'cancelled',
    'expired'
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    status order_status DEFAULT 'pending_payment' NOT NULL,
    payment_method_code VARCHAR(50),
    notes TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- -----------------------------------------------------------------------------
-- 6. Order Items (RF-05.6, RF-19)
-- -----------------------------------------------------------------------------
CREATE TYPE item_type AS ENUM ('hosting', 'domain', 'vps', 'ssl', 'addon');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'quarterly', 'semi_annually', 'annually', 'biennially');

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    item_type item_type NOT NULL,
    package_id UUID REFERENCES hosting_packages(id) ON DELETE SET NULL,
    item_name VARCHAR(150) NOT NULL,
    domain_name VARCHAR(255),
    billing_cycle billing_cycle DEFAULT 'annually' NOT NULL,
    duration_months INTEGER DEFAULT 12 NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- -----------------------------------------------------------------------------
-- 7. Payments & Proofs (RF-06, RF-20)
-- -----------------------------------------------------------------------------
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    proof_image_url VARCHAR(255),
    sender_bank VARCHAR(100),
    sender_account_name VARCHAR(150),
    transfer_date TIMESTAMP WITH TIME ZONE,
    status payment_status DEFAULT 'pending' NOT NULL,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- -----------------------------------------------------------------------------
-- 8. Customer Active Services (Hosting, VPS & Domain - RF-07, RF-08, RF-22, RF-23, RF-24)
-- -----------------------------------------------------------------------------
CREATE TYPE service_status AS ENUM ('active', 'suspended', 'pending', 'expired', 'terminated');

CREATE TABLE IF NOT EXISTS customer_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    service_type item_type NOT NULL,
    package_id UUID REFERENCES hosting_packages(id) ON DELETE SET NULL,
    domain_name VARCHAR(255) NOT NULL,
    server_ip VARCHAR(50),
    server_hostname VARCHAR(100),
    cpanel_username VARCHAR(50),
    billing_cycle billing_cycle DEFAULT 'annually' NOT NULL,
    status service_status DEFAULT 'pending' NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_services_user_id ON customer_services(user_id);
CREATE INDEX idx_services_status ON customer_services(status);
CREATE INDEX idx_services_expiry ON customer_services(expiry_date);

-- -----------------------------------------------------------------------------
-- 9. Support Tickets & Inquiries (RF-13, RF-28)
-- -----------------------------------------------------------------------------
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'answered', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    service_id UUID REFERENCES customer_services(id) ON DELETE SET NULL,
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'technical' NOT NULL,
    priority ticket_priority DEFAULT 'medium' NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    message TEXT NOT NULL,
    attachment_url VARCHAR(255),
    is_staff_reply BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- -----------------------------------------------------------------------------
-- 10. Audit Logs & Activity Tracker (RNF-10)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'LOGIN', 'ORDER_CREATED', 'PAYMENT_VERIFIED'
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- -----------------------------------------------------------------------------
-- 11. FAQ Knowledgebase (RF-12, RF-27)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) DEFAULT 'Umum' NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
