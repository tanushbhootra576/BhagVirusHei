const express = require('express');
const { body } = require('express-validator');
const notificationController = require('../controllers/notification.controller');
const { authenticate, authorizeGovernment } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get user notifications route
router.get('/', authenticate, notificationController.getUserNotifications);

// Mark notifications as read route
router.put(
    '/read',
    authenticate,
    [
        body('notificationIds').isArray().withMessage('Notification IDs must be an array')
    ],
    notificationController.markAsRead
);

// Create notification route (government only)
router.post(
    '/',
    authenticate,
    authorizeGovernment,
    [
        body('recipient').not().isEmpty().withMessage('Recipient is required'),
        body('title').not().isEmpty().withMessage('Title is required'),
        body('message').not().isEmpty().withMessage('Message is required'),
        body('type').isIn(['issue-submission', 'status-update', 'assignment', 'resolution', 'upvote', 'alert', 'system']).withMessage('Invalid notification type')
    ],
    notificationController.createNotification
);

// Delete notifications route
router.delete(
    '/',
    authenticate,
    [
        body('notificationIds').isArray().withMessage('Notification IDs must be an array')
    ],
    notificationController.deleteNotifications
);

module.exports = router;
