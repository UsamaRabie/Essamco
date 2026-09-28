const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide message subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
