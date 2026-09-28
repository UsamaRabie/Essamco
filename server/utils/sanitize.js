const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Validates if string is a valid MongoDB ObjectId
 */
function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Escapes characters with special regex meaning to prevent ReDoS
 */
function escapeRegex(text) {
  if (typeof text !== 'string') return '';
  return text.slice(0, 100).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Sanitizes plain text input by stripping HTML tags and trimming
 */
function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, maxLength);
  // Strip dangerous tags and script patterns
  return validator.stripLow(trimmed)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
}

/**
 * Validates file buffer magic bytes for allowed image formats (JPEG, PNG, WEBP)
 */
function validateImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG magic bytes: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpeg) return 'jpeg';

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (isPng) return 'png';

  // WEBP magic bytes: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  const isWebp =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isWebp) return 'webp';

  return false;
}

/**
 * Recursively scans and purges prototype pollution keys (__proto__, constructor, prototype)
 * and enforces a safe maximum object nesting depth
 */
function cleanPrototypeKeys(obj, depth = 0) {
  if (depth > 12) {
    throw new Error('Payload nesting exceeds safe limit (max depth: 12)');
  }
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      cleanPrototypeKeys(obj[i], depth + 1);
    }
    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      cleanPrototypeKeys(obj[key], depth + 1);
    }
  }
  return obj;
}

module.exports = {
  isValidObjectId,
  escapeRegex,
  sanitizeText,
  validateImageBuffer,
  cleanPrototypeKeys,
};
