# e-Samadhan AI — Authentication & Authorization Analysis

**Last Updated:** 2026-08-14  
**Project:** e-Samadhan AI — Smart Government Grievance Platform  
**Scope:** Backend (Node.js + MongoDB) + Frontend (React)

---

## 📋 Executive Summary

The e-Samadhan AI project implements a **multi-role authentication system** with support for Citizens, Officers, and Admins. The authentication uses **JWT tokens with bcrypt password hashing**, role-based access control (RBAC), and isolated session management per role. The system is **production-ready with several good security practices**, but has some areas for improvement.

---

## 1️⃣ User Model/Schema Location & Fields

**File:** [backend/models/User.js](backend/models/User.js)

### Current Schema Structure:

```
├─ Identity Fields
│  ├─ name (required, max 100 chars)
│  ├─ email (required, unique, validated)
│  ├─ password (required, min 8 chars, hashed with bcrypt)
│  └─ phone
│
├─ Role & Permissions
│  ├─ role (enum: 'citizen', 'officer', 'admin') → default: 'citizen'
│  ├─ adminLevel (enum: 'super_admin', 'department_admin')
│  └─ managedDepartment (for department-scoped admins)
│
├─ Citizen Fields
│  ├─ nearbyLocation, completeAddress, address, city, state, pincode
│  ├─ latitude, longitude (for geolocation)
│  ├─ dob, gender
│  ├─ govtIdType (enum: aadhaar, pan, voter_id, etc.)
│  ├─ govtIdNumber (select: false — not returned by default)
│  └─ govtIdImage
│
├─ Officer Fields
│  ├─ department (enum: 8 departments)
│  ├─ employeeId
│  ├─ governmentId
│  ├─ officerStatus (enum: 'pending', 'approved', 'rejected')
│  └─ assignedArea
│
├─ Admin Fields
│  ├─ adminSecretVerified (boolean)
│  ├─ adminLevel (super_admin or department_admin)
│  └─ managedDepartment
│
├─ Email & OTP Verification
│  ├─ otpVerified (boolean)
│  ├─ isEmailVerified (boolean)
│  ├─ emailVerificationToken
│  ├─ emailVerificationExpire
│  └─ emailVerificationExpire
│
├─ Password Reset
│  ├─ resetPasswordToken (hashed with SHA256)
│  └─ resetPasswordExpire
│
├─ Activity Tracking
│  ├─ lastLogin (Date)
│  ├─ isActive (boolean) → for account suspension
│  ├─ profileImage
│  ├─ liveImage (webcam selfie from liveness check)
│  └─ timestamps (createdAt, updatedAt)
│
└─ Performance Stats (Officers)
   ├─ performanceStats.complaintsResolved
   ├─ performanceStats.complaintsAssigned
   └─ performanceStats.avgRating
```

### Key Methods:
- **`hashPassword()`** — Pre-save hook using `bcrypt.hash(password, 12)`
- **`matchPassword(entered)`** — Async bcrypt comparison
- **`getSignedJwtToken()`** — Creates JWT with `id, role, email, name, adminLevel, managedDepartment`
- **`getResetPasswordToken()`** — Generates crypto token + hashed version (10-min expiry)

### Database Indexes:
- Role index: `userSchema.index({ role: 1 })`
- Department index: `userSchema.index({ department: 1 })`

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| No `email` select: false | Medium | Email is exposed in all queries by default (OK for public display, but could be sensitive in admin contexts) |
| `select: false` for govtIdNumber only | Medium | Should also apply to sensitive fields like `resetPasswordToken` |
| No phone validation | Low | Phone accepts any string, no format validation (E.164, etc.) |
| Performance stats calculated elsewhere | Low | `performanceStats` exists but not auto-updated; recalculation likely happens in Officer model |
| No audit log on schema | Low | Changes to sensitive fields (role, admin status) aren't logged |
| No two-factor auth (2FA/MFA) | High | No `twoFactorSecret`, `twoFactorEnabled`, etc. |
| No account lockout tracking | High | No `loginAttempts`, `lockoutUntil` fields for brute force protection |
| `isActive` is loose | Medium | Uses boolean; no `suspensionReason`, `suspendedAt`, `suspendedBy` fields |

---

## 2️⃣ Authentication Controller Location & Implementation

**File:** [backend/controllers/authController.js](backend/controllers/authController.js)

