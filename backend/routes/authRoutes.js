import express from 'express';
import {
      register, login, logout, getMe,
      forgotPassword, resetPassword, updatePassword,
} from '../controllers/authController.js';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { protect } from '../middleware/auth.js';
import { registrationUpload } from '../services/uploadService.js';
import {
      registerValidators,
      loginValidators,
      forgotPasswordValidators,
      resetPasswordValidators,
      handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/register', registrationUpload, registerValidators, handleValidationErrors, register);
router.post('/login', loginValidators, handleValidationErrors, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidators, handleValidationErrors, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidators, handleValidationErrors, resetPassword);
router.put('/update-password', protect, updatePassword);

// ── OTP ───────────────────────────────────────────────────────────────────────
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
