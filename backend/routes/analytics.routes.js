const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorizeGovernment } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get overall statistics route (government only)
router.get('/overall', authenticate, authorizeGovernment, analyticsController.getOverallStats);

// Get trend data route (government only)
router.get('/trends', authenticate, authorizeGovernment, analyticsController.getTrendData);

// Get heatmap data route
router.get('/heatmap', authenticate, analyticsController.getHeatmapData);

// Get department metrics route (government only)
router.get('/departments', authenticate, authorizeGovernment, analyticsController.getDepartmentMetrics);

// Get user engagement metrics route (government only)
router.get('/user-engagement', authenticate, authorizeGovernment, analyticsController.getUserEngagementMetrics);

module.exports = router;
