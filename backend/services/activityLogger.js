import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

/**
 * Activity Logger Service
 * Centralized service for logging all complaint-related activities
 */

// Action type configurations
const ACTION_CONFIGS = {
      complaint_submitted: {
            icon: '📝',
            color: 'blue',
            title: 'Complaint Submitted',
      },
      complaint_viewed: {
            icon: '👁️',
            color: 'gray',
            title: 'Complaint Viewed',
      },
      complaint_assigned: {
            icon: '👤',
            color: 'indigo',
            title: 'Complaint Assigned',
      },
      complaint_accepted: {
            icon: '✅',
            color: 'green',
            title: 'Complaint Accepted',
      },
      status_changed: {
            icon: '🔄',
            color: 'purple',
            title: 'Status Changed',
      },
      complaint_escalated: {
            icon: '🚨',
            color: 'red',
            title: 'Complaint Escalated',
      },
      complaint_reassigned: {
            icon: '🔄',
            color: 'orange',
            title: 'Complaint Reassigned',
      },
      evidence_uploaded: {
            icon: '📎',
            color: 'blue',
            title: 'Evidence Uploaded',
      },
      notes_added: {
            icon: '📝',
            color: 'teal',
            title: 'Notes Added',
      },
      ai_report_generated: {
            icon: '🤖',
            color: 'violet',
            title: 'AI Report Generated',
      },
      complaint_resolved: {
            icon: '✅',
            color: 'green',
            title: 'Complaint Resolved',
      },
      citizen_feedback: {
            icon: '⭐',
            color: 'yellow',
            title: 'Citizen Feedback',
      },
      priority_changed: {
            icon: '⚡',
            color: 'orange',
            title: 'Priority Changed',
      },
      department_changed: {
            icon: '🏢',
            color: 'blue',
            title: 'Department Changed',
      },
      due_date_updated: {
            icon: '📅',
            color: 'gray',
            title: 'Due Date Updated',
      },
      upvoted: {
            icon: '👍',
            color: 'blue',
            title: 'Upvoted',
      },
      emergency_marked: {
            icon: '🚨',
            color: 'red',
            title: 'Emergency Marked',
      },
      duplicate_detected: {
            icon: '🔍',
            color: 'orange',
            title: 'Duplicate Detected',
      },
};

/**
 * Log an activity
 * @param {Object} params - Activity parameters
 * @param {string} params.complaintId - Complaint ID
 * @param {string} params.actionType - Type of action
 * @param {string} params.performedBy - User ID who performed the action
 * @param {string} params.userRole - User role (citizen, officer, admin)
 * @param {string} params.description - Action description
 * @param {Object} params.metadata - Additional metadata
 * @param {Object} params.previousValue - Previous value (for changes)
 * @param {Object} params.newValue - New value (for changes)
 * @param {string} params.ipAddress - IP address
 * @param {string} params.userAgent - User agent
 * @returns {Promise<Object>} Created activity
 */
export const logActivity = async ({
      complaintId,
      actionType,
      performedBy,
      userRole,
      description,
      metadata = {},
      previousValue = null,
      newValue = null,
      ipAddress = null,
      userAgent = null,
}) => {
      try {
            console.log(`📝 [activityLogger] Logging activity: ${actionType} for complaint ${complaintId}`);

            const activity = new Activity({
                  complaint: complaintId,
                  actionType,
                  performedBy,
                  userRole,
                  description,
                  metadata,
                  previousValue,
                  newValue,
                  ipAddress,
                  userAgent,
            });

            await activity.save();
            console.log(`✅ [activityLogger] Activity logged: ${activity._id}`);

            return activity;
      } catch (error) {
            console.error('❌ [activityLogger] Failed to log activity:', error.message);
            // Don't throw - activity logging should not break main functionality
            return null;
      }
};

/**
 * Get activities for a complaint
 * @param {string} complaintId - Complaint ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit results
 * @param {number} options.skip - Skip results
 * @param {string} options.sort - Sort field
 * @param {string} options.order - Sort order (asc/desc)
 * @returns {Promise<Array>} List of activities
 */
export const getComplaintActivities = async (complaintId, options = {}) => {
      try {
            const {
                  limit = 50,
                  skip = 0,
                  sort = 'createdAt',
                  order = 'desc',
            } = options;

            const activities = await Activity.find({ complaint: complaintId })
                  .populate('performedBy', 'name email profileImage role')
                  .populate('relatedEntity')
                  .sort({ [sort]: order === 'asc' ? 1 : -1 })
                  .skip(skip)
                  .limit(limit)
                  .lean();

            // Enhance activities with config data
            return activities.map(activity => ({
                  ...activity,
                  config: ACTION_CONFIGS[activity.actionType] || {
                        icon: '📌',
                        color: 'gray',
                        title: activity.actionType.replace(/_/g, ' ').toUpperCase(),
                  },
            }));
      } catch (error) {
            console.error('❌ [activityLogger] Failed to get activities:', error.message);
            return [];
      }
};

/**
 * Get recent activities for a user
 * @param {string} userId - User ID
 * @param {number} limit - Limit results
 * @returns {Promise<Array>} List of activities
 */
export const getUserRecentActivities = async (userId, limit = 20) => {
      try {
            const activities = await Activity.find({ performedBy: userId })
                  .populate('complaint', 'complaintId title status')
                  .sort({ createdAt: -1 })
                  .limit(limit)
                  .lean();

            return activities.map(activity => ({
                  ...activity,
                  config: ACTION_CONFIGS[activity.actionType] || {
                        icon: '📌',
                        color: 'gray',
                        title: activity.actionType.replace(/_/g, ' ').toUpperCase(),
                  },
            }));
      } catch (error) {
            console.error('❌ [activityLogger] Failed to get user activities:', error.message);
            return [];
      }
};

