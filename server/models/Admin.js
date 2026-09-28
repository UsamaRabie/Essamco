const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide admin name'],
      default: 'Essamco Admin',
    },
    email: {
      type: String,
      required: [true, 'Please provide admin email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'superadmin',
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving, record passwordChangedAt, and increment tokenVersion
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
  this.tokenVersion = (this.tokenVersion || 0) + 1;
  next();
});

// Compare entered password with hashed password in DB
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Verify if token was issued before the latest password change (prevents token reuse)
AdminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Sign JWT Token
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, tokenVersion: this.tokenVersion || 0 },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '8h',
    }
  );
};

module.exports = mongoose.model('Admin', AdminSchema);
