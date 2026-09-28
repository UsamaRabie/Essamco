const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true,
    },
    nameAr: {
      type: String,
      required: [true, 'Please provide brand name in Arabic'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    taglineAr: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    descriptionAr: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#1e3a8a',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BrandSchema.index({ order: 1 });

module.exports = mongoose.model('Brand', BrandSchema);
