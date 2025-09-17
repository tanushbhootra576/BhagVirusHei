const express = require('express');
const { body } = require('express-validator');
const updateController = require('../controllers/update.controller');
const { authenticate, authorizeGovernment } = require('../middlewares/auth.middleware');
const { updateAttachments, handleUploadErrors } = require('../middlewares/upload.middleware');

const router = express.Router();

// Get all government updates route
router.get('/', authenticate, updateController.getUpdates);

// Create new government update route (government only)
router.post(
    '/',
    authenticate,
    authorizeGovernment,
    updateAttachments,
    handleUploadErrors,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('content').not().isEmpty().withMessage('Content is required'),
        body('category').isIn(['news', 'announcement', 'project', 'awareness', 'event', 'other']).withMessage('Invalid category')
    ],
    updateController.createUpdate
);

// Get update by ID route
router.get('/:id', authenticate, updateController.getUpdateById);

// Update government update route (government only)
router.put(
    '/:id',
    authenticate,
    authorizeGovernment,
    updateController.updateGovernmentUpdate
);

// Delete government update route (government only)
router.delete(
    '/:id',
    authenticate,
    authorizeGovernment,
    updateController.deleteUpdate
);

module.exports = router;
