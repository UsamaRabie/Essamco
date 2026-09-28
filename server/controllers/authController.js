const Admin = require('../models/Admin');
const validator = require('validator');

// @desc    Admin login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !email ||
      !password ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Generic error message to prevent account enumeration
    const invalidCredsMessage = 'Invalid email or password.';

    const admin = await Admin.findOne({ email: cleanEmail }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: invalidCredsMessage,
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: invalidCredsMessage,
      });
    }

    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing authentication request.',
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin profile.',
    });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match records.',
      });
    }

    // Set new password (will be hashed in pre-save hook)
    admin.password = newPassword;
    await admin.save();

    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating password.',
    });
  }
};
