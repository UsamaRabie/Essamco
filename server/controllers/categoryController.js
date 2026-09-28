const Category = require('../models/Category');
const Product = require('../models/Product');
const { isValidObjectId, sanitizeText } = require('../utils/sanitize');

function filterCategoryPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {};
  }
  const allowed = Object.create(null);
  if (typeof body.name === 'string') allowed.name = sanitizeText(body.name, 100);
  if (typeof body.nameAr === 'string') allowed.nameAr = sanitizeText(body.nameAr, 100);
  if (typeof body.slug === 'string') allowed.slug = body.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 100);
  if (typeof body.description === 'string') allowed.description = sanitizeText(body.description, 1000);
  if (typeof body.descriptionAr === 'string') allowed.descriptionAr = sanitizeText(body.descriptionAr, 1000);
  if (typeof body.icon === 'string') allowed.icon = sanitizeText(body.icon, 50);
  if (typeof body.image === 'string') allowed.image = body.image.trim().slice(0, 500);
  if (typeof body.order === 'number') allowed.order = body.order;
  return allowed;
}

// @desc    Get all categories with product counts
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 }).lean();
    
    // Enrich categories with product count
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.slug });
        return {
          ...cat,
          productCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching categories',
    });
  }
};

// @desc    Get category by slug or id
// @route   GET /api/categories/:identifier
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;
    if (isValidObjectId(identifier)) {
      category = await Category.findById(identifier).lean();
    } else {
      const safeSlug = identifier.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 100);
      category = await Category.findOne({ slug: safeSlug }).lean();
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const products = await Product.find({ category: category.slug }).limit(50).lean();
    res.status(200).json({
      success: true,
      data: {
        category,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new category (Protected)
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const payload = filterCategoryPayload(req.body);

    if (!payload.name || !payload.nameAr) {
      return res.status(400).json({ success: false, message: 'Please provide category name in English and Arabic' });
    }

    if (!payload.slug) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const category = await Category.create(payload);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.code === 11000 ? 'Category slug already exists' : error.message });
  }
};

// @desc    Update category (Protected)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }

    const payload = filterCategoryPayload(req.body);
    const category = await Category.findByIdAndUpdate(identifier, payload, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete category (Protected)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }

    const category = await Category.findByIdAndDelete(identifier);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