### Routes Implemented:

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | Public | Citizen/Admin registration (Officer blocked) |
| `/api/auth/login` | POST | Public | Citizen login |
| `/api/auth/logout` | POST | Protect | Clear token cookie |
| `/api/auth/me` | GET | Protect | Get current user profile |
| `/api/auth/forgot-password` | POST | Public | Request password reset email |
| `/api/auth/reset-password/:token` | POST | Public | Reset password with token |
| `/api/auth/update-password` | PUT | Protect | Change password (authenticated) |
| `/api/auth/send-otp` | POST | Public | Send OTP (email verification) |
| `/api/auth/verify-otp` | POST | Public | Verify OTP |

### Register Endpoint Details:

**Key Features:**
- ✅ Duplicate email check
- ✅ Role validation (citizen/admin) — **Officer registration blocked** with clear message
- ✅ Admin secret key verification (`ADMIN_SECRET_KEY=ESAMADHAN_ADMIN_2025`)
- ✅ Department validation for admins
- ✅ **Mandatory AI liveness verification for citizens** (checks `LivenessSession` with `verificationStatus=verified`)
- ✅ Profile image, govt ID image, live image uploads
- ✅ File upload support (multer)
- ✅ OTP verification optional flag

**Registration Flow for Citizen:**
```
1. Frontend: User completes liveness verification → gets sessionId
2. POST /api/auth/register with livenessSessionId
3. Backend: Verify liveness session exists & is marked verified
4. Backend: Create User with liveImage + profileImage
5. Backend: Hash password, return JWT token + set HTTP-only cookie
```

**Admin Registration Flow:**
```
1. Frontend: Admin enters email + password + department
2. POST /api/auth/register with adminSecretKey
3. Backend: Verify adminSecretKey == ADMIN_SECRET_KEY (env var)
4. Backend: Validate department slug
5. Backend: Create User with role='admin' + adminLevel='department_admin'
6. Backend: Return JWT token
```

### Login Endpoint Details:

```javascript
// POST /api/auth/login
// 1. Validate email + password present
// 2. Query User with +password selected
// 3. Compare password with bcrypt
// 4. Check user.isActive !== false
// 5. Update lastLogin timestamp
// 6. Call sendToken() helper
```

### Password Reset Flow:

```javascript
// GET /api/auth/forgot-password
// 1. Find user by email
// 2. Generate crypto token + hash it (SHA256)
// 3. Store hashed token + 10-min expiry in DB
// 4. Email reset link with unhashed token
// 5. Frontend: User clicks link → visits /reset-password/:token
// 6. POST /api/auth/reset-password/:token
// 7. Backend: Hash provided token, compare with DB hashed token
// 8. If match + not expired: Update password, return new JWT
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| Liveness requirement only for citizens | Medium | Officers can register without verification; should apply to all new users |
| Admin secret in env as plain text | High | `ADMIN_SECRET_KEY` exposed in logs, env files. Consider: API key with rotation, time-based codes |
| No email confirmation before registration | Medium | Citizen can register without confirming email ownership (though OTP is optional) |
| No rate limiting in controller | High | No per-email or per-IP attempt limits (should be in middleware/axios layer) |
| File upload validation weak | Medium | No file type checking, size limits, virus scanning |
| No activity logging | Medium | No audit trail of who registered, when, from where |
| Officer registration completely blocked | Low | Message says "complete through officer/register" — but this route should be better documented |
| Password change doesn't invalidate old tokens | Medium | User can change password, but old JWT tokens still work until expiry |

---

## 3️⃣ Authentication Routes

**File:** [backend/routes/authRoutes.js](backend/routes/authRoutes.js)

```javascript
// Public routes
POST   /api/auth/register             // Citizen + Admin registration
POST   /api/auth/login                // Citizen login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
POST   /api/auth/send-otp
POST   /api/auth/verify-otp

// Protected routes (require: protect middleware)
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/update-password
```

### Route Protection Middleware:
- **`protect`** — Validates JWT from cookie or Bearer header
- **`registrationUpload`** — Multer file upload middleware for registration

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| No separate admin auth routes | Medium | Admins use same `/api/auth/login` as citizens. Should have `/api/admin/auth/login` |
| No route versioning | Low | All routes at `/api/auth/v1/...` would be better for future changes |
| No rate limiter on login | High | No throttle for brute-force attacks (should be 5 attempts/10min) |
| No logout tracking | Low | Logout just clears cookie; no DB record of session end |
| No refresh token endpoint | Medium | JWT expiry is long (30 days); no refresh token mechanism |
| Missing device/browser tracking | Low | No way to see "login from new device" alerts |

---

## 4️⃣ Authentication Middleware

### Middleware #1: `protect` — JWT Verification

**File:** [backend/middleware/auth.js](backend/middleware/auth.js)

**Purpose:** Validate JWT token and attach user to `req.user`

**Flow:**
```javascript
1. Extract token from:
   - req.cookies.token (preferred)
   - req.headers.authorization (Bearer scheme)
