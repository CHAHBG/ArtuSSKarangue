/**
 * Express Application Configuration
 * Main app setup with all middleware and routes
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const AppError = require('./utils/appError');

// Create Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:19006',
      'http://localhost:19000',
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection (even though we use SQL)
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['type', 'status', 'severity'], // Allow duplicates for these params
}));

// Compression middleware
app.use(compression());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// API rate limiting
app.use('/api', apiLimiter);

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(parseInt(process.env.REQUEST_TIMEOUT) || 30000);
  res.setTimeout(parseInt(process.env.REQUEST_TIMEOUT) || 30000);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Database connection test endpoint
app.get('/health/db', async (req, res) => {
  try {
    const { query } = require('./config/database');
    
    // Test 1: Connexion basique
    const timeStart = Date.now();
    const result = await query('SELECT NOW() as time, version() as version');
    const queryDuration = Date.now() - timeStart;
    
    // Test 2: Vérifier tables
    const tablesResult = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.status(200).json({
      status: 'success',
      message: 'Database connected',
      environment: {
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        database_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'not set'
      },
      database: {
        time: result.rows[0].time,
        version: result.rows[0].version,
        query_duration_ms: queryDuration,
        tables_count: parseInt(tablesResult.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      environment: {
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        database_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'not set'
      },
      error: {
        message: error.message,
        code: error.code,
        name: error.name
      }
    });
  }
});

// API version info
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ARTU SI SEN KARANGUE Emergency Response API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/v1/docs',
  });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/emergencies`, emergencyRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
