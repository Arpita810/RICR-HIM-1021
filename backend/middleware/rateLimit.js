/**
 * Rate Limiting Middleware
 * Prevents brute force attacks on sensitive endpoints
 */

const rateLimitStore = new Map();

/**
 * Create a rate limiter for specific endpoints
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} keyGenerator - Function to generate rate limit key (default: IP address)
 */
export const createRateLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
      return (req, res, next) => {
            const key = `${req.ip}-${req.path}`;
            const now = Date.now();
            const userAttempts = rateLimitStore.get(key) || [];

            // Clean up old attempts outside the window
            const recentAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);

            if (recentAttempts.length >= maxAttempts) {
                  return res.status(429).json({
                        success: false,
                        message: `Too many attempts. Please try again after ${Math.ceil(windowMs / 60000)} minutes.`,
                        retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000),
                  });
            }

            // Add current attempt
            recentAttempts.push(now);
            rateLimitStore.set(key, recentAttempts);

            // Set retry-after header
            if (recentAttempts.length > 0) {
                  const oldestAttempt = Math.min(...recentAttempts);
                  const retryAfterSeconds = Math.ceil((oldestAttempt + windowMs - now) / 1000);
                  res.setHeader('Retry-After', Math.max(0, retryAfterSeconds));
            }

            next();
      };
};

/**
 * Rate limiter for login endpoints
 * 5 attempts per 15 minutes
 */
export const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000);

/**
 * Rate limiter for registration endpoints
 * 3 attempts per hour
 */
export const registerRateLimiter = createRateLimiter(3, 60 * 60 * 1000);

/**
 * Rate limiter for password reset endpoints
 * 3 attempts per hour
 */
export const passwordResetRateLimiter = createRateLimiter(3, 60 * 60 * 1000);

/**
 * Rate limiter for OTP verification
 * 5 attempts per 10 minutes
 */
export const otpRateLimiter = createRateLimiter(5, 10 * 60 * 1000);

/**
 * Clear rate limit for user (used after successful authentication)
 */
export const clearRateLimit = (req) => {
      const key = `${req.ip}-${req.path}`;
      rateLimitStore.delete(key);
};

/**
 * Cleanup old entries from rate limit store (run periodically)
 */
export const cleanupRateLimitStore = () => {
      const now = Date.now();
      const TTL = 30 * 60 * 1000; // 30 minutes
      for (const [key, attempts] of rateLimitStore.entries()) {
            const recentAttempts = attempts.filter(timestamp => now - timestamp < TTL);
            if (recentAttempts.length === 0) {
                  rateLimitStore.delete(key);
            } else {
                  rateLimitStore.set(key, recentAttempts);
            }
      }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
