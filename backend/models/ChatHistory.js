import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
      role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
      },
      content: {
            type: String,
            required: true
      },
      timestamp: {
            type: Date,
            default: Date.now
      }
});

const chatHistorySchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'userModel'
      },
      userModel: {
            type: String,
            enum: ['User', 'Officer', 'Admin'],
            required: true
      },
      messages: [messageSchema],
      createdAt: {
            type: Date,
            default: Date.now
      },
      updatedAt: {
            type: Date,
            default: Date.now
      }
});

// Index for faster queries
chatHistorySchema.index({ userId: 1, updatedAt: -1 });
chatHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

// Update timestamp on save
chatHistorySchema.pre('save', function (next) {
      this.updatedAt = new Date();
      next();
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;