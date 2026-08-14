import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
      Clock, User, FileText, CheckCircle, AlertCircle,
      Upload, MessageSquare, Star, Eye, Zap, Building2,
      ChevronDown, ChevronUp, Loader2, RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getComplaintActivities } from '../api/activities';
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
      complaint_submitted: 'bg-blue-500',
      complaint_viewed: 'bg-gray-500',
      complaint_assigned: 'bg-indigo-500',
      complaint_accepted: 'bg-green-500',
      status_changed: 'bg-purple-500',
      complaint_escalated: 'bg-red-500',
      complaint_reassigned: 'bg-orange-500',
      evidence_uploaded: 'bg-blue-500',
      notes_added: 'bg-teal-500',
      ai_report_generated: 'bg-violet-500',
      complaint_resolved: 'bg-green-500',
      citizen_feedback: 'bg-yellow-500',
      priority_changed: 'bg-orange-500',
      department_changed: 'bg-blue-500',
      due_date_updated: 'bg-gray-500',
      upvoted: 'bg-blue-500',
      emergency_marked: 'bg-red-500',
      duplicate_detected: 'bg-orange-500',
};

// Title mapping for activity types
const ACTIVITY_TITLES = {
      complaint_submitted: 'Complaint Submitted',
      complaint_viewed: 'Complaint Viewed',
      complaint_assigned: 'Complaint Assigned',
      complaint_accepted: 'Complaint Accepted',
      status_changed: 'Status Changed',
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
      upvoted: 'Upvoted',
      emergency_marked: 'Emergency Marked',
      duplicate_detected: 'Duplicate Detected',
};

