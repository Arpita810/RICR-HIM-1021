import crypto from 'crypto';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import LivenessSession from '../models/LivenessSession.js';
import sendToken from '../utils/sendToken.js';
import sendEmail, { forgotPasswordEmail } from '../utils/sendEmail.js';
import { resolveDepartmentSlug } from '../utils/departmentResolve.js';

// ── SECURITY: Fields that must NEVER be set/changed via user input ────────────
const PROTECTED_FIELDS = ['role', 'adminLevel', 'adminSecretVerified', 'managedDepartment', 'isActive', 'loginAttempts', 'lockoutUntil', 'tokenBlacklist', 'passwordChangedAt'];

// @desc  Register (Citizen ONLY — admin registration goes through /api/admin/register)
// @route POST /api/auth/register
export const register = async (req, res, next) => {
      try {
            const {
                  name, email, password, phone,
                  // citizen fields
                  address, city, state, govtIdType, govtIdNumber,
                  // otp
                  otpVerified,
            } = req.body;

            // ── SECURITY: This endpoint is for CITIZEN registration ONLY ──────────
            // Admin registration must go through /api/admin/register with ADMIN_SECRET_KEY
            // Officer registration must go through /api/officer/register
            // NEVER trust the 'role' field from the frontend
            const userRole = 'citizen';

            // Validate required fields
            if (!name?.trim()) {
                  return res.status(400).json({ success: false, message: 'Name is required' });
            }
            if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
                  return res.status(400).json({ success: false, message: 'Valid email is required' });
            }
            if (!password || password.length < 8) {
                  return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
            }

            // Check duplicate
            const exists = await User.findOne({ email: email?.toLowerCase() });
            if (exists) {
                  return res.status(400).json({ success: false, message: 'An account with this email already exists' });
            }

            // ✅ MANDATORY: Citizens must pass AI liveness verification
            const { livenessSessionId } = req.body;
            if (!livenessSessionId) {
                  return res.status(400).json({
                        success: false,
                        message: 'AI liveness verification is mandatory. Complete live face checks before registration.',
                  });
            }
            const liveness = await LivenessSession.findOne({
                  sessionId: livenessSessionId,
                  verificationStatus: 'verified',
                  livenessVerified: true,
            });
            if (!liveness) {
                  return res.status(400).json({
                        success: false,
                        message: 'Invalid or incomplete liveness verification. Please complete live verification again.',
                  });
            }
            if (liveness.email && liveness.email !== email?.toLowerCase()) {
                  return res.status(403).json({
                        success: false,
                        message: 'Liveness session does not match registration email.',
                  });
            }
            if (!req.files?.liveImage?.[0]) {
                  return res.status(400).json({
                        success: false,
                        message: 'Live capture image is required after liveness verification.',
                  });
            }

            // Build user data — role is ALWAYS 'citizen'
            const userData = { name, email, password, role: userRole, phone };

            const { pincode, latitude, longitude, nearbyLocation, completeAddress, dob, gender } = req.body;
            Object.assign(userData, {
                  nearbyLocation,
                  completeAddress,
                  address: completeAddress || req.body.address, // legacy fallback
                  city, state, pincode, latitude, longitude,
                  dob, gender,
                  govtIdType, govtIdNumber,
            });

            // File uploads
            if (req.files) {
                  if (req.files.profileImage?.[0]) {
                        userData.profileImage = `/uploads/profiles/${req.files.profileImage[0].filename}`;
                  }
                  if (req.files.govtIdImage?.[0]) {
                        userData.govtIdImage = `/uploads/profiles/${req.files.govtIdImage[0].filename}`;
                  }
                  if (req.files.liveImage?.[0]) {
                        userData.liveImage = `/uploads/profiles/${req.files.liveImage[0].filename}`;
                  }
            }

            // Mark OTP verified if confirmed
            if (otpVerified === 'true' || otpVerified === true) {
                  userData.otpVerified = true;
                  userData.isEmailVerified = true;
            }

            const user = await User.create(userData);
            sendToken(user, 201, res, `Welcome to e-Samadhan AI, ${user.name}!`);
      } catch (error) {
            next(error);
      }
};

