const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getBrands)
  .post(protect, authorize('superadmin', 'admin'), createBrand);

router
  .route('/:identifier')
  .get(getBrandBySlug)
  .put(protect, authorize('superadmin', 'admin'), updateBrand)
  .delete(protect, authorize('superadmin'), deleteBrand);

module.exports = router;
