import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
      Clock, User, FileText, CheckCircle, AlertCircle,
      Upload, MessageSquare, Star, Eye, Zap, Building2,
      Loader2, RefreshCw, TrendingUp, Activity as ActivityIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDashboardActivities } from '../api/activities';
import toast from 'react-hot-toast';

// Icon mapping for activity types
const ACTIVITY_ICONS = {
      complaint_submitted: FileText,
      complaint_viewed: Eye,
      complaint_assigned: User,
      complaint_accepted: CheckCircle,
      status_changed: RefreshCw,
      complaint_escalated: AlertCircle,
      complaint_reassigned: User,
      evidence_uploaded: Upload,
      notes_added: MessageSquare,
      ai_report_generated: Zap,
      complaint_resolved: CheckCircle,
      citizen_feedback: Star,
      priority_changed: AlertCircle,
      department_changed: Building2,
      due_date_updated: Clock,
      upvoted: Star,
      emergency_marked: AlertCircle,
      duplicate_detected: AlertCircle,
};

// Color mapping for activity types
const ACTIVITY_COLORS = {
      complaint_submitted: 'text-blue-500 bg-blue-50',
      complaint_viewed: 'text-gray-500 bg-gray-50',
      complaint_assigned: 'text-indigo-500 bg-indigo-50',
      complaint_accepted: 'text-green-500 bg-green-50',
      status_changed: 'text-purple-500 bg-purple-50',
      complaint_escalated: 'text-red-500 bg-red-50',
      complaint_reassigned: 'text-orange-500 bg-orange-50',
      evidence_uploaded: 'text-blue-500 bg-blue-50',
      notes_added: 'text-teal-500 bg-teal-50',
      ai_report_generated: 'text-violet-500 bg-violet-50',
      complaint_resolved: 'text-green-500 bg-green-50',
      citizen_feedback: 'text-yellow-500 bg-yellow-50',
      priority_changed: 'text-orange-500 bg-orange-50',
      department_changed: 'text-blue-500 bg-blue-50',
      due_date_updated: 'text-gray-500 bg-gray-50',
      upvoted: 'text-blue-500 bg-blue-50',
      emergency_marked: 'text-red-500 bg-red-50',
      duplicate_detected: 'text-orange-500 bg-orange-50',
};

