const FRONTEND_ENV_RULES = [
      {
            key: 'VITE_API_BASE_URL',
            required: false,
            description: 'API base URL (defaults to /api via Vite proxy)',
      },
      {
            key: 'VITE_API_URL',
            required: false,
            description: 'Optional backend origin URL for socket connections',
      },
      {
            key: 'VITE_SENTRY_DSN',
            required: false,
            description: 'Optional Sentry DSN for error tracking',
      },
];

export function validateFrontendEnv() {
      const missing = [];
      const warnings = [];

      for (const rule of FRONTEND_ENV_RULES) {
            const value = import.meta.env[rule.key];
            if (rule.required && (value === undefined || value === '')) {
                  missing.push({ key: rule.key, description: rule.description });
            }
      }

      if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_URL) {
            warnings.push({
                  key: 'VITE_API_BASE_URL',
                  message: 'Production build has no VITE_API_BASE_URL or VITE_API_URL. Set the Render backend URL in Vercel.',
            });
      }

      return { valid: missing.length === 0, missing, warnings };
}

export function getApiBaseUrl() {
      const configured = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
      if (configured) {
            return configured.replace(/\/$/, '');
      }

      if (import.meta.env.DEV) {
            return 'http://localhost:5000';
      }

      return '';
}

export function getApiOriginUrl() {
      const configured = getApiBaseUrl();
      if (!configured) {
            return '';
      }

      return configured.replace(/\/api\/?$/, '');
}

export function getEnvConfigErrors() {
      const { missing } = validateFrontendEnv();
      if (missing.length === 0) { return null; }
      return missing.map((m) => `${m.key}: ${m.description}`).join('\n');
}
