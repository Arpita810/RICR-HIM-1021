import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get activities for a specific complaint
 * @param {string} complaintId - Complaint ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise} API response
 */
export const getComplaintActivities = async (complaintId, options = {}) => {
      const { page = 1, limit = 20 } = options;

      try {
            const response = await axios.get(`${API_BASE}/activities/complaint/${complaintId}`, {
                  params: { page, limit },
                  withCredentials: true
            });
            return response;
      } catch (error) {
            console.error('Error fetching complaint activities:', error);
            throw error;
      }
};

/**
 * Get recent activities for current user
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise} API response
 */
export const getUserRecentActivities = async (limit = 20) => {
      try {
            const response = await axios.get(`${API_BASE}/activities/user/recent`, {
                  params: { limit },
                  withCredentials: true
            });
            return response;
      } catch (error) {
            console.error('Error fetching user activities:', error);
            throw error;
      }
};

/**
 * Get dashboard activities (for officers/admins)
 * @param {Object} options - Query options
 * @param {number} options.limit - Items per page
 * @param {string} options.department - Department filter
 * @returns {Promise} API response
 */
export const getDashboardActivities = async (options = {}) => {
      const { limit = 30, department } = options;

      try {
            const response = await axios.get(`${API_BASE}/activities/dashboard`, {
                  params: { limit, department },
                  withCredentials: true
            });
            return response;
      } catch (error) {
            console.error('Error fetching dashboard activities:', error);
            throw error;
      }
};

/**
 * Log complaint viewed activity
 * @param {string} complaintId - Complaint ID
 * @returns {Promise} API response
 */
export const logComplaintViewed = async (complaintId) => {
      try {
            const response = await axios.post(`${API_BASE}/activities/log-view`,
                  { complaintId },
                  { withCredentials: true }
            );
            return response;
      } catch (error) {
            console.error('Error logging view activity:', error);
            // Don't throw - this shouldn't break the main functionality
            return { data: { success: false } };
      }
};

/**
 * Get activity statistics (admin only)
 * @returns {Promise} API response
 */
export const getActivityStats = async () => {
      try {
            const response = await axios.get(`${API_BASE}/activities/stats`, {
                  withCredentials: true
            });
            return response;
      } catch (error) {
            console.error('Error fetching activity stats:', error);
            throw error;
      }
};

export default {
      getComplaintActivities,
      getUserRecentActivities,
      getDashboardActivities,
      logComplaintViewed,
      getActivityStats
};