const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  createContact,
  getContacts,
  deleteContact,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');
const { inquiryLimiter } = require('../middleware/rateLimiter');

// Public inquiry submission (rate-limited) & Protected list
router
  .route('/')
  .post(inquiryLimiter, createInquiry)
  .get(protect, authorize('superadmin', 'admin'), getInquiries);

// Protected inquiry mutations
router
  .route('/:id')
  .delete(protect, authorize('superadmin'), deleteInquiry);

router
  .route('/:id/status')
  .put(protect, authorize('superadmin', 'admin'), updateInquiryStatus);

// Public contact submission (rate-limited) & Protected list
router
  .route('/contact')
  .post(inquiryLimiter, createContact)
  .get(protect, authorize('superadmin', 'admin'), getContacts);

router
  .route('/contact/:id')
  .delete(protect, authorize('superadmin'), deleteContact);

module.exports = router;
