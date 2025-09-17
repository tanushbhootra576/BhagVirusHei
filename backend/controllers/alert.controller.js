const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const axios = require('axios');

module.exports = {
    // Get all active alerts
    getAlerts: async (req, res) => {
        try {
            const { lat, lng, radius = 50000, type } = req.query;

            // Build query
            const query = { isActive: true };

            // Filter by type if provided
            if (type) {
                query.type = type;
            }

            // Geospatial query if coordinates provided
            if (lat && lng) {
                query['location.coordinates'] = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseInt(radius)
                    }
                };
            }

            // Execute query
            const alerts = await Alert.find(query).sort({ severity: -1, startTime: -1 });

            res.json(alerts);
        } catch (error) {
            console.error('Get alerts error:', error);
            res.status(500).json({ message: 'Server error while fetching alerts' });
        }
    },

    // Create new alert (government officials only)
    createAlert: async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                title,
                description,
                type,
                severity,
                location,
                startTime,
                endTime,
                source
            } = req.body;

            // Create alert
            const alert = new Alert({
                title,
                description,
                type,
                severity,
                location: {
                    coordinates: [
                        parseFloat(location.longitude),
                        parseFloat(location.latitude)
                    ],
                    city: location.city,
                    state: location.state,
                    radius: location.radius || 5000 // Default 5km radius
                },
                startTime: startTime || Date.now(),
                endTime: endTime || null,
                source: source || 'Government',
                isActive: true
            });

            await alert.save();

            // Emit socket event for real-time alert
            const io = req.app.get('io');
            io.emit('newAlert', alert);

            // Create notifications for users in the affected area
            // Note: In a real application, this would be more sophisticated
            // and would target only users in the affected area
            const users = await User.find({ role: 'citizen' }).limit(100); // Limit for demo

            if (users.length > 0) {
                const notifications = users.map(user => ({
                    recipient: user._id,
                    title: `ALERT: ${title}`,
                    message: description,
                    type: 'alert'
                }));

                await Notification.insertMany(notifications);
            }

            res.status(201).json({
                message: 'Alert created and notifications sent',
                alert
            });
        } catch (error) {
            console.error('Create alert error:', error);
            res.status(500).json({ message: 'Server error while creating alert' });
        }
    },

    // Update alert status (government officials only)
    updateAlertStatus: async (req, res) => {
        try {
            const { isActive, endTime } = req.body;

            // Find alert
            const alert = await Alert.findById(req.params.id);

            if (!alert) {
                return res.status(404).json({ message: 'Alert not found' });
            }

            // Update fields
            if (isActive !== undefined) {
                alert.isActive = isActive;
            }

            if (endTime) {
                alert.endTime = endTime;
            } else if (isActive === false && !alert.endTime) {
                alert.endTime = Date.now();
            }

            await alert.save();

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.emit('alertUpdate', alert);

            res.json({
                message: 'Alert updated successfully',
                alert
            });
        } catch (error) {
            console.error('Update alert error:', error);
            res.status(500).json({ message: 'Server error while updating alert' });
        }
    },

    // Fetch external alerts from APIs (like weather, disaster alerts)
    fetchExternalAlerts: async (req, res) => {
        try {
            const { source, lat, lng } = req.query;

            // Default to a demo response for now
            // In a real application, this would connect to actual weather/disaster APIs

            // Mock implementation for demo purposes
            let alerts = [];

            if (source === 'weather') {
                try {
                    // This is a placeholder - in a real app, you would use an actual weather API
                    // const apiKey = process.env.OPENWEATHER_API_KEY;
                    // const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly,daily&appid=${apiKey}`);

                    // Mock response for demo
                    alerts = [
                        {
                            title: 'Heavy Rain Warning',
                            description: 'Expected rainfall of 100-150mm in the next 24 hours. Take necessary precautions.',
                            type: 'heavy-rain',
                            severity: 'medium',
                            source: 'Weather Service',
                            startTime: new Date(),
                            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                        }
                    ];
                } catch (error) {
                    console.error('Weather API error:', error);
                    alerts = []; // Empty if API fails
                }
            } else if (source === 'disaster') {
                // Mock disaster alerts
                alerts = [
                    {
                        title: 'Flood Warning',
                        description: 'River levels rising in low-lying areas. Stay vigilant and follow local authority instructions.',
                        type: 'flood',
                        severity: 'high',
                        source: 'Disaster Management',
                        startTime: new Date(),
                        endTime: null
                    }
                ];
            }

            res.json(alerts);
        } catch (error) {
            console.error('Fetch external alerts error:', error);
            res.status(500).json({ message: 'Server error while fetching external alerts' });
        }
    }
};
