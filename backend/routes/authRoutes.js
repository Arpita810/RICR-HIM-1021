import express from 'express';
import {
      register, login, logout, getMe,
      forgotPassword, resetPassword, updatePassword,
} from '../controllers/authController.js';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { protect } from '../middleware/auth.js';
import { registrationUpload } from '../services/uploadService.js';

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/register', registrationUpload, register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-password', protect, updatePassword);

// ── OTP ───────────────────────────────────────────────────────────────────────
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
