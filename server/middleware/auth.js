const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { isValidObjectId } = require('../utils/sanitize');

// Protect routes - verify valid JWT and active admin user
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  try {
    // Explicitly enforce algorithm to prevent algorithm-switching attacks
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    if (!decoded || !decoded.id || !isValidObjectId(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'The administrative account belonging to this token no longer exists.',
      });
    }

    // Check if token version was invalidated by password change or session revocation
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== admin.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Admin account credentials have changed. Please log in again with your new credentials.',
      });
    }

    // Check if admin changed password after token was issued
    if (admin.changedPasswordAfter && admin.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: 'Admin account password was recently updated. Please log in again with your new credentials.',
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authorization token has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authorization token',
    });
  }
};

// Authorize roles (Role-Based Access Control)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Admin role '${req.admin?.role || 'unknown'}' is not authorized to perform this operation.`,
      });
    }
    next();
  };
};