const ActivityTimeline = ({ complaintId, showHeader = true, limit = 20, autoRefresh = true }) => {
      const { t } = useTranslation();
      const [activities, setActivities] = useState([]);
      const [loading, setLoading] = useState(true);
      const [expanded, setExpanded] = useState(false);
      const [page, setPage] = useState(1);
      const [hasMore, setHasMore] = useState(true);

      const fetchActivities = async (pageNum = 1, append = false) => {
            try {
                  setLoading(true);
                  const res = await getComplaintActivities(complaintId, {
                        page: pageNum,
                        limit
                  });

                  if (res.data?.success) {
                        if (append) {
                              setActivities(prev => [...prev, ...res.data.activities]);
                        } else {
                              setActivities(res.data.activities);
                        }
                        setHasMore(res.data.page < res.data.totalPages);
                  }
            } catch (error) {
                  console.error('Failed to fetch activities:', error);
                  toast.error(t('activityTimeline.fetchError'));
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            if (complaintId) {
                  fetchActivities(1, false);
            }
      }, [complaintId]);

      // Auto-refresh every 30 seconds if enabled
      useEffect(() => {
            if (!autoRefresh || !complaintId) {return;}

            const interval = setInterval(() => {
                  fetchActivities(1, false);
            }, 30000);

            return () => clearInterval(interval);
      }, [autoRefresh, complaintId]);

      const handleLoadMore = () => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchActivities(nextPage, true);
      };

      const formatDate = (dateString) => {
            try {
                  const date = new Date(dateString);
                  const options = {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                  };
                  return date.toLocaleDateString('en-US', options);
            } catch {
                  return dateString;
            }
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

      const getActivityIcon = (activityType) => {
            const IconComponent = ACTIVITY_ICONS[activityType] || FileText;
            return <IconComponent className="w-4 h-4" />;
      };

      const getActivityColor = (activityType) => {
            return ACTIVITY_COLORS[activityType] || 'bg-gray-500';
      };

      const getActivityTitle = (activityType) => {
            return ACTIVITY_TITLES[activityType] || activityType.replace(/_/g, ' ');
      };

      const renderActivityDetails = (activity) => {
            if (!activity.metadata) {return null;}

            switch (activity.actionType) {
                  case 'status_changed':
                        return (
                              <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm">
                                    <div className="flex items-center gap-2">
                                          <span className="font-medium">From:</span>
                                          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                                {activity.previousValue?.status || 'N/A'}
                                          </span>
                                          <span className="font-medium">→</span>
                                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                {activity.newValue?.status || 'N/A'}
                                          </span>
                                    </div>
                                    {activity.metadata.note && (
                                          <p className="mt-1 text-gray-600">{activity.metadata.note}</p>
                                    )}
                              </div>
                        );

                  case 'citizen_feedback':
                        return (
                              <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-sm">
                                    <div className="flex items-center gap-2">
                                          <span className="font-medium">Rating:</span>
                                          <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                      <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < activity.metadata.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                      />
                                                ))}
                                          </div>
                                    </div>
                                    {activity.metadata.feedback && (
                                          <p className="mt-1 text-gray-600 italic">"{activity.metadata.feedback}"</p>
                                    )}
                              </div>
                        );

                  case 'evidence_uploaded':
                        return (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
                                    <p className="font-medium">File: {activity.metadata.filename}</p>
                                    <p className="text-gray-600 text-xs">Type: {activity.metadata.fileType}</p>
                              </div>
                        );

                  case 'notes_added':
                        return (
                              <div className="mt-2 p-2 bg-teal-50 rounded-lg text-sm">
                                    <p className="font-medium">Notes:</p>
                                    <p className="text-gray-600 mt-1">{activity.metadata.notes}</p>
                              </div>
                        );

                  case 'ai_report_generated':
                        return (
                              <div className="mt-2 p-2 bg-violet-50 rounded-lg text-sm">
                                    <p className="font-medium text-violet-700">AI Resolution Report Generated</p>
                                    <p className="text-violet-600 text-xs">Using Gemini AI for comprehensive analysis</p>
                              </div>
                        );

                  default:
                        if (activity.description) {
                              return (
                                    <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                              );
                        }
                        return null;
            }
      };

      const renderUserInfo = (activity) => {
            if (!activity.performedBy) {return null;}

            const user = activity.performedBy;
            return (
                  <div className="flex items-center gap-2 mt-2">
                        {user.profileImage ? (
                              <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="w-6 h-6 rounded-full"
                              />
                        ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="w-3 h-3 text-gray-600" />
                              </div>
                        )}
                        <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                  </div>
            );
      };

      if (loading && activities.length === 0) {
            return (
                  <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading activity timeline...</span>
                  </div>
            );
      }

      if (activities.length === 0) {
            return (
                  <div className="text-center p-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-gray-500">No activities recorded yet</p>
                        <p className="text-sm text-gray-400">Activities will appear here as actions are performed on this complaint</p>
                  </div>
            );
      }

      const displayedActivities = expanded ? activities : activities.slice(0, 5);

      return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {showHeader && (
                        <div className="p-4 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                    <div>
                                          <h3 className="text-lg font-bold text-gray-900">Activity Timeline</h3>
                                          <p className="text-sm text-gray-500">Complete history of all actions performed</p>
                                    </div>
                                    <button
                                          onClick={() => fetchActivities(1, false)}
                                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                          title="Refresh timeline"
                                    >
                                          <RefreshCw className="w-4 h-4" />
                                    </button>
                              </div>
                        </div>
                  )}

                  <div className="p-4">
                        <div className="relative">
                              {/* Timeline line */}
                              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                              <div className="space-y-6">
                                    {displayedActivities.map((activity, index) => (
                                          <motion.div
                                                key={activity._id || index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="relative flex gap-4"
                                          >
                                                {/* Timeline dot */}
                                                <div className="relative z-10">
                                                      <div className={`w-12 h-12 rounded-full ${getActivityColor(activity.actionType)} flex items-center justify-center text-white`}>
                                                            {getActivityIcon(activity.actionType)}
                                                      </div>
                                                </div>

                                                {/* Activity content */}
                                                <div className="flex-1 pb-6">
                                                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                            <div className="flex items-start justify-between">
                                                                  <div>
                                                                        <h4 className="font-bold text-gray-900">
                                                                              {getActivityTitle(activity.actionType)}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                              {getTimeAgo(activity.createdAt)}
                                                                        </p>
                                                                  </div>
                                                                  <span className="text-xs text-gray-400">
                                                                        {formatDate(activity.createdAt)}
                                                                  </span>
                                                            </div>

                                                            {renderActivityDetails(activity)}
                                                            {renderUserInfo(activity)}
                                                      </div>
                                                </div>
                                          </motion.div>
                                    ))}
                              </div>
                        </div>

                        {/* Show more/less toggle */}
                        {activities.length > 5 && (
                              <div className="mt-6 text-center">
                                    <button
                                          onClick={() => setExpanded(!expanded)}
                                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                                    >
                                          {expanded ? (
                                                <>
                                                      <ChevronUp className="w-4 h-4" />
                                                      Show Less
                                                </>
                                          ) : (
                                                <>
                                                      <ChevronDown className="w-4 h-4" />
                                                      Show More ({activities.length - 5} more)
                                                </>
                                          )}
                                    </button>
                              </div>
                        )}

                        {/* Load more button */}
                        {hasMore && expanded && (
                              <div className="mt-4 text-center">
                                    <button
                                          onClick={handleLoadMore}
                                          disabled={loading}
                                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                    >
                                          {loading ? (
                                                <>
                                                      <Loader2 className="w-4 h-4 animate-spin" />
                                                      Loading...
                                                </>
                                          ) : (
                                                'Load More Activities'
                                          )}
                                    </button>
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default ActivityTimeline;