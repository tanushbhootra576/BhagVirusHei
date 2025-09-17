const multer = require('multer');
// Use memory storage so we can pipe buffers to Cloudinary without touching disk
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images, audio, and common document types
    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('audio/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Export middleware for different upload scenarios
module.exports = {
    // For issue reporting (multiple images and one optional voice note)
    issueUpload: upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'voiceNote', maxCount: 1 }
    ]),

    // For profile pictures
    profilePicture: upload.single('profilePicture'),

    // For resolution proof (multiple images)
    resolutionImages: upload.array('resolutionImages', 5),

    // For government updates (multiple images and documents)
    updateAttachments: upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),

    // Error handling middleware
    handleUploadErrors: (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
            }
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    }
};
