const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('superadmin', 'admin'), createCategory);

router
  .route('/:identifier')
  .get(getCategoryBySlug)
  .put(protect, authorize('superadmin', 'admin'), updateCategory)
  .delete(protect, authorize('superadmin'), deleteCategory);

module.exports = router;
