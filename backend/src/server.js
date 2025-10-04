/**
 * Server Entry Point
 * Starts the Express server with Socket.io support
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const { connectRedis, closeRedis } = require('./config/redis');
const { closePool } = require('./config/database');
const logger = require('./utils/logger');

// Create HTTP server
const server = http.createServer(app);

// Socket.io configuration
const io = socketIO(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:19006',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handler
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join location-based room
  socket.on('join_location', (data) => {
    const { latitude, longitude, radius } = data;
    const room = `location:${latitude}:${longitude}:${radius}`;
    socket.join(room);
    logger.debug(`Socket ${socket.id} joined room: ${room}`);
  });

  // Leave location-based room
  socket.on('leave_location', (data) => {
    const { latitude, longitude, radius } = data;
    const room = `location:${latitude}:${longitude}:${radius}`;
    socket.leave(room);
    logger.debug(`Socket ${socket.id} left room: ${room}`);
  });

  // Track user location in real-time
  socket.on('update_location', (data) => {
    const { userId, latitude, longitude } = data;
    socket.broadcast.emit('user_location_updated', {
      userId,
      latitude,
      longitude,
    });
  });

  // Emergency status updates
  socket.on('emergency_status_change', (data) => {
    io.emit('emergency_updated', data);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });

  // Error handler
  socket.on('error', (error) => {
    logger.error('Socket error:', error);
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Try to connect to Redis (optional - server will work without it)
    try {
      await connectRedis();
      logger.info('✅ Redis connected');
    } catch (redisError) {
      logger.warn('⚠️  Redis connection failed. Server will run without caching.', {
        error: redisError.message
      });
      logger.warn('💡 To enable Redis: Install and start Redis, or disable Redis in code');
    }

    // Start HTTP server
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`📍 Health check: http://localhost:${PORT}/health`);
      logger.info(`📡 API: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close Socket.io connections
      io.close(() => {
        logger.info('Socket.io connections closed');
      });

      // Close Redis connection
      await closeRedis();
      logger.info('Redis connection closed');

      // Close database connection pool
      await closePool();
      logger.info('Database connection pool closed');

      logger.info('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down...', error);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

module.exports = { server, io };
