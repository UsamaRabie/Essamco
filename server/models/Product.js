const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name in English'],
      trim: true,
    },
    nameAr: {
      type: String,
      required: [true, 'Please provide product name in Arabic'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify category slug'],
      ref: 'Category',
    },
    brand: {
      type: String,
      required: [true, 'Please specify brand slug'],
      ref: 'Brand',
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    featuresAr: {
      type: [String],
      default: [],
    },
    specifications: {
      phLevel: { type: String, default: 'Neutral (7.0 - 8.0)' },
      dilution: { type: String, default: 'Ready to use / 1:10 to 1:50' },
      color: { type: String, default: 'Clear Blue / Green / Amber' },
      fragrance: { type: String, default: 'Fresh Pine / Lemon / Unscented' },
      density: { type: String, default: '1.02 - 1.05 g/cm³' },
    },
    packSizes: {
      type: [String],
      default: ['1L Bottle', '4L Canister', '20L Jerrycan', '200L Drum'],
    },
    image: {
      type: String,
      default: '/images/products/product-placeholder.png',
    },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound indexes to prevent full collection scans on filtered/sorted queries
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ brand: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: -1, createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