2. Verify JWT signature using process.env.JWT_SECRET
3. Decode payload → get id, role, email, department, etc.
4. Based on role (citizen/officer/admin):
   a. Citizen/Admin: Query User model
   b. Officer: Query Officer model
   c. Admin can also be in Admin model
5. Attach user object to req.user
6. Return 401 if token invalid/expired
7. Return 401 if user account deleted
8. Return 401 if user.isActive === false
```

**Supported Role Flow:**
```
Decoded JWT role='officer'
  → Query Officer model by decoded.id
  → Check officer.banned, officer.isActive
  → Attach officer data to req.user

Decoded JWT role='admin'
  → Try Admin model first
  → Fall back to User model (legacy)
  → Check isActive
  → Attach admin data to req.user

Decoded JWT role='citizen'
  → Query User model
  → Check isActive
  → Attach user data to req.user
```

### Middleware #2: `authorize` — Role-Based Access

**File:** [backend/middleware/auth.js](backend/middleware/auth.js)

```javascript
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This resource requires: ${roles.join(' or ')} role.`,
    });
  }
  next();
};
```

**Usage:** `router.get('/admin/report', protect, authorize('admin'), handler)`

### Middleware #3: `roleMiddleware.js` — Shorthand RBAC

**File:** [backend/middleware/roleMiddleware.js](backend/middleware/roleMiddleware.js)

```javascript
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
    });
  }
  next();
};

// Shorthand helpers
export const citizenOnly = requireRole('citizen');
export const officerOnly = requireRole('officer');
export const adminOnly = requireRole('admin');
export const staffOnly = requireRole('officer', 'admin');
```

### Middleware #4: `authMiddleware.js` — Admin Protection

**File:** [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)

```javascript
export const protectAdmin = async (req, res, next) => {
  // 1. Extract token (same as protect middleware)
  // 2. Verify JWT signature
  // 3. Validate isAdminJwt(decoded) using utils/adminAuth.js
  // 4. Find admin in Admin or User collection
  // 5. Resolve department (from token or header)
  // 6. Check admin.isActive
  // 7. Attach admin to req.admin
  // 8. Return 401/403 errors for invalid admins
}
```

### Middleware #5: `optionalAuth` — Soft Authentication

```javascript
export const optionalAuth = async (req, res, next) => {
  // If token present: verify and attach user
  // If no token: attach null user (no error)
  // Always calls next()
}
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| Token extracted from cookie OR Bearer, but not both | Medium | Should prefer Bearer header if both present |
| No token refresh mechanism | High | Old tokens work until 30-day expiry; no way to issue new tokens |
| No session invalidation | High | Changing password doesn't invalidate old tokens |
| Role checking duplicated in code | Low | `protect` + `authorize` + `roleMiddleware` do similar things |
| No device fingerprinting | Low | Can't detect "login from suspicious location" |
| Officer.banned check only in protect, not authMiddleware | Low | Admin middleware might not check officer.banned |
| No rate limiting in middleware | High | Should throttle 401/403 responses per IP |

---

## 5️⃣ Frontend Authentication

### Login & Register Components

**Citizen Login:** [src/pages/auth/LoginPage.jsx](src/pages/auth/LoginPage.jsx)
- Role selector (Citizen / Officer tabs)
- Email + password validation
- Support for officer login with employeeId + department
- Blocked account alert display
- "Remember me" checkbox (stored in form state, not used for persistence)
- Success redirects to dashboard via `getDashboardPath(role)`

**Admin Login:** [src/pages/auth/AdminLoginPage.jsx](src/pages/auth/AdminLoginPage.jsx)
- Email + password + department dropdown
- Calls `/api/admin/login` endpoint
- Verifies admin session with `verifyAdminSession()`
- Stores admin token + data in `adminToken` / `adminData` localStorage keys
- Redirects to admin dashboard

**Signup:** [src/pages/auth/SignupPage.jsx](src/pages/auth/SignupPage.jsx)
- Multi-step signup (Step 1: Liveness → Step 2: Profile → Step 3: Govt ID)
- Liveness verification via `LivenessSession`
- Profile image upload
- Govt ID type selector (Aadhaar, PAN, etc.)
- OTP verification
- Calls `/api/auth/register` with livenessSessionId

### Frontend Authentication Context

**File:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx)

**Key Functions:**
```javascript
// Read functions
readStoredToken()           // Get active admin/citizen token
readStoredAuth()            // Get active admin/citizen user
readStoredOfficer()         // Get officer user (isolated)
readStoredOfficerToken()    // Get officer token (isolated)

