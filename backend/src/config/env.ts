import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  appName: process.env.APP_NAME || 'Hostuner Webhosting',
  appUrl: process.env.APP_URL || 'http://localhost:5000',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_DATABASE || 'buana_hosting_db',
    user: process.env.DB_USERNAME || 'buana_admin',
    password: process.env.DB_PASSWORD || 'buana_dev_secret_2026!',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_buana_logika_utama_dev_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
  }
};
