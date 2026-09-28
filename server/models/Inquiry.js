const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your contact phone number'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: 'Individual / Not specified',
    },
    productName: {
      type: String,
      default: 'General Product Inquiry',
    },
    productId: {
      type: String,
      default: '',
    },
    quantityNeeded: {
      type: String,
      default: 'Bulk / Commercial',
    },
    message: {
      type: String,
      required: [true, 'Please provide inquiry details'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'quoted', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Index to prevent unindexed queries on admin dashboard filters
InquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', InquirySchema);