// Write functions
persistAdminSession(token, adminData)   // Save admin to adminToken/adminData keys
persistCitizenSession(token, userData)  // Save citizen to citizenToken/citizenData keys
persistOfficerSession(token, officerData) // Save officer to officerToken/officerData keys

// Check functions
hasValidSession()           // Check admin OR citizen logged in
hasValidAdminSession()      // Check admin logged in
hasValidOfficerSession()    // Check officer logged in

// UI functions
getDashboardPath(role)      // Return /citizen/dashboard or /admin/dashboard/:dept
```

**Key Design Patterns:**
- **Isolated role storage:** Admin/Citizen share one context; Officer has completely separate localStorage keys
- **Priority order:** `adminToken` > `citizenToken` > legacy `token`
- **Session freshness:** `sessionStorage.authFresh` tracks if session verified within 2 minutes
- **No session verification on every load:** Only on app startup

### API Axios Configuration

**File:** [src/api/axios.js](src/api/axios.js)

**Request Interceptor:**
```javascript
// 1. If URL contains '/officer/': use officerToken from localStorage
// 2. Else: use adminToken (priority) OR citizenToken OR legacy token
// 3. Add to Authorization: Bearer <token> header
// 4. Add retry count tracking for GET requests
```

**Response Interceptor:**
```javascript
// 1. Retry GET requests up to 3x with exponential backoff
// 2. On 401 error:
   - If admin API: redirect to /admin/login, clear adminToken
   - If citizen API: redirect to /login, clear citizenToken
   - If officer API: redirect to /login, clear officerToken
// 3. Log errors to monitoring service
// 4. Show toast errors to user
```

### Protected Route Components

**File:** [src/components/auth/ProtectedRoute.jsx](src/components/auth/ProtectedRoute.jsx)

```javascript
<ProtectedRoute>
  {/* Requires valid session + token, redirects to login if invalid */}
</ProtectedRoute>

<RoleRoute roles={['admin', 'officer']}>
  {/* Requires one of specified roles */}
</RoleRoute>

<PublicRoute>
  {/* Login pages — redirects to dashboard if already logged in */}
</PublicRoute>

<AdminPublicRoute>
  {/* Admin login pages — only for non-logged-in admins */}
</AdminPublicRoute>

<AdminRoleRoute>
  {/* Admin dashboard — checks department match */}
</AdminRoleRoute>
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| "Remember me" checkbox does nothing | Low | Checked in form, not used for persistence or auto-login |
| No password strength meter | Low | Should show feedback during password entry |
| No 2FA/MFA UI | High | No support for TOTP, SMS verification |
| No social login | Low | No Google, GitHub OAuth integration |
| No session timeout warning | Medium | Users not warned before session expires |
| Session verification only on app load | Medium | Doesn't check if session still valid during long sessions |
| No logout confirmation | Low | No "are you sure?" dialog before logout |
| No multi-device session management | Medium | Can't see/revoke sessions from other devices |
| Liveness verification not visible in separate page | Low | Should have dedicated `/liveness-verification` page |

---

## 6️⃣ Backend/Frontend JWT Handling

### Token Generation (Backend)

**File:** [backend/models/User.js](backend/models/User.js)

```javascript
userSchema.methods.getSignedJwtToken = function () {
  const payload = {
    id: this._id.toString(),
    role: this.role,
    email: this.email,
    name: this.name,
    adminLevel: this.adminLevel,
    managedDepartment: this.managedDepartment,
  };
  if (this.role === 'admin' && this.managedDepartment) {
    payload.department = this.managedDepartment;
  }
  return jwt.sign(payload, process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
```

**Token Response (sendToken utility):**

**File:** [backend/utils/sendToken.js](backend/utils/sendToken.js)

```javascript
// 1. Generate JWT using user.getSignedJwtToken()
// 2. Set HTTP-only cookie:
//    - Expires: JWT_COOKIE_EXPIRE (default 7 days)
//    - httpOnly: true (not accessible from JS)
//    - secure: true in production (HTTPS only)
//    - sameSite: 'none' in prod, 'lax' in dev
// 3. Return JSON response with:
//    - success: true
//    - message: "Welcome..."
//    - token: JWT (for localStorage fallback)
//    - user: sanitized user object (no password/sensitive fields)
```

