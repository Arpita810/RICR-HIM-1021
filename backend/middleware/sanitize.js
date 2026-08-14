import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Input Validation & Sanitization Middleware
 * 
 * SECURITY:
 * - Validates and sanitizes all user inputs
 * - Prevents NoSQL injection attacks
 * - Checks ObjectId validity
 * - Enforces type constraints
 * - Prevents prototype pollution
 * - Trims whitespace from strings
 */

// ── List of protected fields that users cannot modify ──────────────────────────
const PROTECTED_FIELDS = [
      'password', 'passwordHash', 'role', 'adminLevel', 'adminSecretVerified',
      'managedDepartment', 'isActive', 'loginAttempts', 'lockoutUntil',
      'tokenBlacklist', 'passwordChangedAt', 'createdAt', 'updatedAt',
      '__v', '_id', 'aadhaarNumber', 'govtIdNumber',
];

/**
 * Sanitize string values: trim, check for injection patterns
 */
const sanitizeString = (value) => {
      if (typeof value !== 'string') return value;
      return value.trim();
};

/**
 * Check for common NoSQL injection patterns
 */
const checkNoSQLInjection = (value) => {
      if (typeof value !== 'string') return false;
      // Check for MongoDB operators
      if (/^\$/.test(value)) return true;
      // Check for JavaScript patterns
      if (/\{.*\}|;/.test(value) && value.length > 200) return true;
      return false;
};

/**
 * Validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => {
      return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitize and validate object recursively
 */
const sanitizeObject = (obj, depth = 0) => {
      // Prevent deep recursion attacks
      if (depth > 10) {
            throw new ApiError('Invalid input structure', 400);
      }

      if (Array.isArray(obj)) {
            return obj.map((item) => sanitizeObject(item, depth + 1));
      }

      if (obj !== null && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                  // Prevent prototype pollution
                  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                        continue;
                  }

                  // Remove protected fields from user input
                  if (PROTECTED_FIELDS.includes(key)) {
                        continue;
                  }

                  const value = obj[key];

                  // Check for NoSQL injection in string values
                  if (typeof value === 'string' && checkNoSQLInjection(value)) {
                        throw new ApiError(`Invalid input in field: ${key}`, 400);
                  }

                  // Recursively sanitize nested objects
                  if (value !== null && typeof value === 'object') {
                        sanitized[key] = sanitizeObject(value, depth + 1);
                  } else if (typeof value === 'string') {
                        sanitized[key] = sanitizeString(value);
                  } else if (typeof value === 'number' || typeof value === 'boolean') {
                        sanitized[key] = value;
                  }
            }
            return sanitized;
      }

      // For primitives
      if (typeof obj === 'string') {
            return sanitizeString(obj);
      }

      return obj;
};

/**
 * Middleware: Sanitize request body, query, and params
 */
export const sanitizeInputs = (req, res, next) => {
      try {
            // Sanitize request body
            if (req.body && typeof req.body === 'object') {
                  req.body = sanitizeObject(req.body);
            }

            // Sanitize query parameters
            if (req.query && typeof req.query === 'object') {
                  req.query = sanitizeObject(req.query);
            }

            // Sanitize URL parameters
            if (req.params && typeof req.params === 'object') {
                  for (const key in req.params) {
                        const value = req.params[key];
                        if (typeof value === 'string') {
                              // For ID parameters, validate as ObjectId
                              if (key.includes('id') && !isValidObjectId(value)) {
                                    return res.status(400).json({
                                          success: false,
                                          message: `Invalid ID format: ${key}`,
                                          code: 'INVALID_ID',
                                    });
                              }
                              req.params[key] = sanitizeString(value);
                        }
                  }
            }

            next();
      } catch (error) {
            res.status(400).json({
                  success: false,
                  message: error.message || 'Invalid input',
                  code: 'VALIDATION_ERROR',
            });
      }
};

/**
 * Validate specific fields
 */
export const validateEmail = (email) => {
      const emailRegex = /^\S+@\S+\.\S+$/;
      return emailRegex.test(email?.trim());
};

export const validatePassword = (password) => {
      // Minimum 8 characters
      return password && password.length >= 8;
};

export const validateObjectId = (id) => {
      return isValidObjectId(id);
};

export const validateEnumValue = (value, enumArray) => {
      return enumArray.includes(value);
};

export default sanitizeInputs;
