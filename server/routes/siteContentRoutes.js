const express = require('express');
const router = express.Router();
const { getSiteContent, updateSiteContent } = require('../controllers/siteContentController');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', apiLimiter, getSiteContent);
router.put('/', apiLimiter, protect, authorize('superadmin', 'admin'), updateSiteContent);

module.exports = router;