### Token Storage (Frontend)

**Dual Storage Strategy:**
1. **HTTP-only Cookie** (primary — secure, auto-sent with requests)
2. **localStorage** (fallback — for SPA routing, axios Bearer header)

**Key Names (from STORAGE_KEYS):**
```
Admin:    adminToken + adminData
Citizen:  citizenToken + citizenData
Officer:  officerToken + officerData
Legacy:   token + user (for backward compat)
```

### Token Usage in Requests

**Axios Request Interceptor Flow:**
```
1. Check if URL contains '/officer/' route
   → Use officerToken (isolated)
   → Else use adminToken (priority) OR citizenToken OR token
2. Add to Authorization header: Bearer <token>
3. Include in Cookie header automatically (browser default)
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| JWT payload has no audience (aud) claim | Medium | Should specify: `aud: 'citizen'` or `aud: 'admin'` to prevent token reuse |
| No `jti` (JWT ID) claim for revocation | High | Can't blacklist tokens after logout; old tokens work until expiry |
| No `iat` (issued at) claim | Low | Should track token issuance time for rotation policies |
| JWT expires in 30 days by default | High | Too long; should be 7 days max, with refresh token |
| No refresh token mechanism | High | Can't issue short-lived access tokens + long-lived refresh tokens |
| Token sent in both cookie AND response body | Medium | Slightly redundant; response body is fallback |
| No token rotation on logout | Medium | Logout clears client storage but doesn't invalidate on server |
| Bearer token extracted with split() logic | Low | Should handle malformed headers better |

---

## 7️⃣ Current Role-Based Route Protection

### Backend Route Protection Example

**Citizen-only routes:**
```javascript
router.post('/complaints', protect, citizenOnly, createComplaint);
```

**Officer-only routes:**
```javascript
router.get('/complaints/assigned', protect, officerOnly, getAssignedComplaints);
```

**Admin-only routes:**
```javascript
router.delete('/user/:id', protect, adminOnly, deleteUser);
```

**Staff (Officer + Admin):**
```javascript
router.get('/reports', protect, staffOnly, getReports);
```

### Frontend Route Protection Example

**Citizen Dashboard:**
```jsx
<Route path="/citizen/dashboard" element={
  <RoleRoute roles={['citizen']}>
    <CitizenDashboard />
  </RoleRoute>
} />
```

**Admin Dashboard with Department:**
```jsx
<Route path="/admin/dashboard/:department" element={
  <AdminRoleRoute>
    <AdminDashboard />
  </AdminRoleRoute>
} />
```

### Department-Scoped Access

**Backend:**
- Admins managed via `User.managedDepartment` field
- Officer via `Officer.department`
- Queries filtered: `Complaint.find({ department: user.managedDepartment })`

**Frontend:**
- Admin dashboard: `/admin/dashboard/:department`
- Validates route department matches stored `adminData.managedDepartment`
- Redirects if mismatch

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| No permission-level fine-tuning | Medium | Either full admin access or none; no "view-only" / "edit" / "delete" levels |
| Department access not validated on every request | Medium | Should check department in middleware, not just controller |
| Super-admin has no restrictions | Medium | Should have explicit permissions/policies, not just "not department_admin" |
| No cross-department API access prevention | Medium | Admin from Dept A could access Dept B via direct API calls if not filtered |
| No audit of who accessed what | High | No logging of data access by admins |
| Officer self-assignment not restricted | Low | Officer could potentially assign own complaints (if logic allows) |
| No time-based role expiry | Low | Temporary roles/permissions can't be set (e.g., "admin until Dec 31") |

---

## 8️⃣ Password Hashing & Security

### Password Hashing Implementation

**File:** [backend/models/User.js](backend/models/User.js)

**Hashing (Pre-save Hook):**
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);  // 12 salt rounds
  next();
});
```

**Comparison:**
```javascript
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};
```

### Reset Token Generation

```javascript
userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  // Hash the token for storage (double hashing)
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;  // 10 minutes
  return token;  // Return unhashed for email
};
```

### Password Validation

**Frontend:**
- Minimum 8 characters (enforced in form validation)
- No complexity rules (should have: uppercase, lowercase, number, special char)

