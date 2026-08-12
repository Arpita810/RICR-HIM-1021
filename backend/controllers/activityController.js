import Activity from '../models/Activity.js';
import Complaint from '../models/Complaint.js';
import asyncHandler from '../middleware/asyncHandler.js';
import activityLogger from '../services/activityLogger.js';

// @desc    Get activities for a complaint
// @route   GET /api/activities/complaint/:complaintId
// @access  Private (Citizen, Officer, Admin)
export const getComplaintActivities = asyncHandler(async (req, res) => {
      const { complaintId } = req.params;
      const { limit = 50, page = 1 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      console.log(`📋 [activityController] Fetching activities for complaint ${complaintId}`);

      // Check if complaint exists and user has access
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
            return res.status(404).json({
                  success: false,
                  message: 'Complaint not found'
            });
      }

      // Authorization check
      const isCitizenOwner = complaint.citizen.toString() === req.user._id.toString();
      const isAssignedOfficer = complaint.assignedOfficer && complaint.assignedOfficer.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';
      const isOfficer = req.user.role === 'officer';

      if (!isCitizenOwner && !isAssignedOfficer && !isAdmin && !isOfficer) {
            return res.status(403).json({
                  success: false,
                  message: 'Not authorized to view activities for this complaint'
            });
      }

      // Get activities
      const activities = await activityLogger.getComplaintActivities(complaintId, {
            limit: parseInt(limit),
            skip,
            sort: 'createdAt',
            order: 'desc'
      });

      // Get total count
      const total = await Activity.countDocuments({ complaint: complaintId });

      res.status(200).json({
            success: true,
            count: activities.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            activities
      });
});

// @desc    Get recent activities for current user
// @route   GET /api/activities/user/recent
// @access  Private
export const getUserRecentActivities = asyncHandler(async (req, res) => {
      const { limit = 20 } = req.query;

      console.log(`📋 [activityController] Fetching recent activities for user ${req.user._id}`);

      const activities = await activityLogger.getUserRecentActivities(
            req.user._id,
            parseInt(limit)
      );

      res.status(200).json({
            success: true,
            count: activities.length,
            activities
      });
});

// @desc    Get dashboard activities (for admin/officer)
// @route   GET /api/activities/dashboard
// @access  Private (Officer, Admin)
export const getDashboardActivities = asyncHandler(async (req, res) => {
      const { limit = 30, department } = req.query;

      if (req.user.role !== 'admin' && req.user.role !== 'officer') {
            return res.status(403).json({
                  success: false,
                  message: 'Access denied: Officers and Admins only'
            });
      }

      console.log(`📋 [activityController] Fetching dashboard activities for ${req.user.role}`);

      let query = {};

      // For officers, only show activities from their department
      if (req.user.role === 'officer' && req.user.department) {
            // Get complaints from officer's department
            const departmentComplaints = await Complaint.find({
                  department: req.user.department
            }).select('_id');

            const complaintIds = departmentComplaints.map(c => c._id);
            query.complaint = { $in: complaintIds };
      }

      // For admins with department filter
      if (req.user.role === 'admin' && department) {
            const departmentComplaints = await Complaint.find({
                  department: department
            }).select('_id');

            const complaintIds = departmentComplaints.map(c => c._id);
            query.complaint = { $in: complaintIds };
      }

      const activities = await Activity.find(query)
            .populate('complaint', 'complaintId title status')
            .populate('performedBy', 'name email profileImage role')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

      // Enhance activities with config data
      const enhancedActivities = activities.map(activity => ({
            ...activity,
            config: activityLogger.ACTION_CONFIGS[activity.actionType] || {
                  icon: '📌',
                  color: 'gray',
                  title: activity.actionType.replace(/_/g, ' ').toUpperCase(),
            },
      }));

      res.status(200).json({
            success: true,
            count: enhancedActivities.length,
            activities: enhancedActivities
      });
});

// @desc    Log complaint viewed activity
// @route   POST /api/activities/log-view
// @access  Private
export const logComplaintViewed = asyncHandler(async (req, res) => {
      const { complaintId } = req.body;

      if (!complaintId) {
            return res.status(400).json({
                  success: false,
                  message: 'Complaint ID is required'
            });
      }

      // Check if complaint exists
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
            return res.status(404).json({
                  success: false,
                  message: 'Complaint not found'
            });
      }

      // Log activity
      await activityLogger.logComplaintViewed(
            complaintId,
            req.user._id,
            req.user.role,
            req.user.name
      );

      res.status(200).json({
            success: true,
            message: 'View activity logged'
      });
});

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private (Admin)
export const getActivityStats = asyncHandler(async (req, res) => {
      if (req.user.role !== 'admin') {
            return res.status(403).json({
                  success: false,
                  message: 'Access denied: Admins only'
            });
      }

      // Get activity counts by type
      const activityCounts = await Activity.aggregate([
            {
                  $group: {
                        _id: '$actionType',
                        count: { $sum: 1 }
                  }
            },
            { $sort: { count: -1 } }
      ]);

      // Get daily activity trend (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailyTrend = await Activity.aggregate([
            {
                  $match: {
                        createdAt: { $gte: sevenDaysAgo }
                  }
            },
            {
                  $group: {
                        _id: {
                              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                        },
                        count: { $sum: 1 }
                  }
            },
            { $sort: { _id: 1 } }
      ]);

      // Get top active users
      const topUsers = await Activity.aggregate([
            {
                  $group: {
                        _id: '$performedBy',
                        count: { $sum: 1 }
                  }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
      ]);

      // Populate user names
      const User = (await import('../models/User.js')).default;
      const userIds = topUsers.map(item => item._id);
      const users = await User.find({ _id: { $in: userIds } }).select('name email role');

      const topUsersWithNames = topUsers.map(item => {
            const user = users.find(u => u._id.toString() === item._id.toString());
            return {
                  userId: item._id,
                  name: user ? user.name : 'Unknown',
                  email: user ? user.email : '',
                  role: user ? user.role : '',
                  activityCount: item.count
            };
      });

      res.status(200).json({
            success: true,
            stats: {
                  totalActivities: await Activity.countDocuments(),
                  activityCounts,
                  dailyTrend,
                  topUsers: topUsersWithNames,
                  mostActiveDay: dailyTrend.length > 0 ?
                        dailyTrend.reduce((max, day) => day.count > max.count ? day : max) :
                        null
            }
      });
});

export default {
      getComplaintActivities,
      getUserRecentActivities,
      getDashboardActivities,
      logComplaintViewed,
      getActivityStats
};