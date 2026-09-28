require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route files
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const siteContentRoutes = require('./routes/siteContentRoutes');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Trust reverse proxy (enables correct req.ip for rate limiting in production)
app.set('trust proxy', 1);

// Disable X-Powered-By header
app.disable('x-powered-by');

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by Next.js on client side
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Body Parser with tight size limits (prevents JSON flood / memory exhaustion DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb', parameterLimit: 100 }));

// 3. Prototype Pollution & Payload Depth Defense
const { cleanPrototypeKeys } = require('./utils/sanitize');
app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      cleanPrototypeKeys(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      cleanPrototypeKeys(req.query);
    }
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// 4. NoSQL Injection Defense - Sanitize user input by stripping $ and . operators
app.use(
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`[Security Alert] Sanitized suspicious NoSQL operator from key: ${key}`);
    },
  })
);

// 5. HTTP Parameter Pollution protection
app.use(hpp());

// 6. Strict CORS Configuration (explicit allowlist matching, rejects unauthorized domains/subdomains/null)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
]
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, ''));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.trim().toLowerCase().replace(/\/+$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy - Unauthorized origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 6. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 7. General API Rate Limiting
app.use('/api', apiLimiter);

// Health Check Endpoint (safe disclosure)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.status(200).json({
    status: 'online',
    server: 'Essamco Chemical API',
    uptime: Math.floor(process.uptime()),
    database: states[dbState] || 'Unknown',
    timestamp: new Date().toISOString(),
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/site-content', siteContentRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send('<h3>Essamco Industrial & Chemical Solutions API is running securely.</h3>');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global Secure Error Handler (prevents sensitive information disclosure)
app.use((err, req, res, next) => {
  console.error('[Error Details]', {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // CORS Error
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      message: 'Not allowed by CORS policy',
    });
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID format',
    });
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'A resource with this unique value already exists.',
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message || 'Internal Server Error'
        : 'An unexpected server error occurred. Please try again later.',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Express] Essamco Secure API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});
