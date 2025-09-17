const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

module.exports = {
    // Get user notifications
    getUserNotifications: async (req, res) => {
        try {
            const { page = 1, limit = 20, unreadOnly = false } = req.query;

            // Build query
            const query = { recipient: req.user.id };

            if (unreadOnly === 'true') {
                query.isRead = false;
            }

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Execute query
            const notifications = await Notification.find(query)
                .populate('relatedIssue', 'title category status')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Get total count for pagination
            const total = await Notification.countDocuments(query);

            // Get unread count
            const unreadCount = await Notification.countDocuments({
                recipient: req.user.id,
                isRead: false
            });

            res.json({
                notifications,
                unreadCount,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ message: 'Server error while fetching notifications' });
        }
    },

    // Mark notifications as read
    markAsRead: async (req, res) => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !notificationIds.length) {
                return res.status(400).json({ message: 'Notification IDs are required' });
            }

            // Check if it's for all notifications
            if (notificationIds.includes('all')) {
                await Notification.updateMany(
                    { recipient: req.user.id, isRead: false },
                    { isRead: true }
                );

                return res.json({ message: 'All notifications marked as read' });
            }

            // Update specified notifications
            const result = await Notification.updateMany(
                {
                    _id: { $in: notificationIds },
                    recipient: req.user.id // Ensure user only updates their own notifications
                },
                { isRead: true }
            );

            res.json({
                message: 'Notifications marked as read',
                updated: result.nModified
            });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ message: 'Server error while updating notifications' });
        }
    },

    // Create a new notification (for system or admin use)
    createNotification: async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { recipient, title, message, type, relatedIssue } = req.body;

            // Create notification
            const notification = new Notification({
                recipient,
                title,
                message,
                type,
                relatedIssue
            });

            await notification.save();

            // Emit socket event for real-time notification
            const io = req.app.get('io');
            io.to(recipient.toString()).emit('newNotification', notification);

            res.status(201).json({
                message: 'Notification created successfully',
                notification
            });
        } catch (error) {
            console.error('Create notification error:', error);
            res.status(500).json({ message: 'Server error while creating notification' });
        }
    },

    // Delete notifications
    deleteNotifications: async (req, res) => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !notificationIds.length) {
                return res.status(400).json({ message: 'Notification IDs are required' });
            }

            // Check if it's for all notifications
            if (notificationIds.includes('all')) {
                await Notification.deleteMany({ recipient: req.user.id });
                return res.json({ message: 'All notifications deleted' });
            }

            // Delete specified notifications
            const result = await Notification.deleteMany({
                _id: { $in: notificationIds },
                recipient: req.user.id // Ensure user only deletes their own notifications
            });

            res.json({
                message: 'Notifications deleted',
                deleted: result.deletedCount
            });
        } catch (error) {
            console.error('Delete notifications error:', error);
            res.status(500).json({ message: 'Server error while deleting notifications' });
        }
    }
};
