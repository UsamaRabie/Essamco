const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes.',
  },
});

// Strict rate limiter for authentication endpoints (anti-brute-force)
// Tracks both client IP and target account email to prevent distributed credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per IP/account window
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    const email =
      req.body && typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    return `${req.ip}_${email}`;
  },
  message: {
    success: false,
    message: 'Too many login attempts. Rate limit exceeded. Please try again after 15 minutes.',
  },
});

// Rate limiter for public inquiries and contact submissions (anti-spam / anti-flood)
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 submissions per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this IP address. Please wait before submitting again.',
  },
});

// Rate limiter for image uploads (resource exhaustion defense)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Max 25 uploads per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload quota exceeded for this IP. Please try again after 15 minutes.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  inquiryLimiter,
  uploadLimiter,
};
