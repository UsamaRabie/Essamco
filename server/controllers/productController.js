const Product = require('../models/Product');
const { isValidObjectId, escapeRegex, sanitizeText } = require('../utils/sanitize');

// Allowed sort fields allowlist
const ALLOWED_SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  name_asc: { name: 1 },
  name_desc: { name: -1 },
  featured: { isFeatured: -1, createdAt: -1 },
};

// Allowed product updateable fields allowlist (prevents mass assignment & prototype pollution)
function filterProductPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {};
  }
  const allowed = Object.create(null);
  if (typeof body.name === 'string') allowed.name = sanitizeText(body.name, 200);
  if (typeof body.nameAr === 'string') allowed.nameAr = sanitizeText(body.nameAr, 200);
  if (typeof body.slug === 'string') allowed.slug = body.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 150);
  if (typeof body.category === 'string') allowed.category = body.category.trim().slice(0, 100);
  if (typeof body.brand === 'string') allowed.brand = body.brand.trim().slice(0, 100);
  if (typeof body.description === 'string') allowed.description = sanitizeText(body.description, 3000);
  if (typeof body.descriptionAr === 'string') allowed.descriptionAr = sanitizeText(body.descriptionAr, 3000);
  if (typeof body.image === 'string') allowed.image = body.image.trim().slice(0, 500);
  if (Array.isArray(body.images)) {
    allowed.images = body.images
      .filter((img) => typeof img === 'string')
      .map((img) => img.trim().slice(0, 500))
      .slice(0, 10);
  }
  if (typeof body.isFeatured === 'boolean') allowed.isFeatured = body.isFeatured;
  if (typeof body.inStock === 'boolean') allowed.inStock = body.inStock;

  if (Array.isArray(body.features)) {
    allowed.features = body.features
      .filter((f) => typeof f === 'string')
      .map((f) => sanitizeText(f, 300))
      .slice(0, 20);
  }
  if (Array.isArray(body.featuresAr)) {
    allowed.featuresAr = body.featuresAr
      .filter((f) => typeof f === 'string')
      .map((f) => sanitizeText(f, 300))
      .slice(0, 20);
  }
  if (Array.isArray(body.packSizes)) {
    allowed.packSizes = body.packSizes
      .filter((p) => typeof p === 'string')
      .map((p) => sanitizeText(p, 50))
      .slice(0, 10);
  }

  if (body.specifications && typeof body.specifications === 'object') {
    allowed.specifications = {
      phLevel: sanitizeText(body.specifications.phLevel || '', 50),
      dilution: sanitizeText(body.specifications.dilution || '', 100),
      color: sanitizeText(body.specifications.color || '', 50),
      fragrance: sanitizeText(body.specifications.fragrance || '', 50),
      density: sanitizeText(body.specifications.density || '', 50),
    };
  }

  return allowed;
}

// @desc    Get all products with safe filtering, pagination, and regex ReDoS protection
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, featured, search, sort, page: reqPage, limit: reqLimit } = req.query;
    const query = {};

    // 1. Strict type checking to prevent NoSQL operator injection (e.g. category[$ne]=null)
    if (typeof category === 'string' && category !== 'all' && category.trim() !== '') {
      query.category = category.trim().slice(0, 100);
    }

    if (typeof brand === 'string' && brand !== 'all' && brand.trim() !== '') {
      query.brand = brand.trim().slice(0, 100);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    } else if (featured === 'false') {
      query.isFeatured = false;
    }

    // 2. Safe search query with regex escaping (prevents ReDoS and $where/$expr injection)
    if (typeof search === 'string' && search.trim() !== '') {
      const cleanSearch = escapeRegex(search.trim().slice(0, 100));
      if (cleanSearch.length > 0) {
        const searchRegex = new RegExp(cleanSearch, 'i');
        query.$or = [
          { name: searchRegex },
          { nameAr: searchRegex },
          { description: searchRegex },
          { descriptionAr: searchRegex },
          { category: searchRegex },
          { brand: searchRegex },
        ];
      }
    }

    // 3. Server-side enforced pagination limits (caps max limit to 100 and max page to 1000 to prevent DoS via huge skips)
    const rawPage = parseInt(reqPage, 10) || 1;
    const page = Math.min(Math.max(1, rawPage), 1000);
    const rawLimit = parseInt(reqLimit, 10) || 50;
    const limit = Math.min(Math.max(1, rawLimit), 100);
    const skip = (page - 1) * limit;

    // 4. Safe sorting allowlist
    const sortOption = (typeof sort === 'string' && ALLOWED_SORTS[sort]) ? ALLOWED_SORTS[sort] : { isFeatured: -1, createdAt: -1 };

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching products.',
    });
  }
};

// @desc    Get single product by slug or valid ObjectId
// @route   GET /api/products/:identifier
exports.getProductBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (typeof identifier !== 'string' || identifier.trim() === '') {
      return res.status(400).json({ success: false, message: 'Invalid product identifier' });
    }

    const cleanId = identifier.trim();
    let product;

    if (isValidObjectId(cleanId)) {
      product = await Product.findById(cleanId).lean();
    } else {
      // Clean slug search (alphanumeric and hyphens only)
      const safeSlug = cleanId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 150);
      product = await Product.findOne({ slug: safeSlug }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Create new product (Protected, with mass assignment prevention)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const payload = filterProductPayload(req.body);

    if (!payload.name || !payload.nameAr || !payload.description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name (English and Arabic) and description.',
      });
    }

    // Safe slug generation
    if (!payload.slug) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }

    const product = await Product.create(payload);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? 'A product with this slug already exists.' : error.message,
    });
  }
};

// @desc    Update existing product (Protected, with mass assignment prevention)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const payload = filterProductPayload(req.body);

    const product = await Product.findByIdAndUpdate(identifier, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? 'Duplicate slug conflict' : error.message,
    });
  }
};

// @desc    Delete product (Protected)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!isValidObjectId(identifier)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const product = await Product.findByIdAndDelete(identifier);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
    });
  }
};