**Backend:**
- User schema: `password: { minlength: 8 }`
- Validation runs before save

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| Bcrypt salt rounds = 12 | Low | Good (2023+ standard); could increase to 13-14 for future-proofing |
| No password complexity rules | High | Should require: uppercase, lowercase, number, special char |
| No password history | Medium | Users can re-use old passwords (should track last N passwords) |
| No password expiry policy | Low | Passwords never expire (could set 90-day rotation) |
| Reset token expires in 10 minutes | Low | Too short; should be 24 hours (but single-use) |
| Reset tokens not invalidated on successful reset | Low | Should be deleted immediately after use |
| No "password changed" notification email | Low | Users not alerted to password changes |
| Password reset via email vulnerable to interception | Low | Should send to registered email only, not any email |

---

## 9️⃣ Error Handling for Auth/Authz

### Error Handler Middleware

**File:** [backend/middleware/errorHandler.js](backend/middleware/errorHandler.js)

**Handled Error Types:**

```javascript
// 1. Database Connection Errors
MongooseServerSelectionError → 503 DATABASE_UNAVAILABLE

// 2. JWT Errors
JsonWebTokenError → 401 INVALID_TOKEN
TokenExpiredError → 401 TOKEN_EXPIRED

// 3. Validation Errors
ValidationError → 400 VALIDATION_ERROR
CastError → 404 INVALID_ID

// 4. Duplicate Key (e.g., duplicate email)
code 11000 → 400 DUPLICATE_KEY
// Message: "Email \"user@example.com\" already exists"

// 5. File Upload Errors
LIMIT_FILE_SIZE → 400 FILE_TOO_LARGE
LIMIT_FILE_COUNT → 400 TOO_MANY_FILES
LIMIT_UNEXPECTED_FILE → 400 UNEXPECTED_FILE

// 6. Syntax Errors
SyntaxError (invalid JSON) → 400 INVALID_JSON
```

### Auth-Specific Error Responses

**From authController.js:**

```javascript
// Missing credentials
400 { success: false, message: 'Please provide email and password' }

// User not found or password mismatch
401 { success: false, message: 'Invalid email or password' }

// Account deactivated
401 { success: false, message: 'Account deactivated. Contact support.' }

// Duplicate email
400 { success: false, message: 'An account with this email already exists' }

// Invalid role
400 { success: false, message: 'Officer registration must be completed through...' }

// Liveness not verified
400 { success: false, message: 'AI liveness verification is mandatory...' }

// Invalid token
400 { success: false, message: 'Invalid or expired token.' }
```

### Frontend Error Display

**From src/api/axios.js:**

```javascript
// 401 errors: redirect to login + clear token
// 403 errors: show toast "Access Denied"
// 500 errors: show toast "Server Error"
// Network errors: show toast "Network unavailable"
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| Error messages could leak info | Medium | "Invalid email" vs "Invalid password" tells attacker which emails exist |
| No rate limit error (429) handling | High | Should throttle /login attempts |
| Generic 500 errors shown to frontend | Medium | Should return sanitized messages in production |
| No error logging to external service | Medium | Errors logged to console only; should use Sentry, DataDog, etc. |
| No error recovery instructions | Low | Users not told what to do when they see errors |
| Expired token message not actionable | Low | Should suggest "refresh page" or "log in again" |
| "Account blocked" not distinguished from "inactive" | Low | Different error codes, but message could be clearer |
| No CSRF protection error handling | High | No CSRF token validation on POST/PUT/DELETE |
| Admin error messages too verbose | Low | Technical details exposed in admin API responses |

---

## 🔟 Database Connection & User Model Validation

### Database Connection Setup

**File:** [backend/config/db.js](backend/config/db.js)

**Connection Logic:**
```javascript
// 1. Try MONGO_URI, MONGO_URI_STANDARD, MONGODB_URI (in order)
// 2. Normalize URI (mask password for logging)
// 3. Connect with retry logic (3 attempts by default)
// 4. Connection options:
//    - serverSelectionTimeoutMS: 30s
//    - connectTimeoutMS: 30s
//    - socketTimeoutMS: 45s
//    - maxPoolSize: 10
// 5. For non-SRV URIs: set directConnection: true
// 6. Listen for events:
//    - connected: log success
//    - error: log runtime errors
//    - disconnected: log warning
//    - reconnected: log recovery
```

**Startup Check:**
```javascript
// server.js line ~75
const dbReady = await connectDB();
if (!dbReady) {
  console.error('Server startup aborted: MongoDB is required.');
  process.exit(1);
}
```

### User Model Validation

**Pre-save Validation:**
```javascript
// name: { required, maxlength: 100 }
// email: { required, unique, match: /^\S+@\S+\.\S+$/ }
// password: { required, minlength: 8 }
// role: { enum: ['citizen', 'officer', 'admin'], default: 'citizen' }
// department: { enum: [8 departments], default: '' }
// adminLevel: { enum: ['super_admin', 'department_admin'] }
// ... (20+ fields with validation)
```

**Duplicate Email Handling:**
```javascript
// Register endpoint checks:
const exists = await User.findOne({ email: email?.toLowerCase() });
if (exists) {
  return res.status(400).json({ 
    success: false, 
    message: 'An account with this email already exists' 
  });
}

