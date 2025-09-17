const express = require('express');
const router = express.Router();
const { getSignature } = require('../controllers/upload.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /api/uploads/signature -> returns signature for direct Cloudinary upload
router.get('/signature', authenticate, getSignature);

module.exports = router;