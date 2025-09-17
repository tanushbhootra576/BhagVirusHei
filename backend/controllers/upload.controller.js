const crypto = require('crypto');

// Generates a short-lived signature for direct unsigned client uploads (signed mode)
// Client sends: request to /api/uploads/signature then uses returned signature with formData to Cloudinary
// We only expose minimal parameters to reduce risk.
exports.getSignature = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'issues';

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return res.status(500).json({ success: false, message: 'Cloudinary secret not configured' });
    }

    // Construct the signature string as per Cloudinary docs (alphabetical params)
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    return res.json({
      success: true,
      data: {
        timestamp,
        folder,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
      }
    });
  } catch (err) {
    console.error('[getSignature] error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate signature' });
  }
};