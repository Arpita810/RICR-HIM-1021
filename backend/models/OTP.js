import mongoose from 'mongoose';

// ── OTP collection ────────────────────────────────────────────────────────────
// Stored in: esamadhan.otps
const otpSchema = new mongoose.Schema({
      email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
      },
      otp: {
            type: String,
            required: true,
      },
      purpose: {
            type: String,
            enum: ['register', 'login', 'reset_password'],
            default: 'register',
      },
      expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
      verified: {
            type: Boolean,
            default: false,
      },
      attempts: {
            type: Number,
            default: 0,
      },
}, { timestamps: true });

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
