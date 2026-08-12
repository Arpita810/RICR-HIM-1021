import mongoose from 'mongoose';

// ── Feedback collection ───────────────────────────────────────────────────────
// Stored in: esamadhan.feedbacks
const feedbackSchema = new mongoose.Schema(
      {
            complaint: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Complaint',
                  required: true,
            },
            citizen: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            officer: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
            },
            rating: {
                  type: Number,
                  required: true,
                  min: 1,
                  max: 5,
            },
            comment: {
                  type: String,
                  trim: true,
                  maxlength: 500,
            },
            tags: [{
                  type: String,
                  enum: ['fast_response', 'helpful', 'professional', 'slow', 'rude', 'unresolved'],
            }],
            isAnonymous: {
                  type: Boolean,
                  default: false,
            },
      },
      { timestamps: true }
);

feedbackSchema.index({ complaint: 1 }, { unique: true });
feedbackSchema.index({ citizen: 1 });
feedbackSchema.index({ officer: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
