import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token
 * @param {object} payload - { id, role }
 * @param {string} expiresIn - e.g. '7d', '1h'
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') =>
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {object} decoded payload
 */
export const verifyToken = (token) =>
      jwt.verify(token, process.env.JWT_SECRET);

export default generateToken;