// @desc  Login
// @route POST /api/auth/login
export const login = async (req, res, next) => {
      try {
            const { email, password } = req.body;
            if (!email || !password) {
                  return res.status(400).json({ success: false, message: 'Please provide email and password' });
            }

            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.matchPassword(password))) {
                  // Increment login attempts on failure (if user exists)
                  if (user) {await user.incrementLoginAttempts();}
                  return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            // Check account lockout
            if (user.isLocked()) {
                  return res.status(401).json({
                        success: false,
                        message: 'Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.',
                  });
            }

            if (!user.isActive) {
                  return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
            }

            // Reset login attempts on successful login
            await user.resetLoginAttempts();

            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false });
            sendToken(user, 200, res, `Welcome back, ${user.name}!`);
      } catch (error) {
            next(error);
      }
};

// @desc  Logout
// @route POST /api/auth/logout
export const logout = async (req, res, next) => {
      try {
            // Blacklist the current token so it can't be reused
            const token = req.cookies?.token
                  || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

            if (token && req.user?.id) {
                  try {
                        const user = await User.findById(req.user.id);
                        if (user && user.addToBlacklist) {
                              const decoded = await import('jsonwebtoken').then(jwt => jwt.default.decode(token));
                              const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                              await user.addToBlacklist(token, expiresAt);
                        }
                  } catch {
                        // Token blacklisting is best-effort; don't block logout
                  }
            }

            res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
            res.status(200).json({ success: true, message: 'Logged out successfully' });
      } catch (error) { next(error); }
};

// @desc  Get me (citizen, officer, admin, or legacy user admin)
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
      try {
            const u = req.user;
            if (!u) {
                  return res.status(401).json({ success: false, message: 'Not authorized' });
            }
            // SECURITY: Never expose password, tokens, or sensitive internal fields
            const user = {
                  _id: u._id,
                  id: u._id || u.id,
                  name: u.name,
                  email: u.email,
                  role: u.role,
                  phone: u.phone || u.mobile,
                  department: u.department,
                  managedDepartment: u.managedDepartment || u.department,
                  employeeId: u.employeeId,
                  adminLevel: u.adminLevel,
                  officerStatus: u.officerStatus,
                  profileImage: u.profileImage,
                  isEmailVerified: u.isEmailVerified,
                  createdAt: u.createdAt,
            };
            res.status(200).json({ success: true, user });
      } catch (error) { next(error); }
};

// @desc  Forgot password
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
      try {
            const { email } = req.body;
            if (!email) {return res.status(400).json({ success: false, message: 'Email is required' });}

            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent.' });
            }

            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
            try {
                  await sendEmail({ to: user.email, subject: 'e-Samadhan AI — Password Reset', html: forgotPasswordEmail(user.name, resetUrl) });
                  res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
            } catch {
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpire = undefined;
                  await user.save({ validateBeforeSave: false });
                  res.status(500).json({ success: false, message: 'Email could not be sent.' });
            }
      } catch (error) { next(error); }
};

// @desc  Reset password
// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
      try {
            const { password } = req.body;
            if (!password || password.length < 8) {
                  return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
            }
            const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
            const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });
            if (!user) {return res.status(400).json({ success: false, message: 'Invalid or expired token.' });}

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            sendToken(user, 200, res, 'Password reset successful!');
      } catch (error) { next(error); }
};

// @desc  Update password
// @route PUT /api/auth/update-password
export const updatePassword = async (req, res, next) => {
      try {
            const { currentPassword, newPassword } = req.body;
            if (!newPassword || newPassword.length < 8) {
                  return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
            }
            const user = await User.findById(req.user.id).select('+password');
            if (!(await user.matchPassword(currentPassword))) {
                  return res.status(401).json({ success: false, message: 'Current password is incorrect' });
            }
            user.password = newPassword;
            await user.save();
            sendToken(user, 200, res, 'Password updated successfully');
      } catch (error) { next(error); }
};
