/**
 * Global Error Handling Middleware
 */

const logger = require('../utils/logger');
const AppError = require('../utils/appError');

/**
 * Handle database errors
 */
const handleDatabaseError = (error) => {
  if (error.code === '23505') {
    // Unique constraint violation
    const field = error.constraint ? error.constraint.split('_')[1] : 'field';
    return new AppError(`This ${field} already exists. Please use a different one.`, 400);
  }

  if (error.code === '23503') {
    // Foreign key constraint violation
    return new AppError('Referenced resource does not exist.', 400);
  }

  if (error.code === '23502') {
    // Not null constraint violation
    const field = error.column || 'field';
    return new AppError(`${field} is required.`, 400);
  }

  return new AppError('Database error occurred. Please try again.', 500);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak error details
    logger.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  if (err.statusCode === 500) {
    logger.error('Internal Server Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('Client Error:', {
      message: err.message,
      statusCode: err.statusCode,
      url: req.originalUrl,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific errors
    if (err.code && err.code.startsWith('23')) {
      error = handleDatabaseError(err);
    }

    if (err.name === 'ValidationError') {
      error = new AppError(err.message, 400);
    }

    if (err.name === 'CastError') {
      error = new AppError('Invalid data format.', 400);
    }

    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server.`,
    404
  );
  next(error);
};

/**
 * Async error wrapper to catch errors in async functions
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  catchAsync,
};
