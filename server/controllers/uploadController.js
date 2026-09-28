const cloudinary = require('../config/cloudinary');
const { validateImageBuffer } = require('../utils/sanitize');

// @desc    Upload image to Cloudinary (Protected Admin, strictly validated)
// @route   POST /api/upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file.',
      });
    }

    // 1. Verify actual file buffer magic bytes (prevents extension spoofing / polyglots)
    const detectedFormat = validateImageBuffer(req.file.buffer);
    if (!detectedFormat) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only authentic JPEG, PNG, and WEBP files are permitted.',
      });
    }

    // 2. Upload to Cloudinary with secure constraints
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'essamco/products',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
          { max_bytes: 5 * 1024 * 1024 }, // 5MB cap
        ],
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error.message || error);
          return res.status(500).json({
            success: false,
            message: 'Cloudinary upload processing failed.',
          });
        }

        res.status(200).json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    // End stream with file buffer
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('[Upload Controller Error]', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing file upload.',
    });
  }
};