// Unique index on email handles race conditions:
email: { 
  type: String, 
  required: true, 
  unique: true,  // ← DB-level constraint
  lowercase: true, 
  trim: true, 
  match: [/^\S+@\S+\.\S+$/, 'Invalid email'] 
}
```

### ⚠️ Issues & Gaps:

| Issue | Severity | Details |
|-------|----------|---------|
| MONGO_URI can be null | High | No .env file validation on startup |
| Connection pool size = 10 | Medium | May not scale for high-traffic; consider 20-30 |
| Retry logic hardcoded to 3 attempts | Low | Should be configurable |
| No connection health check endpoint | Medium | Can't easily monitor DB connectivity |
| User model validation not comprehensive | Medium | No field-by-field validation hints in API responses |
| Email validation regex simple | Low | Does not validate deliverability (e.g., example.com) |
| No migration system | Medium | Schema changes require manual DB updates |
| No connection pooling dashboard | Low | Can't see active connections, queue size |
| Indexes not auto-created | Low | Should run createIndexes() on startup |
| No graceful shutdown of DB connection | Medium | Server crash might leave orphaned connections |

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
│                                                                  │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐      │
│  │ LoginPage     │  │ SignupPage   │  │ AdminLoginPage  │      │
│  └───────┬───────┘  └──────┬───────┘  └────────┬────────┘      │
│          │                 │                     │               │
│          └─────────────────┼─────────────────────┘               │
│                            │                                     │
│                    POST /api/auth/*                             │
│                            │                                     │
│          ┌─────────────────┴─────────────────┐                 │
│          ▼                                    ▼                 │
│    AuthContext.jsx                    axios.js Interceptor    │
│    - setAdminSession()                - Extract Bearer token   │
│    - setSession()                     - Retry logic (3x)      │
│    - clearSession()                   - Handle 401 → redirect  │
│                                                                  │
│    localStorage:                                               │
│    - adminToken/adminData                                      │
│    - citizenToken/citizenData                                  │
│    - officerToken/officerData                                  │
│                                                                  │
└──────────────────────────────────┬───────────────────────────────┘
                                   │ HTTP/HTTPS
                                   │
┌──────────────────────────────────┴───────────────────────────────┐
│                  Backend (Node.js + Express)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ app.use(helmet, cors, rate-limit, morgan)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ POST /api/auth/register                                 │ │
│  │  ├─→ Validate email, role, liveness                    │ │
│  │  ├─→ Hash password (bcrypt.hash(pw, 12))               │ │
│  │  ├─→ Create User doc                                   │ │
│  │  └─→ sendToken() → JWT + HTTP-only cookie              │ │
│  │                                                         │ │
│  │ POST /api/auth/login                                    │ │
│  │  ├─→ Validate email + password                         │ │
│  │  ├─→ Query User + select('+password')                  │ │
│  │  ├─→ bcrypt.compare(pw, hash)                          │ │
│  │  ├─→ Update lastLogin                                  │ │
│  │  └─→ sendToken() → JWT + HTTP-only cookie              │ │
│  │                                                         │ │
│  │ GET /api/auth/me (protect middleware)                   │ │
│  │  ├─→ Extract token from cookie/Bearer                  │ │
│  │  ├─→ jwt.verify(token, JWT_SECRET)                     │ │
│  │  ├─→ Query User/Officer/Admin by ID                    │ │
│  │  ├─→ Check isActive, banned, etc.                      │ │
│  │  └─→ Attach user to req.user                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Role-Based Access Control (Middleware)                  │ │
│  │                                                           │ │
│  │  protect                → verify JWT + attach req.user   │ │
│  │  authorize('admin')     → check req.user.role            │ │
│  │  adminOnly              → shorthand for admin access     │ │
│  │  requireRole('officer') → multiple roles support         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Error Handling (errorHandler.js)                        │ │
│  │                                                           │ │
│  │  ValidationError    → 400 VALIDATION_ERROR               │ │
│  │  TokenExpiredError  → 401 TOKEN_EXPIRED                  │ │
│  │  Duplicate Email    → 400 DUPLICATE_KEY                  │ │
│  │  DB Connection Err  → 503 DATABASE_UNAVAILABLE           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   MongoDB       │
                  │                 │
                  │  Users          │
                  │  - email (idx)  │
                  │  - password     │
                  │  - role         │
                  │  - resetToken   │
                  │                 │
                  │  Admins         │
                  │  - email (idx)  │
                  │  - department   │
                  │                 │
                  │  Officers       │
                  │  - email (idx)  │
                  │  - department   │
                  │  - employeeId   │
                  │                 │
                  │  OTP            │
                  │  - email (idx)  │
                  │  - expiresAt    │
                  └─────────────────┘
```

