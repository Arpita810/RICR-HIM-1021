import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  const buf = crypto.randomBytes(3);
  const num = (buf.readUIntBE(0, 3) % 900000) + 100000;
  return String(num);
};

/**
 * Generate OTP expiry timestamp
 * @param {number} minutes - expiry in minutes (default 10)
 * @returns {Date}
 */
export const getOTPExpiry = (minutes = 10) =>
  new Date(Date.now() + minutes * 60 * 1000);

export default generateOTP;
