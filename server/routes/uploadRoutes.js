const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Allowed image extensions and mime types allowlist
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Single file only
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return cb(new Error('Invalid file extension. Only .jpg, .jpeg, .png, and .webp are accepted.'), false);
    }
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error('Invalid file MIME type.'), false);
    }
    cb(null, true);
  },
});

router.post(
  '/',
  uploadLimiter,
  protect,
  authorize('superadmin', 'admin'),
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File size exceeds maximum 5MB limit.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadImage
);

module.exports = router;
