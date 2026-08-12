import express from 'express';
import {
      processChatMessage,
      getChatHistory,
      clearChatHistory,
      getQuickQuestions
} from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for chatbot endpoints
const chatbotLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // Limit each IP to 50 requests per windowMs
      message: {
            success: false,
            message: 'Too many chatbot requests. Please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false
});

// Apply rate limiting to all chatbot routes
router.use(chatbotLimiter);

// Public routes
router.post('/message', processChatMessage);
router.get('/quick-questions', getQuickQuestions);

// Protected routes (require authentication)
router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);

export default router;