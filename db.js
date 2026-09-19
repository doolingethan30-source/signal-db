/**
 * Postgres connection pool + schema setup, for Render's free managed
 * Postgres database. Render gives you a single connection string
 * (DATABASE_URL) rather than separate host/user/password fields.
 *
 * NOTE: Render's free Postgres expires 30 days after creation, with a
 * grace period to upgrade before data is deleted. Nothing here can
 * prevent that — it's a Render account/billing action you'd take
 * (upgrade the database to a paid instance) before the 30 days is up,
 * if you want your accounts and history to survive past that point.
 */

const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Render's Postgres requires SSL
  });
  return pool;
}

async function ensureSchema() {
  const p = getPool();

  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(64) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255) NULL,
      picture_url VARCHAR(512) NULL,
      created_at TIMESTAMP NOT NULL
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(32) NOT NULL,
      token_json TEXT NOT NULL,
      obtained_at TIMESTAMP NOT NULL,
      UNIQUE (user_id, platform)
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(40) PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      file_path VARCHAR(512) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      captions_json TEXT NOT NULL,
      platforms_json TEXT NOT NULL,
      scheduled_for TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'queued'
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS post_results (
      id SERIAL PRIMARY KEY,
      post_id VARCHAR(40) NOT NULL,
      platform VARCHAR(32) NOT NULL,
      status VARCHAR(20) NOT NULL,
      message TEXT NULL,
      remote_id VARCHAR(255) NULL,
      permalink VARCHAR(512) NULL,
      updated_at TIMESTAMP NOT NULL,
      UNIQUE (post_id, platform)
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      entry_date DATE NOT NULL,
      platform VARCHAR(32) NOT NULL,
      followers BIGINT NULL,
      views BIGINT NULL,
      likes BIGINT NULL,
      comments BIGINT NULL,
      source VARCHAR(20) NOT NULL DEFAULT 'manual',
      updated_at TIMESTAMP NOT NULL,
      UNIQUE (user_id, entry_date, platform)
    )
  `);
}

module.exports = { getPool, ensureSchema };