---

## 🎯 Summary of Key Findings

### ✅ Strengths

1. **Multi-role system** with clear role separation (Citizen, Officer, Admin)
2. **Password hashing** with bcrypt (12 salt rounds) — good security
3. **JWT-based stateless auth** — scalable and stateless
4. **HTTP-only cookies** + localStorage dual storage — defense in depth
5. **Isolated Officer sessions** — prevent confusion with admin/citizen
6. **Reset token double-hashing** — token not stored plaintext in DB
7. **Email verification via OTP** — prevents typos
8. **Liveness verification for citizens** — AI-based anti-fraud
9. **Department-scoped admins** — multi-tenant security
10. **Error handling middleware** — centralized error responses

### ⚠️ Critical Issues (High Severity)

1. **No rate limiting on login** — Brute force attacks possible
2. **Admin secret in env file** — Exposed in logs, version control, backups
3. **No token refresh mechanism** — 30-day token = long attack window
4. **No session invalidation on password change** — Old tokens still work
5. **No token revocation (blacklist)** — Can't logout truly
6. **No 2FA/MFA** — Only password protection
7. **No CSRF protection** — POST endpoints vulnerable
8. **No password complexity rules** — Weak passwords accepted
9. **No account lockout after failed attempts** — Brute force vulnerability
10. **No email confirmation for registration** — Email could be typo

### 📋 Medium Priority Issues

1. Token expiry too long (30 days)
2. No audit logging of auth events
3. File upload validation weak
4. Department access not validated on every request
5. No permission levels (admin is all-or-nothing)
6. Error messages leak information (e.g., which emails exist)
7. Password reset email vulnerable to interception
8. No device fingerprinting or multi-device logout
9. No suspicious location alerts
10. Session timeout not warned before expiry

### 🔹 Low Priority Issues

1. Phone validation too permissive
2. No password history (users can reuse old passwords)
3. Reset tokens expire too quickly (10 min)
4. No social login (OAuth)
5. No "remember me" functionality
6. No password strength meter UI
7. No logout confirmation dialog
8. Indexes not auto-created on startup
9. No connection pooling dashboard
10. No API versioning for auth endpoints

---

## 🔧 Recommended Fixes (Priority Order)

| Priority | Fix | Estimated Effort |
|----------|-----|-----------------|
| **CRITICAL** | Add rate limiting on /login (5 attempts/10min) | 2 hours |
| **CRITICAL** | Implement JWT refresh tokens (7d access, 30d refresh) | 4 hours |
| **CRITICAL** | Add token blacklist on logout (Redis or DB) | 3 hours |
| **CRITICAL** | Move admin secret to API key system with rotation | 6 hours |
| **CRITICAL** | Implement account lockout (5 failures, 30min cooldown) | 2 hours |
| **CRITICAL** | Add CSRF token to POST/PUT/DELETE endpoints | 4 hours |
| **HIGH** | Add 2FA support (TOTP via Google Authenticator) | 8 hours |
| **HIGH** | Enforce password complexity (upper, lower, number, special) | 1 hour |
| **HIGH** | Add email confirmation for new accounts | 3 hours |
| **HIGH** | Implement session invalidation on password change | 2 hours |
| **MEDIUM** | Add audit logging for auth events | 4 hours |
| **MEDIUM** | Validate department access on every endpoint | 6 hours |
| **MEDIUM** | Improve file upload validation (MIME type, size) | 2 hours |
| **MEDIUM** | Add suspicious login detection (new device/location) | 8 hours |
| **MEDIUM** | Sanitize error messages (don't leak email existence) | 3 hours |

---

## 📚 Related Documentation

- **[API Documentation](api-documentation.md)** — Endpoint reference
- **[Setup Checklist](SETUP_CHECKLIST.md)** — Environment configuration
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** — System overview

---

**Analysis Status:** ✅ Complete  
**Next Steps:** Review findings with team, prioritize fixes, create GitHub issues
