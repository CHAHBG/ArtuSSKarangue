/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 */

const rateLimit = require('express-rate-limit');
const { incrementCache, getCache, setCache } = require('../config/redis');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Create a rate limiter with Redis store
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // Max requests per window
    message = 'Too many requests from this IP, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return rateLimit({
    windowMs,
    max,
    message,
    skipSuccessfulRequests,
    skipFailedRequests,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        url: req.originalUrl,
      });
      res.status(429).json({
        status: 'error',
        message,
      });
    },
  });
};

/**
 * General API rate limiter
 */
const apiLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = createRateLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for emergency creation
 */
const emergencyCreationLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Max 10 emergencies per 5 minutes
  message: 'You have created too many emergencies. Please wait before creating another one.',
});

/**
 * Rate limiter for voting
 */
const votingLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Max 20 votes per minute
  message: 'Too many voting requests. Please slow down.',
});

/**
 * Custom rate limiter using Redis (more flexible)
 */
const customRateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000,
    max = 10,
    keyGenerator = (req) => req.ip,
    message = 'Rate limit exceeded',
  } = options;

  return async (req, res, next) => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const current = await getCache(key);

      if (current && current >= max) {
        logger.warn('Custom rate limit exceeded:', {
          key,
          current,
          max,
        });
        return next(new AppError(message, 429));
      }

      if (!current) {
        await setCache(key, 1, Math.ceil(windowMs / 1000));
      } else {
        await incrementCache(key);
      }

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // Don't block requests if rate limiter fails
      next();
    }
  };
};

/**
 * User-specific rate limiter (per user ID)
 */
const userRateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000,
    max = 30,
    message = 'You are making too many requests. Please slow down.',
  } = options;

  return customRateLimiter({
    windowMs,
    max,
    keyGenerator: (req) => {
      if (req.user && req.user.id) {
        return `user:${req.user.id}`;
      }
      return req.ip;
    },
    message,
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  emergencyCreationLimiter,
  votingLimiter,
  customRateLimiter,
  userRateLimiter,
};
