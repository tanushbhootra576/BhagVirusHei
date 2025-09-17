const Update = require('../models/Update');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { validationResult } = require('express-validator');

module.exports = {
    // Get all government updates
    getUpdates: async (req, res) => {
        try {
            const {
                department,
                category,
                city,
                state,
                isActive = true,
                page = 1,
                limit = 10
            } = req.query;

            // Build query
            const query = {};

            if (isActive === 'true') {
                query.isActive = true;
            } else if (isActive === 'false') {
                query.isActive = false;
            }

            // Department filter
            if (department) {
                query.department = department;
            }

            // Category filter
            if (category) {
                query.category = category;
            }

            // Location filters
            if (city) {
                query['location.city'] = city;
            }

            if (state) {
                query['location.state'] = state;
            }

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Execute query
            const updates = await Update.find(query)
                .populate('postedBy', 'name department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Get total count for pagination
            const total = await Update.countDocuments(query);

            res.json({
                updates,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            console.error('Get updates error:', error);
            res.status(500).json({ message: 'Server error while fetching updates' });
        }
    },

    // Create new government update (government officials only)
    createUpdate: async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                title,
                content,
                category,
                location,
                startDate,
                endDate
            } = req.body;

            // Process uploaded files
            const images = req.files?.images?.map(file => `/uploads/images/${file.filename}`) || [];
            const attachments = req.files?.attachments?.map(file => `/uploads/documents/${file.filename}`) || [];

            // Create update
            const update = new Update({
                title,
                content,
                category: category || 'announcement',
                postedBy: req.user.id,
                department: req.user.department,
                images,
                attachments,
                location: location ? {
                    type: 'Point',
                    coordinates: [
                        parseFloat(location.longitude),
                        parseFloat(location.latitude)
                    ],
                    address: location.address,
                    city: location.city,
                    state: location.state
                } : undefined,
                startDate: startDate || Date.now(),
                endDate: endDate || null,
                isActive: true
            });

            await update.save();

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.emit('newGovernmentUpdate', {
                update: await Update.findById(update._id).populate('postedBy', 'name department')
            });

            // Create notifications for citizens in relevant area (if location specified)
            // For demo, we're notifying a limited number of users
            let users = [];

            if (location && location.city) {
                users = await User.find({
                    role: 'citizen',
                    'location.city': location.city
                }).limit(100);
            } else {
                users = await User.find({ role: 'citizen' }).limit(100);
            }

            if (users.length > 0) {
                const notifications = users.map(user => ({
                    recipient: user._id,
                    title: `Government Update: ${title}`,
                    message: `${req.user.department} has shared an update: ${content.substring(0, 100)}...`,
                    type: 'system'
                }));

                await Notification.insertMany(notifications);
            }

            res.status(201).json({
                message: 'Update posted successfully',
                update: await Update.findById(update._id).populate('postedBy', 'name department')
            });
        } catch (error) {
            console.error('Create update error:', error);
            res.status(500).json({ message: 'Server error while creating update' });
        }
    },

    // Get update by ID
    getUpdateById: async (req, res) => {
        try {
            const update = await Update.findById(req.params.id)
                .populate('postedBy', 'name department');

            if (!update) {
                return res.status(404).json({ message: 'Update not found' });
            }

            res.json(update);
        } catch (error) {
            console.error('Get update by ID error:', error);
            res.status(500).json({ message: 'Server error while fetching update' });
        }
    },

    // Update government update (government officials only)
    updateGovernmentUpdate: async (req, res) => {
        try {
            const {
                title,
                content,
                category,
                isActive,
                endDate
            } = req.body;

            // Find update
            const update = await Update.findById(req.params.id);

            if (!update) {
                return res.status(404).json({ message: 'Update not found' });
            }

            // Check if user is authorized (original poster or same department)
            if (update.postedBy.toString() !== req.user.id &&
                update.department !== req.user.department) {
                return res.status(403).json({
                    message: 'Not authorized to update this post'
                });
            }

            // Update fields
            if (title) update.title = title;
            if (content) update.content = content;
            if (category) update.category = category;
            if (isActive !== undefined) update.isActive = isActive;
            if (endDate) update.endDate = endDate;

            await update.save();

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.emit('updateGovernmentUpdate', {
                update: await Update.findById(update._id).populate('postedBy', 'name department')
            });

            res.json({
                message: 'Update modified successfully',
                update: await Update.findById(update._id).populate('postedBy', 'name department')
            });
        } catch (error) {
            console.error('Update government update error:', error);
            res.status(500).json({ message: 'Server error while updating government update' });
        }
    },

    // Delete government update (government officials only)
    deleteUpdate: async (req, res) => {
        try {
            // Find update
            const update = await Update.findById(req.params.id);

            if (!update) {
                return res.status(404).json({ message: 'Update not found' });
            }

            // Check if user is authorized (original poster or same department)
            if (update.postedBy.toString() !== req.user.id &&
                update.department !== req.user.department) {
                return res.status(403).json({
                    message: 'Not authorized to delete this update'
                });
            }

            await update.remove();

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.emit('deleteGovernmentUpdate', {
                updateId: req.params.id
            });

            res.json({ message: 'Update deleted successfully' });
        } catch (error) {
            console.error('Delete update error:', error);
            res.status(500).json({ message: 'Server error while deleting update' });
        }
    }
};
