import express from 'express';
import {
      getComplaintActivities,
      getUserRecentActivities,
      getDashboardActivities,
      logComplaintViewed,
      getActivityStats
} from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get activities for a specific complaint
router.get('/complaint/:complaintId', getComplaintActivities);

// Get recent activities for current user
router.get('/user/recent', getUserRecentActivities);

// Get dashboard activities (for officers/admins)
router.get('/dashboard', authorize('officer', 'admin'), getDashboardActivities);

// Log complaint viewed activity
router.post('/log-view', logComplaintViewed);

// Get activity statistics (admin only)
router.get('/stats', authorize('admin'), getActivityStats);

export default router;