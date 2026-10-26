import { Pool } from 'pg';
import { config } from '../config/env.js';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: config.db.maxConnections,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client:', err);
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 as healthy');
    return res.rows[0]?.healthy === 1;
  } catch (err) {
    console.error('[DATABASE HEALTHCHECK ERROR]:', err);
    return false;
  }
}
