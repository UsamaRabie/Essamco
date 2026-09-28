const Brand = require('../models/Brand');
const Product = require('../models/Product');
const { isValidObjectId, sanitizeText } = require('../utils/sanitize');

function filterBrandPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {};
  }
  const allowed = Object.create(null);
  if (typeof body.name === 'string') allowed.name = sanitizeText(body.name, 100);
  if (typeof body.nameAr === 'string') allowed.nameAr = sanitizeText(body.nameAr, 100);
  if (typeof body.slug === 'string') allowed.slug = body.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 100);
  if (typeof body.tagline === 'string') allowed.tagline = sanitizeText(body.tagline, 250);
  if (typeof body.taglineAr === 'string') allowed.taglineAr = sanitizeText(body.taglineAr, 250);
  if (typeof body.logo === 'string') allowed.logo = body.logo.trim().slice(0, 500);
  if (typeof body.description === 'string') allowed.description = sanitizeText(body.description, 1500);
  if (typeof body.descriptionAr === 'string') allowed.descriptionAr = sanitizeText(body.descriptionAr, 1500);
  if (typeof body.color === 'string') allowed.color = body.color.trim().slice(0, 20);
  if (typeof body.order === 'number') allowed.order = body.order;
  return allowed;
}

// @desc    Get all brands
// @route   GET /api/brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ order: 1 }).lean();
    const enriched = await Promise.all(
      brands.map(async (brand) => {
        const count = await Product.countDocuments({ brand: brand.slug });
        return {
          ...brand,
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
      message: 'Server Error fetching brands',
    });
  }
};

// @desc    Get brand by slug or id
// @route   GET /api/brands/:identifier
exports.getBrandBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    let brand;
    if (isValidObjectId(identifier)) {
      brand = await Brand.findById(identifier).lean();
    } else {
      const safeSlug = identifier.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 100);
      brand = await Brand.findOne({ slug: safeSlug }).lean();
    }

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    const products = await Product.find({ brand: brand.slug }).limit(50).lean();
    res.status(200).json({
      success: true,
      data: {
        brand,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new brand (Protected)
// @route   POST /api/brands
exports.createBrand = async (req, res) => {
  try {
    const payload = filterBrandPayload(req.body);

    if (!payload.name || !payload.nameAr) {
      return res.status(400).json({ success: false, message: 'Please provide brand name in English and Arabic' });
    }

    if (!payload.slug) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const brand = await Brand.create(payload);
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.code === 11000 ? 'Brand slug already exists' : error.message });
  }
};

// @desc    Update brand (Protected)
// @route   PUT /api/brands/:id
exports.updateBrand = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid brand ID format' });
    }

    const payload = filterBrandPayload(req.body);
    const brand = await Brand.findByIdAndUpdate(identifier, payload, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete brand (Protected)
// @route   DELETE /api/brands/:id
exports.deleteBrand = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid brand ID format' });
    }

    const brand = await Brand.findByIdAndDelete(identifier);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
