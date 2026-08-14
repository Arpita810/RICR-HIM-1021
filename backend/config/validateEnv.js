const REQUIRED = [
      { key: 'MONGO_URI', description: 'MongoDB connection string' },
      { key: 'JWT_SECRET', description: 'JWT signing secret (min 32 chars recommended)' },
];

const RECOMMENDED = [
      { key: 'CLIENT_URL', description: 'Frontend URL for CORS' },
      { key: 'SMTP_HOST', description: 'Email SMTP host (for OTP / password reset)' },
      { key: 'GEMINI_API_KEY', description: 'Google Gemini API key (for AI features)' },
];

export function validateEnv() {
      const missing = [];
      const warnings = [];

      // Check required variables
      for (const { key, description } of REQUIRED) {
            if (!process.env[key]?.trim()) {
                  missing.push({ key, description });
            }
      }

      // ── SECURITY: Enforce strong JWT_SECRET ──────────────────────────────────
      if (process.env.JWT_SECRET) {
            if (process.env.JWT_SECRET.length < 32) {
                  warnings.push({
                        key: 'JWT_SECRET',
                        message: 'JWT_SECRET should be at least 32 characters. Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
                  });
            }
            // Check for weak/predictable patterns
            if (/admin|secret|key|password|123|test/i.test(process.env.JWT_SECRET)) {
                  warnings.push({
                        key: 'JWT_SECRET',
                        message: 'JWT_SECRET appears to use predictable patterns. Use a cryptographically random value.',
                  });
            }
      }

      // ── SECURITY: Enforce strong ADMIN_SECRET_KEY ──────────────────────────────
      if (process.env.ADMIN_SECRET_KEY && process.env.ADMIN_SECRET_KEY.length < 32) {
            warnings.push({
                  key: 'ADMIN_SECRET_KEY',
                  message: 'ADMIN_SECRET_KEY should be at least 32 characters. Generate a strong random value.',
            });
      }

      // ── SECURITY: Warn if MongoDB credentials are weak ──────────────────────────
      if (process.env.MONGO_URI && /(\w+):(\1)/.test(process.env.MONGO_URI)) {
            warnings.push({
                  key: 'MONGO_URI',
                  message: 'MongoDB username and password appear to be identical or weak. Use strong credentials.',
            });
      }

      // Check recommended variables
      for (const { key, description } of RECOMMENDED) {
            if (!process.env[key]?.trim()) {
                  warnings.push({ key, message: `Missing ${key}: ${description}` });
            }
      }

      return { valid: missing.length === 0, missing, warnings };
}

export function printEnvReport() {
      const { valid, missing, warnings } = validateEnv();

      if (warnings.length) {
            console.warn('\n⚠️  Environment warnings:');
            warnings.forEach((w) => console.warn(`   • ${w.key}: ${w.message}`));
      }

      if (!valid) {
            console.error('\n❌ Missing required environment variables:\n');
            missing.forEach((m) => console.error(`   • ${m.key} — ${m.description}`));
            console.error('\n   Copy backend/.env.example to backend/.env and fill in values.\n');
            if (process.env.NODE_ENV === 'production') {
                  process.exit(1);
            }
      }

      return valid;
}
