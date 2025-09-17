const express = require('express');
const { body } = require('express-validator');
const alertController = require('../controllers/alert.controller');
const { authenticate, authorizeGovernment } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get all active alerts route
router.get('/', authenticate, alertController.getAlerts);

// Create new alert route (government only)
router.post(
    '/',
    authenticate,
    authorizeGovernment,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('description').not().isEmpty().withMessage('Description is required'),
        body('type').isIn(['flood', 'earthquake', 'heavy-rain', 'cyclone', 'heatwave', 'other']).withMessage('Invalid alert type'),
        body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
        body('location.latitude').isFloat().withMessage('Valid latitude is required'),
        body('location.longitude').isFloat().withMessage('Valid longitude is required')
    ],
    alertController.createAlert
);

// Update alert status route (government only)
router.put(
    '/:id',
    authenticate,
    authorizeGovernment,
    alertController.updateAlertStatus
);

// Fetch external alerts route
router.get('/external', authenticate, alertController.fetchExternalAlerts);

module.exports = router;
