import mongoose from 'mongoose';

// ── Notification collection ───────────────────────────────────────────────────
// Stored in: esamadhan.notifications
const notificationSchema = new mongoose.Schema(
      {
            recipient: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            type: {
                  type: String,
                  enum: [
                        'complaint_filed',
                        'complaint_assigned',
                        'status_update',
                        'complaint_resolved',
                        'complaint_rejected',
                        'escalation',
                        'feedback_request',
                        'system',
                  ],
                  required: true,
            },
            title: { type: String, required: true, trim: true },
            message: { type: String, required: true, trim: true },
            // Optional link to the related complaint
            complaint: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Complaint',
                  default: null,
            },
            isRead: { type: Boolean, default: false },
            readAt: { type: Date },
            // For push / email delivery tracking
            channels: {
                  inApp: { type: Boolean, default: true },
                  email: { type: Boolean, default: false },
                  sms: { type: Boolean, default: false },
            },
      },
      { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
