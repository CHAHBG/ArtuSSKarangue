/**
 * PostgreSQL Database Configuration with PostGIS Support
 * Handles connection pooling and PostGIS initialization
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');
const url = require('url');

// Parse DATABASE_URL if provided (for Supabase)
let poolConfig;

if (process.env.DATABASE_URL) {
  // Parse the connection string to extract components
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth ? params.auth.split(':') : [];
  
  poolConfig = {
    // Use separate parameters instead of connectionString
    // This forces IPv4 resolution
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname ? params.pathname.split('/')[1] : 'postgres',
    ssl: {
      rejectUnauthorized: false // Important pour Supabase
    },
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  // Configuration avec variables séparées (PostgreSQL local)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'artu_emergency_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

const pool = new Pool(poolConfig);

// Test database connection
pool.on('connect', () => {
  const dbType = process.env.DATABASE_URL ? 'Supabase PostgreSQL' : 'Local PostgreSQL';
  logger.info(`✅ Connected to ${dbType}`);
});

pool.on('error', (err) => {
  logger.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

/**
 * Initialize PostGIS extension
 */
const initPostGIS = async () => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    logger.info('PostGIS extension initialized');
  } catch (error) {
    logger.error('Error initializing PostGIS:', error);
    throw error;
  }
};

/**
 * Execute a database query with error handling
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Database query error:', { text, error: error.message });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
const getClient = async () => {
  try {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Set a timeout of 30 seconds
    const timeout = setTimeout(() => {
      logger.error('A client has been checked out for more than 30 seconds!');
    }, 30000);

    // Monkey patch the query method to track queries
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    // Monkey patch the release method to clear timeout
    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  } catch (error) {
    logger.error('Error getting database client:', error);
    throw error;
  }
};

/**
 * Close all database connections
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', error);
    throw error;
  }
};

module.exports = {
  query,
  getClient,
  closePool,
  initPostGIS,
  pool,
};
