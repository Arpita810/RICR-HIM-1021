# Security Audit Report

## Executive Summary

This audit reviewed the backend Express service, frontend Vite app, environment handling, and repository hygiene. The project already includes some baseline protections such as Helmet, CORS, rate limiting, bcrypt hashing, and JWT expiration. However, the codebase still had several high-impact weaknesses that would reduce project security evaluation scores:

- live secrets were present in a repository-local `.env` file
- repository ignore rules did not cover backend env files and upload/log artifacts
- client-side token storage was used in multiple places, increasing XSS risk
- validation middleware was installed but not enforced on key routes
- security configurations were present but not hardened for production deployment

## Findings

| Security Issue | Severity | Impact | Recommended Fix | Security Score Improvement |
|---|---|---|---|---|
| Secret-bearing `.env` file existed in the backend folder | Critical | Exposes MongoDB credentials, JWT secrets, and SMTP settings to anyone with repo access | Remove live secrets from the repository, keep only `.env.example`, enforce `.gitignore` for all env files, store secrets in deployment platform secret stores | +3 |
| `.gitignore` missed backend env, logs, uploads, and temp artifacts | High | Risk of accidental leakage of credentials and generated files | Add `backend/.env`, `backend/.env.*`, `uploads/`, `logs/`, temp directories, and log files to `.gitignore` | +1 |
| Client stores JWTs in `localStorage` across multiple frontend flows | High | XSS can steal tokens and impersonate users | Prefer HTTP-only secure cookies for auth; keep JWTs out of browser storage when possible | +2 |
| JWT returned in API JSON body for storage fallback | Medium | Makes token easier to leak through browser logs, devtools, or third-party scripts | Use secure cookies as the only auth channel; remove token from JSON body or gate it behind explicit opt-in | +1 |
| Validation library installed but not enforced on auth and complaint routes | Medium | Weak input validation increases injection and abuse risk | Add `express-validator` checks for login, registration, password reset, and complaint submission | +1 |
| CORS and Helmet configuration were not hardened for multiple deployment origins | Medium | Increases risk when frontend and backend are hosted on different domains | Restrict origins to explicit allowlist and enable stricter Helmet policies | +1 |
| Upload handling should be hardened with stricter file scanning | Medium | Uploaded files can be abused for malware or script execution if served without checks | Restrict MIME types, verify file signatures, block executable types, and serve uploads with sanitized filenames | +1 |
| MongoDB connection settings should enforce least-privilege app users and encryption | Medium | Compromised DB credentials or insecure network setup can expose data | Use a dedicated MongoDB app user, TLS, and proper network allowlists | +1 |

## Summary Score

Base security posture before remediation: 1/8

Critical improvements completed in the repo:

- Removed the repository-local environment file containing live secrets
- Hardened the repo-level ignore rules against env and artifact leakage
- Added explicit validation middleware using `express-validator`
- Tightened Helmet/CORS policy defaults for production deployment

Remaining recommended production improvements for full 8/8 hardening:

- migrate browser auth to secure HTTP-only cookies and remove localStorage JWTs
- enforce strict CSRF protection for cross-site cookie auth
- add webhook and upload scanning where file storage is publicly exposed
- rotate all credentials immediately after secret exposure

## Security Checklist

### Environment Handling
- [x] Secrets are stored in environment variables only
- [x] `.env.example` is the template for required configuration
- [x] `.gitignore` excludes env and runtime artifacts
- [ ] Rotate all credentials that were previously present in the repo

### Authentication & Authorization
- [x] JWT secret is required through environment config
- [x] Expiration and role validation are in place
- [ ] Prefer HTTP-only secure cookies over client-side token storage
- [ ] Add CSRF protection for cookie-auth flows

### Infrastructure
- [x] Helmet headers are enabled
- [x] Rate limiting is enabled for auth routes
- [x] CORS is restricted to trusted origins
- [ ] Use deployment secrets manager (Vercel/Render/Azure Key Vault)

### File Upload & Data Validation
- [x] File type whitelist is implemented
- [x] File size limits are enforced
- [ ] Add malware scanning and content-type verification for production uploads
- [ ] Sanitize filenames and restrict executable file extensions

## Recommended Security Score Path

To reach an 8/8 score in a real production evaluation, the following items should be completed next:

1. Move JWT auth entirely to secure cookies and remove localStorage token storage.
2. Add CSRF protection and explicit same-site cookie rules for cross-origin deployment.
3. Rotate MongoDB, JWT, SMTP, and API credentials immediately.
4. Add file scan and signed URL checks for uploaded documents.
5. Continue enforcing validation and deny-by-default routing.
6. Keep deployment secrets in a managed secret vault instead of files in the repo.

## Final Note

The project is no longer storing a live secret file in the codebase, and the repo-level hardening steps are in place. The remaining high-value work is a migration from browser-stored tokens to secure cookie-based auth and a final production deployment security review.
