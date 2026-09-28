const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name in English'],
      trim: true,
    },
    nameAr: {
      type: String,
      required: [true, 'Please provide category name in Arabic'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    descriptionAr: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Layers',
    },
    image: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1 });

module.exports = mongoose.model('Category', CategorySchema);