const DashboardActivityFeed = ({ department, limit = 15, autoRefresh = true }) => {
      const { t } = useTranslation();
      const [activities, setActivities] = useState([]);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);

      const fetchActivities = async () => {
            try {
                  setLoading(true);
                  const res = await getDashboardActivities({
                        limit,
                        department
                  });

                  if (res.data?.success) {
                        setActivities(res.data.activities);
                  }
            } catch (error) {
                  console.error('Failed to fetch dashboard activities:', error);
                  toast.error(t('dashboardActivity.fetchError'));
            } finally {
                  setLoading(false);
                  setRefreshing(false);
            }
      };

      useEffect(() => {
            fetchActivities();
      }, [department]);

      // Auto-refresh every 60 seconds if enabled
      useEffect(() => {
            if (!autoRefresh) {return;}

            const interval = setInterval(() => {
                  fetchActivities();
            }, 60000);

            return () => clearInterval(interval);
      }, [autoRefresh, department]);

      const handleRefresh = () => {
            setRefreshing(true);
            fetchActivities();
      };

      const getActivityIcon = (activityType) => {
            const IconComponent = ACTIVITY_ICONS[activityType] || ActivityIcon;
            return <IconComponent className="w-4 h-4" />;
      };

      const getActivityColor = (activityType) => {
            return ACTIVITY_COLORS[activityType] || 'text-gray-500 bg-gray-50';
      };

      const getActivityTitle = (activityType) => {
            const titles = {
                  complaint_submitted: 'New Complaint',
                  complaint_viewed: 'Complaint Viewed',
                  complaint_assigned: 'Complaint Assigned',
                  complaint_accepted: 'Complaint Accepted',
                  status_changed: 'Status Updated',
                  complaint_escalated: 'Complaint Escalated',
                  complaint_reassigned: 'Complaint Reassigned',
                  evidence_uploaded: 'Evidence Uploaded',
                  notes_added: 'Notes Added',
                  ai_report_generated: 'AI Report Generated',
                  complaint_resolved: 'Complaint Resolved',
                  citizen_feedback: 'Citizen Feedback',
                  priority_changed: 'Priority Changed',
                  department_changed: 'Department Changed',
                  due_date_updated: 'Due Date Updated',
                  upvoted: 'Complaint Upvoted',
                  emergency_marked: 'Emergency Marked',
                  duplicate_detected: 'Duplicate Detected',
            };
            return titles[activityType] || activityType.replace(/_/g, ' ');
      };

      const getTimeAgo = (dateString) => {
            try {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffMs = now - date;
                  const diffSec = Math.floor(diffMs / 1000);
                  const diffMin = Math.floor(diffSec / 60);
                  const diffHour = Math.floor(diffMin / 60);
                  const diffDay = Math.floor(diffHour / 24);
                  const diffWeek = Math.floor(diffDay / 7);
                  const diffMonth = Math.floor(diffDay / 30);
                  const diffYear = Math.floor(diffDay / 365);

                  if (diffSec < 60) {return 'just now';}
                  if (diffMin < 60) {return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;}
                  if (diffHour < 24) {return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;}
                  if (diffDay < 7) {return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;}
                  if (diffWeek < 4) {return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;}
                  if (diffMonth < 12) {return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;}
                  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
            } catch {
                  return '';
            }
      };

      const getComplaintLink = (complaint) => {
            if (!complaint) {return '#';}
            return `/complaint/${complaint._id}`;
      };

      if (loading && activities.length === 0) {
            return (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-center p-8">
                              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                              <span className="ml-2 text-gray-600">Loading activities...</span>
                        </div>
                  </div>
            );
      }

      if (activities.length === 0) {
            return (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="text-center p-8">
                              <ActivityIcon className="w-12 h-12 text-gray-300 mx-auto" />
                              <p className="mt-2 text-gray-500">No recent activities</p>
                              <p className="text-sm text-gray-400">Activities will appear here as they happen</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                          <TrendingUp className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                          <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                                          <p className="text-sm text-gray-500">Real-time updates from your department</p>
                                    </div>
                              </div>
                              <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                    title="Refresh activities"
                              >
                                    {refreshing ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                          <RefreshCw className="w-4 h-4" />
                                    )}
                              </button>
                        </div>
                  </div>

                  {/* Activities List */}
                  <div className="divide-y divide-gray-100">
                        {activities.map((activity, index) => (
                              <motion.div
                                    key={activity._id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                              >
                                    <div className="flex items-start gap-3">
                                          {/* Activity Icon */}
                                          <div className={`p-2 rounded-lg ${getActivityColor(activity.actionType)}`}>
                                                {getActivityIcon(activity.actionType)}
                                          </div>

                                          {/* Activity Content */}
                                          <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                      <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                  {getActivityTitle(activity.actionType)}
                                                            </h4>
                                                            {activity.complaint && (
                                                                  <a
                                                                        href={getComplaintLink(activity.complaint)}
                                                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                                  >
                                                                        {activity.complaint.complaintId}: {activity.complaint.title}
                                                                  </a>
                                                            )}
                                                      </div>
                                                      <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {getTimeAgo(activity.createdAt)}
                                                      </span>
                                                </div>

                                                {/* User Info */}
                                                {activity.performedBy && (
                                                      <div className="flex items-center gap-2 mt-2">
                                                            {activity.performedBy.profileImage ? (
                                                                  <img
                                                                        src={activity.performedBy.profileImage}
                                                                        alt={activity.performedBy.name}
                                                                        className="w-5 h-5 rounded-full"
                                                                  />
                                                            ) : (
                                                                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        <User className="w-3 h-3 text-gray-600" />
                                                                  </div>
                                                            )}
                                                            <div>
                                                                  <p className="text-sm text-gray-700">{activity.performedBy.name}</p>
                                                                  <p className="text-xs text-gray-500 capitalize">{activity.performedBy.role}</p>
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Activity Description */}
                                                {activity.description && (
                                                      <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                                                )}

                                                {/* Status Badge */}
                                                {activity.complaint && (
                                                      <div className="mt-2">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${activity.complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                                  activity.complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                        activity.complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                              'bg-gray-100 text-gray-800'
                                                                  }`}>
                                                                  {activity.complaint.status.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </motion.div>
                        ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                        <div className="text-center">
                              <p className="text-sm text-gray-500">
                                    Showing {activities.length} most recent activities
                              </p>
                              {autoRefresh && (
                                    <p className="text-xs text-gray-400 mt-1">
                                          Auto-refreshes every minute
                                    </p>
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default DashboardActivityFeed;