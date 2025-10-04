/**
 * Redis Configuration for Caching and Session Management
 */

const redis = require('redis');
const logger = require('../utils/logger');

// Only create Redis client if explicitly enabled
const redisEnabled = process.env.REDIS_ENABLED === 'true';

let redisClient;

if (redisEnabled) {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB) || 0,
  });

  // Error handling
  redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client ready');
  });

  redisClient.on('end', () => {
    logger.info('Redis connection closed');
  });
} else {
  // Create a mock client that does nothing
  redisClient = {
    isOpen: false,
    connect: async () => {},
    quit: async () => {},
  };
  logger.info('Redis disabled - running without cache');
}

/**
 * Connect to Redis
 */
const connectRedis = async () => {
  if (!redisEnabled) {
    logger.info('Redis disabled in configuration');
    return;
  }
  
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

/**
 * Set a value in Redis with optional expiration
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} expirationInSeconds - TTL in seconds
 */
const setCache = async (key, value, expirationInSeconds = 3600) => {
  try {
    if (!redisClient.isOpen) {
      logger.debug('Redis not available, skipping cache set');
      return;
    }
    const serializedValue = JSON.stringify(value);
    if (expirationInSeconds) {
      await redisClient.setEx(key, expirationInSeconds, serializedValue);
    } else {
      await redisClient.set(key, serializedValue);
    }
    logger.debug(`Cache set: ${key}`);
  } catch (error) {
    logger.debug('Redis setCache error (non-fatal):', error.message);
    // Don't throw error - allow app to continue without cache
  }
};

/**
 * Get a value from Redis
 * @param {string} key - Cache key
 * @returns {Promise<*>} Cached value or null
 */
const getCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    const value = await redisClient.get(key);
    if (value) {
      logger.debug(`Cache hit: ${key}`);
      return JSON.parse(value);
    }
    logger.debug(`Cache miss: ${key}`);
    return null;
  } catch (error) {
    logger.debug('Redis getCache error (non-fatal):', error.message);
    return null;
  }
};

/**
 * Delete a key from Redis
 * @param {string} key - Cache key
 */
const deleteCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return;
    }
    await redisClient.del(key);
    logger.debug(`Cache deleted: ${key}`);
  } catch (error) {
    logger.debug('Redis deleteCache error (non-fatal):', error.message);
    // Don't throw - allow app to continue
  }
};

/**
 * Delete all keys matching a pattern
 * @param {string} pattern - Key pattern (e.g., 'user:*')
 */
const deleteCachePattern = async (pattern) => {
  try {
    if (!redisClient.isOpen) {
      return;
    }
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.debug(`Cache pattern deleted: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    logger.debug('Redis deleteCachePattern error (non-fatal):', error.message);
    // Don't throw - allow app to continue
  }
};

/**
 * Check if a key exists in Redis
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
const existsCache = async (key) => {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Redis existsCache error:', error);
    return false;
  }
};

/**
 * Increment a value in Redis
 * @param {string} key - Cache key
 * @returns {Promise<number>} New value
 */
const incrementCache = async (key) => {
  try {
    const value = await redisClient.incr(key);
    return value;
  } catch (error) {
    logger.error('Redis incrementCache error:', error);
    throw error;
  }
};

/**
 * Close Redis connection
 */
const closeRedis = async () => {
  try {
    await redisClient.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  existsCache,
  incrementCache,
  closeRedis,
};
