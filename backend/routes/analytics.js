const express = require('express');
const router = express.Router();
const { getPersonalAnalytics, getClassroomAnalytics, getWeaknessDetectionData, getWeaknessReport, getTimeOptimizationData, getAssignmentRisk, getHeatmapData, getBurnoutAnalysis } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { requireOwner } = require('../middleware/ownerMiddleware');

router.get('/user', protect, getPersonalAnalytics);
router.get('/class/:id', protect, requireOwner, getClassroomAnalytics);
router.get('/weakness-data', protect, getWeaknessDetectionData);
router.get('/weakness-report', protect, getWeaknessReport);
router.get('/time-optimization', protect, getTimeOptimizationData);
router.get('/assignment-risk', protect, getAssignmentRisk);
router.get('/heatmap', protect, getHeatmapData);
router.get('/burnout-analysis', protect, getBurnoutAnalysis);

module.exports = router;
