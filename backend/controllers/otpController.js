import crypto from 'crypto';
import OTP from '../models/OTP.js';
import sendEmail, { otpEmailTemplate } from '../utils/sendEmail.js';

// ── Secure 6-digit OTP ────────────────────────────────────────────────────────
const generateOTP = () => {
      const buf = crypto.randomBytes(3);
      return String((buf.readUIntBE(0, 3) % 900000) + 100000);
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Send OTP
// @route POST /api/auth/send-otp
// @access Public
// ─────────────────────────────────────────────────────────────────────────────
export const sendOTP = async (req, res, next) => {
      try {
            const { email, purpose = 'register' } = req.body;

            // ── Validation ──────────────────────────────────────────────────────────
            if (!email?.trim()) {
                  return res.status(400).json({ success: false, message: 'Email address is required' });
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                  return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
            }
            const validPurposes = ['register', 'login', 'reset_password'];
            if (!validPurposes.includes(purpose)) {
                  return res.status(400).json({ success: false, message: 'Invalid OTP purpose' });
            }

            const normalEmail = email.toLowerCase().trim();

            // ── Rate limit: 1 OTP per 60 seconds ────────────────────────────────────
            const recent = await OTP.findOne({
                  email: normalEmail,
                  purpose,
                  createdAt: { $gt: new Date(Date.now() - 60_000) },
            });
            if (recent) {
                  const wait = Math.ceil((recent.createdAt.getTime() + 60_000 - Date.now()) / 1000);
                  return res.status(429).json({
                        success: false,
                        message: `Please wait ${wait} second${wait !== 1 ? 's' : ''} before requesting a new OTP.`,
                  });
            }

            // ── Delete old OTPs, create new ──────────────────────────────────────────
            await OTP.deleteMany({ email: normalEmail, purpose });

            const otp = generateOTP();
            const hashed = crypto.createHash('sha256').update(otp).digest('hex');

            await OTP.create({
                  email: normalEmail,
                  otp: hashed,
                  purpose,
                  expiresAt: new Date(Date.now() + 10 * 60_000),
            });

            // ── Always log in dev ────────────────────────────────────────────────────
            console.log('\n┌─────────────────────────────────────────┐');
            console.log(`│  📧 OTP for: ${normalEmail.padEnd(27)}│`);
            console.log(`│  🔑 Code:    ${otp.padEnd(27)}│`);
            console.log(`│  📋 Purpose: ${purpose.padEnd(27)}│`);
            console.log('└─────────────────────────────────────────┘\n');

            // ── Try to send email ────────────────────────────────────────────────────
            let emailSent = false;
            let emailError = null;

            try {
                  await sendEmail({
                        to: email,
                        subject: `${otp} — Your e-Samadhan AI Verification Code`,
                        html: otpEmailTemplate(otp, purpose),
                        text: `Your e-Samadhan AI OTP is: ${otp}\nValid for 10 minutes.\nDo NOT share this with anyone.`,
                  });
                  emailSent = true;
            } catch (err) {
                  emailError = err.message;
                  console.error(`❌ Email failed: ${err.message}`);
            }

            // ── Response ─────────────────────────────────────────────────────────────
            if (emailSent) {
                  return res.status(200).json({
                        success: true,
                        message: `OTP sent to ${email}. Valid for 10 minutes.`,
                  });
            }

            // Email failed — in dev mode still succeed (OTP is in console)
            if (process.env.NODE_ENV === 'development') {
                  return res.status(200).json({
                        success: true,
                        message: `OTP generated! Email delivery failed (dev mode). Check server console for the OTP code.`,
                        devNote: `SMTP not working: ${emailError}. OTP is printed in the server terminal.`,
                  });
            }

            // Production: email failure = real error
            await OTP.deleteMany({ email: normalEmail, purpose });
            return res.status(500).json({
                  success: false,
                  message: 'Failed to send OTP email. Please check your email address and try again.',
            });

      } catch (error) {
            next(error);
      }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Verify OTP
// @route POST /api/auth/verify-otp
// @access Public
// ─────────────────────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res, next) => {
      try {
            const { email, otp, purpose = 'register' } = req.body;

            if (!email?.trim() || !otp?.trim()) {
                  return res.status(400).json({ success: false, message: 'Email and OTP are required' });
            }
            if (!/^\d{6}$/.test(otp)) {
                  return res.status(400).json({ success: false, message: 'OTP must be exactly 6 digits' });
            }

            const normalEmail = email.toLowerCase().trim();

            const record = await OTP.findOne({
                  email: normalEmail,
                  purpose,
                  verified: false,
            });

            if (!record) {
                  return res.status(400).json({
                        success: false,
                        message: 'OTP not found or already used. Please request a new one.',
                  });
            }

            if (record.expiresAt < new Date()) {
                  await OTP.deleteOne({ _id: record._id });
                  return res.status(400).json({
                        success: false,
                        message: 'OTP has expired. Please request a new one.',
                  });
            }

            if (record.attempts >= 5) {
                  await OTP.deleteOne({ _id: record._id });
                  return res.status(400).json({
                        success: false,
                        message: 'Too many failed attempts. Please request a new OTP.',
                  });
            }

            const hashedInput = crypto.createHash('sha256').update(otp).digest('hex');

            if (hashedInput !== record.otp) {
                  record.attempts += 1;
                  await record.save();
                  const left = 5 - record.attempts;
                  return res.status(400).json({
                        success: false,
                        message: left > 0
                              ? `Incorrect OTP. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
                              : 'Incorrect OTP. No attempts remaining. Please request a new OTP.',
                  });
            }

            // ✅ Correct
            record.verified = true;
            await record.save();

            console.log(`✅ OTP verified for ${normalEmail} (${purpose})`);

            return res.status(200).json({
                  success: true,
                  message: 'Email verified successfully!',
            });

      } catch (error) {
            next(error);
      }
};
