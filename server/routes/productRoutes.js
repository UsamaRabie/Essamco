const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('superadmin', 'admin'), createProduct);

router
  .route('/:identifier')
  .get(getProductBySlug)
  .put(protect, authorize('superadmin', 'admin'), updateProduct)
  .delete(protect, authorize('superadmin'), deleteProduct);

module.exports = router;
