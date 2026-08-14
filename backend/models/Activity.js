import mongoose from 'mongoose';

// ── Activity collection ──────────────────────────────────────────────────────
// Tracks all actions performed on complaints
const activitySchema = new mongoose.Schema(
      {
            // Reference to the complaint
            complaint: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Complaint',
                  required: true,
                  index: true,
            },

            // Action type
            actionType: {
                  type: String,
                  required: true,
                  enum: [
                        'complaint_submitted',      // Citizen submits complaint
                        'complaint_viewed',         // Officer/Admin views complaint
                        'complaint_assigned',       // Admin assigns to officer
                        'complaint_accepted',       // Officer accepts from queue
                        'status_changed',           // Status changed (pending→assigned, etc.)
                        'complaint_escalated',      // Complaint escalated
                        'complaint_reassigned',     // Complaint reassigned to different officer
                        'evidence_uploaded',        // Evidence/attachments added
                        'notes_added',              // Officer notes added
                        'ai_report_generated',      // AI report generated
                        'complaint_resolved',       // Complaint marked as resolved
                        'citizen_feedback',         // Citizen submits feedback
                        'priority_changed',         // Priority changed
                        'department_changed',       // Department changed
                        'due_date_updated',         // Due date updated
                        'upvoted',                  // Citizen upvoted complaint
                        'emergency_marked',         // Marked as emergency
                        'duplicate_detected',       // Duplicate complaint detected
                  ],
            },

            // User who performed the action
            performedBy: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },

            // User role at the time of action
            userRole: {
                  type: String,
                  enum: ['citizen', 'officer', 'admin'],
                  required: true,
            },

            // User name for quick display (cached)
            userName: {
                  type: String,
                  required: true,
            },

            // Action details/description
            description: {
                  type: String,
                  required: true,
            },

            // Additional metadata (JSON)
            metadata: {
                  type: mongoose.Schema.Types.Mixed,
                  default: {},
            },

            // Reference to related entities
            relatedEntity: {
                  type: mongoose.Schema.Types.ObjectId,
                  refPath: 'relatedEntityModel',
            },

            // Model for related entity
            relatedEntityModel: {
                  type: String,
                  enum: ['User', 'Department', 'Attachment', 'Report'],
            },

            // Previous value (for changes)
            previousValue: {
                  type: mongoose.Schema.Types.Mixed,
            },

            // New value (for changes)
            newValue: {
                  type: mongoose.Schema.Types.Mixed,
            },

            // IP address (for audit)
            ipAddress: {
                  type: String,
            },

            // User agent (for audit)
            userAgent: {
                  type: String,
            },
      },
      {
            timestamps: true,
            // Auto-create indexes
            autoIndex: process.env.NODE_ENV === 'development'
      }
);

// Compound index for fast complaint timeline queries
activitySchema.index({ complaint: 1, createdAt: -1 });
activitySchema.index({ performedBy: 1, createdAt: -1 });
activitySchema.index({ actionType: 1, createdAt: -1 });
activitySchema.index({ complaint: 1, actionType: 1 });

// Virtual for formatted date
activitySchema.virtual('formattedDate').get(function () {
      return this.createdAt.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
      });
});

// Virtual for time ago
activitySchema.virtual('timeAgo').get(function () {
      const now = new Date();
      const diffMs = now - this.createdAt;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {return 'Just now';}
      if (diffMins < 60) {return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;}
      if (diffHours < 24) {return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;}
      if (diffDays < 7) {return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;}
      return this.formattedDate;
});

// Pre-save middleware to ensure userName is populated
activitySchema.pre('save', async function (next) {
      if (!this.userName && this.performedBy) {
            try {
                  const User = mongoose.model('User');
                  const user = await User.findById(this.performedBy).select('name');
                  if (user) {
                        this.userName = user.name;
                  }
            } catch (error) {
                  // If user not found, use generic name
                  this.userName = 'System';
            }
      }
      next();
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;