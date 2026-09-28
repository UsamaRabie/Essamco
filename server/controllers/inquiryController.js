const Inquiry = require('../models/Inquiry');
const Contact = require('../models/Contact');
const validator = require('validator');
const { isValidObjectId, sanitizeText } = require('../utils/sanitize');

// @desc    Submit new quotation / product inquiry (Public with rate limit & sanitization)
// @route   POST /api/inquiries
exports.createInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, company, productName, productId, quantityNeeded, message } = req.body;

    if (
      typeof fullName !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof message !== 'string' ||
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid text for full name, email, phone number, and message.',
      });
    }

    // Email format validation
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Phone length/character validation
    const cleanPhone = typeof phone === 'string' ? phone.trim().slice(0, 30) : '';
    if (cleanPhone.length < 6 || !/^[0-9+\s()-]+$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact phone number.',
      });
    }

    // Explicit field allowlist (prevents mass-assignment / operator injection)
    const inquiry = await Inquiry.create({
      fullName: sanitizeText(fullName, 120),
      email: cleanEmail,
      phone: cleanPhone,
      company: typeof company === 'string' ? sanitizeText(company, 150) : 'Individual / Business',
      productName: typeof productName === 'string' ? sanitizeText(productName, 200) : 'General Quotation Inquiry',
      productId: typeof productId === 'string' && isValidObjectId(productId) ? productId : '',
      quantityNeeded: typeof quantityNeeded === 'string' ? sanitizeText(quantityNeeded, 100) : 'Bulk',
      message: sanitizeText(message, 3000),
      status: 'pending', // Always default to pending
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our commercial sales team will reach out shortly.',
      data: {
        id: inquiry._id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing inquiry.',
    });
  }
};

// @desc    Get all inquiries (Protected Admin with pagination)
// @route   GET /api/inquiries
exports.getInquiries = async (req, res) => {
  try {
    const { status, page: reqPage, limit: reqLimit } = req.query;
    const query = {};

    if (typeof status === 'string' && ['pending', 'contacted', 'quoted', 'completed'].includes(status)) {
      query.status = status;
    }

    const rawPage = parseInt(reqPage, 10) || 1;
    const page = Math.min(Math.max(1, rawPage), 1000);
    const rawLimit = parseInt(reqLimit, 10) || 50;
    const limit = Math.min(Math.max(1, rawLimit), 100);
    const skip = (page - 1) * limit;

    const [total, inquiries] = await Promise.all([
      Inquiry.countDocuments(query),
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching inquiries.',
    });
  }
};

// @desc    Update inquiry status (Protected Admin)
// @route   PUT /api/inquiries/:id/status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid inquiry ID format' });
    }

    const { status } = req.body;
    const allowedStatuses = ['pending', 'contacted', 'quoted', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    // Only update the status field (mass-assignment protection)
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating inquiry status' });
  }
};

// @desc    Delete inquiry (Protected Admin)
// @route   DELETE /api/inquiries/:id
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid inquiry ID format' });
    }

    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting inquiry' });
  }
};

// @desc    Submit general contact message (Public with rate limit & sanitization)
// @route   POST /api/inquiries/contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid text for name, email, subject, and message.',
      });
    }

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanPhone = typeof phone === 'string' ? phone.trim().slice(0, 30) : '';

    const contact = await Contact.create({
      name: sanitizeText(name, 100),
      email: cleanEmail,
      phone: cleanPhone,
      subject: sanitizeText(subject, 200),
      message: sanitizeText(message, 3000),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Thank you for contacting Essamco!',
      data: { id: contact._id, createdAt: contact.createdAt },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing contact message.',
    });
  }
};

// @desc    Get all contact messages (Protected Admin)
// @route   GET /api/inquiries/contact
exports.getContacts = async (req, res) => {
  try {
    const { page: reqPage, limit: reqLimit } = req.query;
    const rawPage = parseInt(reqPage, 10) || 1;
    const page = Math.min(Math.max(1, rawPage), 1000);
    const rawLimit = parseInt(reqLimit, 10) || 50;
    const limit = Math.min(Math.max(1, rawLimit), 100);
    const skip = (page - 1) * limit;

    const [total, contacts] = await Promise.all([
      Contact.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit },
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching contact messages' });
  }
};

// @desc    Delete contact message (Protected Admin)
// @route   DELETE /api/inquiries/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID format' });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully.',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting message' });
  }
};