/**
 * Log complaint submission
 * @param {string} complaintId - Complaint ID
 * @param {string} citizenId - Citizen ID
 * @param {string} title - Complaint title
 * @param {Object} metadata - Additional metadata
 */
export const logComplaintSubmitted = async (complaintId, citizenId, title, metadata = {}) => {
      return logActivity({
            complaintId,
            actionType: 'complaint_submitted',
            performedBy: citizenId,
            userRole: 'citizen',
            description: `Complaint "${title}" submitted`,
            metadata: {
                  title,
                  ...metadata,
            },
      });
};

/**
 * Log complaint assignment
 * @param {string} complaintId - Complaint ID
 * @param {string} adminId - Admin ID
 * @param {string} officerId - Officer ID
 * @param {string} officerName - Officer name
 */
export const logComplaintAssigned = async (complaintId, adminId, officerId, officerName) => {
      return logActivity({
            complaintId,
            actionType: 'complaint_assigned',
            performedBy: adminId,
            userRole: 'admin',
            description: `Complaint assigned to officer ${officerName}`,
            metadata: { assignedOfficer: officerId },
      });
};

/**
 * Log complaint acceptance from queue
 * @param {string} complaintId - Complaint ID
 * @param {string} officerId - Officer ID
 * @param {string} officerName - Officer name
 */
export const logComplaintAccepted = async (complaintId, officerId, officerName) => {
      return logActivity({
            complaintId,
            actionType: 'complaint_accepted',
            performedBy: officerId,
            userRole: 'officer',
            description: `Officer ${officerName} accepted the complaint from queue`,
      });
};

/**
 * Log status change
 * @param {string} complaintId - Complaint ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {string} userName - User name
 * @param {string} previousStatus - Previous status
 * @param {string} newStatus - New status
 * @param {string} note - Optional note
 */
export const logStatusChange = async (complaintId, userId, userRole, userName, previousStatus, newStatus, note = '') => {
      const description = note || `Status changed from ${previousStatus} to ${newStatus}`;

      return logActivity({
            complaintId,
            actionType: 'status_changed',
            performedBy: userId,
            userRole,
            description,
            previousValue: { status: previousStatus },
            newValue: { status: newStatus },
            metadata: { note },
      });
};

/**
 * Log AI report generation
 * @param {string} complaintId - Complaint ID
 * @param {string} officerId - Officer ID
 * @param {string} officerName - Officer name
 */
export const logAIReportGenerated = async (complaintId, officerId, officerName) => {
      return logActivity({
            complaintId,
            actionType: 'ai_report_generated',
            performedBy: officerId,
            userRole: 'officer',
            description: `AI Resolution Report generated by ${officerName}`,
      });
};

/**
 * Log complaint resolution
 * @param {string} complaintId - Complaint ID
 * @param {string} officerId - Officer ID
 * @param {string} officerName - Officer name
 * @param {string} resolutionNotes - Resolution notes
 */
export const logComplaintResolved = async (complaintId, officerId, officerName, resolutionNotes = '') => {
      return logActivity({
            complaintId,
            actionType: 'complaint_resolved',
            performedBy: officerId,
            userRole: 'officer',
            description: `Complaint resolved by ${officerName}`,
            metadata: { resolutionNotes },
      });
};

/**
 * Log citizen feedback
 * @param {string} complaintId - Complaint ID
 * @param {string} citizenId - Citizen ID
 * @param {string} citizenName - Citizen name
 * @param {number} rating - Rating (1-5)
 * @param {string} feedback - Feedback text
 */
export const logCitizenFeedback = async (complaintId, citizenId, citizenName, rating, feedback = '') => {
      return logActivity({
            complaintId,
            actionType: 'citizen_feedback',
            performedBy: citizenId,
            userRole: 'citizen',
            description: `Citizen ${citizenName} submitted feedback (${rating} stars)`,
            metadata: { rating, feedback },
      });
};

/**
 * Log evidence upload
 * @param {string} complaintId - Complaint ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {string} userName - User name
 * @param {string} filename - File name
 * @param {string} fileType - File type
 */
export const logEvidenceUploaded = async (complaintId, userId, userRole, userName, filename, fileType) => {
      return logActivity({
            complaintId,
            actionType: 'evidence_uploaded',
            performedBy: userId,
            userRole,
            description: `${userName} uploaded evidence: ${filename}`,
            metadata: { filename, fileType },
      });
};

/**
 * Log notes added
 * @param {string} complaintId - Complaint ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {string} userName - User name
 * @param {string} notes - Notes text
 */
export const logNotesAdded = async (complaintId, userId, userRole, userName, notes) => {
      const preview = notes.length > 50 ? notes.substring(0, 50) + '...' : notes;
      return logActivity({
            complaintId,
            actionType: 'notes_added',
            performedBy: userId,
            userRole,
            description: `${userName} added notes: "${preview}"`,
            metadata: { notes },
      });
};

/**
 * Log complaint viewed
 * @param {string} complaintId - Complaint ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {string} userName - User name
 */
export const logComplaintViewed = async (complaintId, userId, userRole, userName) => {
      return logActivity({
            complaintId,
            actionType: 'complaint_viewed',
            performedBy: userId,
            userRole,
            description: `${userName} viewed the complaint`,
      });
};

export default {
      logActivity,
      getComplaintActivities,
      getUserRecentActivities,
      logComplaintSubmitted,
      logComplaintAssigned,
      logComplaintAccepted,
      logStatusChange,
      logAIReportGenerated,
      logComplaintResolved,
      logCitizenFeedback,
      logEvidenceUploaded,
      logNotesAdded,
      logComplaintViewed,
      ACTION_CONFIGS,
};