# e-Samadhan AI - API Documentation

**Version:** 2.0.0  
**Base URL:** `http://localhost:5000/api`  
**Environment:** Node.js with Express, MongoDB, Socket.io

---

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Routes](#auth-routes)
3. [Complaint Routes](#complaint-routes)
4. [Citizen Complaint Routes](#citizen-complaint-routes)
5. [Admin Routes](#admin-routes)
6. [Officer Routes](#officer-routes)
7. [Notification Routes](#notification-routes)
8. [Document Routes](#document-routes)
9. [Face Verification Routes](#face-verification-routes)
10. [Liveness Detection Routes](#liveness-detection-routes)
11. [AI Routes](#ai-routes)
12. [Report Routes](#report-routes)
13. [Chatbot Routes](#chatbot-routes)
14. [Activity Routes](#activity-routes)
15. [Health Check](#health-check)

---

## Authentication

### Authentication Methods

The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Middleware

- **`protect`**: Requires valid JWT token (for regular users)
- **`protectAdmin`**: Requires valid admin JWT token
- **`authorize(roles...)`**: Checks if user has required role

### Role-Based Access Control (RBAC)

- **citizen**: Regular users filing complaints
- **officer**: Officers managing complaints
- **admin**: System administrators

---

## Auth Routes

**Base Path:** `/api/auth`

### 1. Register User
```
POST /api/auth/register
```

**Description:** Create a new citizen/user account

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+918123456789",
  "password": "secure_password",
  "language": "en",
  "profilePicture": "<file>"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+918123456789"
  }
}
```

### 2. Login User
```
POST /api/auth/login
```

**Description:** Authenticate user and receive JWT token

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  }
}
```

**Note:** Token is also set as HTTP-only cookie

### 3. Logout
```
POST /api/auth/logout
```

**Description:** Logout current user and invalidate session

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Get Current User
```
GET /api/auth/me
```

**Description:** Get authenticated user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+918123456789",
    "role": "citizen"
  }
}
```

### 5. Forgot Password
```
POST /api/auth/forgot-password
```

**Description:** Send password reset token to email

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### 6. Reset Password
```
POST /api/auth/reset-password/:token
```

**Description:** Reset password using token from email

**Parameters:**
- `token` (string): Reset token from email link

**Body:**
```json
{
  "password": "new_secure_password",
  "confirmPassword": "new_secure_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 7. Update Password
```
PUT /api/auth/update-password
```

**Description:** Change password for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 8. Send OTP
```
POST /api/auth/send-otp
```

**Description:** Send One-Time Password to email/phone

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

### 9. Verify OTP
```
POST /api/auth/verify-otp
```

**Description:** Verify OTP for two-factor authentication

**Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Complaint Routes

**Base Path:** `/api/complaints`  
**Authentication:** Required for all routes

### 1. File Complaint (Create)
```
POST /api/complaints
```

**Description:** File a new complaint

**Roles:** `citizen`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```json
{
  "title": "Poor Road Condition",
  "description": "Main street has potholes",
  "category": "infrastructure",
  "priority": "high",
  "department": "Public Works",
  "location": "Main Street, City",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "phone": "+918123456789",
  "attachments": "<files>"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Complaint filed successfully",
  "complaint": {
    "_id": "complaint_id",
    "complaintId": "C000001",
    "title": "Poor Road Condition",
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get All Complaints
```
GET /api/complaints
```

**Description:** Get all complaints (filtered by role)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status
- `category` (string): Filter by category
- `priority` (string): Filter by priority

**Response (200):**
```json
{
  "success": true,
  "total": 50,
  "page": 1,
  "complaints": [
    {
      "_id": "complaint_id",
      "complaintId": "C000001",
      "title": "Poor Road Condition",
      "status": "in-progress",
      "priority": "high",
      "category": "infrastructure"
    }
  ]
}
```

### 3. Get Single Complaint
```
GET /api/complaints/:id
```

**Description:** Get detailed complaint information

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "complaint": {
    "_id": "complaint_id",
    "complaintId": "C000001",
    "title": "Poor Road Condition",
    "description": "Main street has potholes",
    "status": "in-progress",
    "priority": "high",
    "category": "infrastructure",
    "assignedOfficer": {
      "_id": "officer_id",
      "name": "Officer Name"
    },
    "attachments": [],
    "upvotes": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Complaint Status
```
PUT /api/complaints/:id/status
```

**Description:** Update complaint status

**Roles:** `officer`, `admin`

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "resolved",
  "resolution": "Pothole filled successfully",
  "resolutionImages": []
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint status updated",
  "complaint": {
    "status": "resolved"
  }
}
```

### 5. Assign Complaint to Officer
```
PUT /api/complaints/:id/assign
```

**Description:** Assign complaint to an officer

**Roles:** `admin`

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "officerId": "officer_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint assigned to officer"
}
```

### 6. Upvote Complaint
```
POST /api/complaints/:id/upvote
```

**Description:** Upvote a complaint (show support)

**Roles:** `citizen`

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Upvote recorded",
  "upvotes": 6
}
```

### 7. Submit Feedback
```
POST /api/complaints/:id/feedback
```

**Description:** Submit feedback on complaint resolution

**Roles:** `citizen`

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rating": 4,
  "comment": "Good work, but took longer than expected",
  "category": "quality"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

### 8. Get Analytics
```
GET /api/complaints/analytics
```

**Description:** Get complaint analytics and statistics

**Roles:** `officer`, `admin`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalComplaints": 150,
    "pendingComplaints": 25,
    "resolvedComplaints": 100,
    "resolvedPercentage": 66.67,
    "averageResolutionTime": "5 days",
    "categoryBreakdown": {
      "infrastructure": 60,
      "health": 40
    }
  }
}
```

### 9. Analyze Complaint Text
```
POST /api/complaints/analyze
```

**Description:** Analyze complaint using AI (extract entities, sentiment)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "text": "The main street has severe potholes affecting traffic flow"
}
```

**Response (200):**
```json
{
  "success": true,
  "analysis": {
    "category": "infrastructure",
    "priority": "high",
    "sentiment": "negative",
    "keywords": ["pothole", "street", "traffic"]
  }
}
```

---

## Citizen Complaint Routes

**Base Path:** `/api/complaints/citizen`  
**Authentication:** Required for all routes

### 1. Get Citizen Dashboard Stats
```
GET /api/complaints/citizen/stats
```

**Description:** Get statistics for citizen's complaints

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalComplaints": 12,
    "pendingComplaints": 3,
    "resolvedComplaints": 9,
    "inProgressComplaints": 0,
    "averageResolutionTime": "4 days",
    "myComplaints": [
      {
        "_id": "complaint_id",
        "complaintId": "C000001",
        "title": "Poor Road Condition",
        "status": "resolved",
        "priority": "high"
      }
    ]
  }
}
```

---

## Admin Routes

**Base Path:** `/api/admin`  
**Authentication:** Admin required for all protected routes

### 1. Register Admin
```
POST /api/admin/register
```

**Description:** Create new admin account

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin_password",
  "name": "Admin Name",
  "department": "System Admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Admin Login
```
POST /api/admin/login
```

**Description:** Authenticate admin user

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### 3. Session Check
```
GET /api/admin/session-check
```

**Description:** Check if admin session is valid

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "admin": {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### 4. Get Admin Profile
```
GET /api/admin/profile
```

**Description:** Get authenticated admin's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "department": "System Admin",
    "permissions": ["manage_officers", "manage_complaints"]
  }
}
```

### 5. Get Admin Analytics
```
GET /api/admin/analytics
```

**Description:** Get system-wide analytics and statistics

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalComplaints": 500,
    "totalUsers": 150,
    "totalOfficers": 30,
    "pendingComplaints": 50,
    "resolutionRate": 90,
    "averageResolutionTime": "5 days",
    "departmentStats": {
      "Public Works": 200,
      "Health": 150
    }
  }
}
```

### 6. Get Officer Analytics
```
GET /api/admin/officer-analytics
```

**Description:** Get analytics on officer performance

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalOfficers": 30,
    "averageComplaints": 15,
    "topPerformers": [
      {
        "_id": "officer_id",
        "name": "Officer Name",
        "complaintsHandled": 50,
        "resolutionRate": 95
      }
    ]
  }
}
```

### 7. Get All Complaints (Admin View)
```
GET /api/admin/complaints
```

**Description:** Get all complaints in the system

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `department` (string): Filter by department

**Response (200):**
```json
{
  "success": true,
  "total": 500,
  "complaints": [
    {
      "_id": "complaint_id",
      "complaintId": "C000001",
      "title": "Poor Road Condition",
      "status": "pending",
      "priority": "high",
      "department": "Public Works",
      "filedBy": "citizen_name"
    }
  ]
}
```

### 8. Get Emergency Complaints
```
GET /api/admin/emergencies
```

**Description:** Get high-priority/emergency complaints

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "emergencies": [
    {
      "_id": "complaint_id",
      "complaintId": "C000001",
      "title": "Safety Issue",
      "priority": "critical",
      "status": "pending"
    }
  ]
}
```

### 9. Create Officer
```
POST /api/admin/create-officer
```

**Description:** Create a new officer account

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Officer Smith",
  "email": "officer@example.com",
  "phone": "+918123456789",
  "password": "secure_password",
  "department": "Public Works",
  "badge": "PWD-001"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Officer created successfully",
  "officer": {
    "_id": "officer_id",
    "name": "Officer Smith",
    "email": "officer@example.com"
  }
}
```

### 10. Get All Officers
```
GET /api/admin/officers
```

**Description:** Get all officers in the system

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `department` (string): Filter by department
- `status` (string): Filter by status (active/inactive)

**Response (200):**
```json
{
  "success": true,
  "total": 30,
  "officers": [
    {
      "_id": "officer_id",
      "name": "Officer Smith",
      "email": "officer@example.com",
      "department": "Public Works",
      "status": "active"
    }
  ]
}
```

### 11. Get Officer Detail
```
GET /api/admin/officers/:id
```

**Description:** Get detailed information about an officer

**Parameters:**
- `id` (string): Officer ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "officer": {
    "_id": "officer_id",
    "name": "Officer Smith",
    "email": "officer@example.com",
    "phone": "+918123456789",
    "department": "Public Works",
    "complaintsAssigned": 25,
    "complaintsResolved": 20,
    "rating": 4.5
  }
}
```

### 12. Ban Officer
```
PUT /api/admin/ban-officer/:id
```

**Description:** Ban an officer from the system

**Parameters:**
- `id` (string): Officer ID

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "reason": "Misconduct"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Officer banned successfully"
}
```

### 13. Toggle Block Officer
```
PUT /api/admin/officers/:id/toggle-block
```

**Description:** Block/Unblock officer

**Parameters:**
- `id` (string): Officer ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Officer status updated"
}
```

### 14. Update Officer Status
```
PUT /api/admin/officers/:id/status
```

**Description:** Update officer status

**Parameters:**
- `id` (string): Officer ID

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "active|inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Officer status updated"
}
```

### 15. Assign Officer to Complaint
```
PUT /api/admin/assign-officer
```

**Description:** Assign an officer to a complaint

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "complaintId": "complaint_id",
  "officerId": "officer_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Officer assigned to complaint"
}
```

### 16. Update Complaint Status (Admin)
```
PUT /api/admin/update-status
```

**Description:** Update complaint status from admin panel

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "complaintId": "complaint_id",
  "status": "resolved",
  "notes": "Issue resolved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint status updated"
}
```

---

## Officer Routes

**Base Path:** `/api/officer`  
**Authentication:** Required for all routes  
**Roles:** `officer`, `admin`

### 1. Get Assigned Complaints
```
GET /api/officer/assigned-complaints
```

**Description:** Get complaints assigned to the officer

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `status` (string): Filter by status

**Response (200):**
```json
{
  "success": true,
  "total": 15,
  "complaints": [
    {
      "_id": "complaint_id",
      "complaintId": "C000001",
      "title": "Poor Road Condition",
      "status": "in-progress",
      "priority": "high"
    }
  ]
}
```

### 2. Update Complaint Status (Officer)
```
PUT /api/officer/complaints/:id/status
```

**Description:** Update status of assigned complaint

**Parameters:**
- `id` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "in-progress|resolved",
  "notes": "Work in progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status updated"
}
```

### 3. Get Officer Profile
```
GET /api/officer/profile
```

**Description:** Get authenticated officer's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "_id": "officer_id",
    "name": "Officer Smith",
    "email": "officer@example.com",
    "department": "Public Works",
    "complaintsAssigned": 25,
    "complaintsResolved": 20,
    "rating": 4.5
  }
}
```

### 4. Get Officer Analytics
```
GET /api/officer/analytics
```

**Description:** Get performance analytics for the officer

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalAssigned": 25,
    "totalResolved": 20,
    "pending": 5,
    "averageResolutionTime": "4 days",
    "rating": 4.5,
    "performanceScore": 85
  }
}
```

---

## Notification Routes

**Base Path:** `/api/notifications`  
**Authentication:** Required for all routes

### 1. Get Notifications
```
GET /api/notifications
```

**Description:** Get notifications for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `unreadOnly` (boolean): Get only unread notifications

**Response (200):**
```json
{
  "success": true,
  "total": 50,
  "unreadCount": 5,
  "notifications": [
    {
      "_id": "notification_id",
      "title": "Complaint Updated",
      "message": "Your complaint C000001 has been resolved",
      "isRead": false,
      "complaint": {
        "complaintId": "C000001",
        "title": "Poor Road Condition"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Mark Notification as Read
```
PUT /api/notifications/:id/read
```

**Description:** Mark single notification as read

**Parameters:**
- `id` (string): Notification ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "notification": {
    "_id": "notification_id",
    "isRead": true
  }
}
```

### 3. Mark All Notifications as Read
```
PUT /api/notifications/read-all
```

**Description:** Mark all notifications as read

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 4. Delete Notification
```
DELETE /api/notifications/:id
```

**Description:** Delete a notification

**Parameters:**
- `id` (string): Notification ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Document Routes

**Base Path:** `/api/documents`  
**Authentication:** Required for all routes

### 1. Upload Document
```
POST /api/documents/upload
```

**Description:** Upload complaint-related documents

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
complaintId: complaint_id
document: <file>
documentType: "proof" | "identification" | "other"
```

**Response (201):**
```json
{
  "success": true,
  "document": {
    "_id": "document_id",
    "url": "http://localhost:5000/uploads/complaints/doc.pdf",
    "type": "proof"
  }
}
```

### 2. Get Complaint Documents
```
GET /api/documents/:complaintId
```

**Description:** Get all documents for a complaint

**Parameters:**
- `complaintId` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "documents": [
    {
      "_id": "document_id",
      "url": "http://localhost:5000/uploads/complaints/doc.pdf",
      "type": "proof"
    }
  ]
}
```

### 3. Delete Document
```
DELETE /api/documents/:id
```

**Description:** Delete a document

**Parameters:**
- `id` (string): Document ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document deleted"
}
```

---

## Face Verification Routes

**Base Path:** `/api/face`

### 1. Face Health Check
```
GET /api/face/health
```

**Description:** Check if face recognition service is operational

**Response (200):**
```json
{
  "success": true,
  "message": "Face service is healthy",
  "service": "face-recognition-api"
}
```

### 2. Validate Face Upload
```
POST /api/face/validate-upload
```

**Description:** Validate uploaded document and selfie images for face matching

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```
documentImage: <file> (JPEG, PNG, or WebP)
selfieImage: <file> (JPEG, PNG, or WebP)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Face validation successful",
  "match": {
    "confidence": 0.95,
    "isMatch": true
  },
  "documentData": {
    "name": "John Doe",
    "dob": "1990-01-01"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Face mismatch - Images do not match"
}
```

---

## Liveness Detection Routes

**Base Path:** `/api/liveness`  
**Authentication:** Required for most routes

### 1. Start Liveness Session
```
POST /api/liveness/start
```

**Description:** Initiate a liveness detection session

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user_id",
  "type": "kyc|verification"
}
```

**Response (201):**
```json
{
  "success": true,
  "session": {
    "_id": "session_id",
    "sessionKey": "unique_session_key",
    "status": "active",
    "expiresAt": "2024-01-15T10:45:00Z"
  }
}
```

### 2. Submit Liveness Challenge
```
POST /api/liveness/submit
```

**Description:** Submit liveness challenge response (video/images)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
sessionId: session_id
challengeResponse: <file>
```

**Response (200):**
```json
{
  "success": true,
  "result": {
    "isLive": true,
    "confidence": 0.98,
    "attempts": 1
  }
}
```

### 3. Get Session Status
```
GET /api/liveness/session/:sessionId
```

**Description:** Get status of a liveness session

**Parameters:**
- `sessionId` (string): Session ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "session": {
    "_id": "session_id",
    "status": "completed",
    "result": {
      "isLive": true,
      "confidence": 0.98
    }
  }
}
```

---

## AI Routes

**Base Path:** `/api/ai`

### 1. Analyze Voice Complaint
```
POST /api/ai/voice-complaint
```

**Description:** Analyze voice complaint using Gemini AI

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```
audio: <audio_file>
language: "en" | "hi" | "es" | etc.
```

**Response (200):**
```json
{
  "success": true,
  "analysis": {
    "transcription": "The main street has severe potholes affecting traffic flow",
    "category": "infrastructure",
    "priority": "high",
    "sentiment": "negative",
    "entities": ["street", "potholes", "traffic"],
    "summary": "Complaint about road damage"
  }
}
```

### 2. Detect Emergency
```
POST /api/ai/detect-emergency
```

**Description:** Detect if complaint contains emergency keywords

**Body:**
```json
{
  "text": "Someone is injured and bleeding at the market"
}
```

**Response (200):**
```json
{
  "success": true,
  "isEmergency": true,
  "severity": "high",
  "keywords": ["injured", "bleeding"],
  "recommendedAction": "immediate"
}
```

### 3. Detect Language
```
POST /api/ai/detect-language
```

**Description:** Detect language of input text

**Body:**
```json
{
  "text": "The main street has potholes"
}
```

**Response (200):**
```json
{
  "success": true,
  "language": "en",
  "confidence": 0.99,
  "languageName": "English"
}
```

### 4. Translate Text
```
POST /api/ai/translate
```

**Description:** Translate text to target language

**Body:**
```json
{
  "text": "The main street has potholes",
  "targetLanguage": "hi"
}
```

**Response (200):**
```json
{
  "success": true,
  "original": "The main street has potholes",
  "translated": "मुख्य सड़क में गड्ढे हैं",
  "sourceLanguage": "en",
  "targetLanguage": "hi"
}
```

---

## Report Routes

**Base Path:** `/api/reports`  
**Authentication:** Required for all routes

### 1. Generate Complaint Report
```
POST /api/reports/generate
```

**Description:** Generate report for a complaint

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "complaintId": "complaint_id",
  "format": "pdf|excel|json",
  "includeAttachments": true
}
```

**Response (200):**
```json
{
  "success": true,
  "report": {
    "reportId": "report_id",
    "downloadUrl": "http://localhost:5000/downloads/report.pdf",
    "format": "pdf",
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get Report History
```
GET /api/reports/history
```

**Description:** Get user's generated reports

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "total": 10,
  "reports": [
    {
      "_id": "report_id",
      "complaintId": "C000001",
      "format": "pdf",
      "generatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get System Report
```
GET /api/reports/system
```

**Description:** Get system-wide analytics report

**Roles:** `admin`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `dateRange` (string): "week|month|year"

**Response (200):**
```json
{
  "success": true,
  "report": {
    "periodStart": "2024-01-08",
    "periodEnd": "2024-01-15",
    "totalComplaints": 150,
    "resolvedComplaints": 120,
    "averageResolutionTime": "5 days"
  }
}
```

---

## Chatbot Routes

**Base Path:** `/api/chatbot`  
**Authentication:** Required for most routes

### 1. Send Message
```
POST /api/chatbot/message
```

**Description:** Send message to complaint AI chatbot

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "message": "How do I file a complaint?",
  "conversationId": "conversation_id (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": {
    "conversationId": "conversation_id",
    "message": "To file a complaint, follow these steps...",
    "suggestions": ["File new complaint", "Check status", "Contact support"]
  }
}
```

### 2. Get Chat History
```
GET /api/chatbot/history/:conversationId
```

**Description:** Get chat history for a conversation

**Parameters:**
- `conversationId` (string): Conversation ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "history": [
    {
      "_id": "message_id",
      "role": "user",
      "message": "How do I file a complaint?",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "message_id",
      "role": "assistant",
      "message": "To file a complaint...",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ]
}
```

### 3. End Conversation
```
POST /api/chatbot/end-conversation
```

**Description:** End a chatbot conversation

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "conversationId": "conversation_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation ended"
}
```

---

## Activity Routes

**Base Path:** `/api/activities`  
**Authentication:** Required for all routes

### 1. Get User Activities
```
GET /api/activities
```

**Description:** Get activity log for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by activity type

**Response (200):**
```json
{
  "success": true,
  "total": 25,
  "activities": [
    {
      "_id": "activity_id",
      "type": "complaint_filed",
      "description": "Filed complaint C000001",
      "metadata": {
        "complaintId": "C000001"
      },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get Complaint Activity Log
```
GET /api/activities/complaint/:complaintId
```

**Description:** Get activity history for a specific complaint

**Parameters:**
- `complaintId` (string): Complaint ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "type": "status_changed",
      "from": "pending",
      "to": "in-progress",
      "timestamp": "2024-01-15T10:30:00Z",
      "actor": "Officer Smith"
    }
  ]
}
```

---

## Health Check

### 1. Health Status
```
GET /api/health
```

**Description:** Check API health and system status

**Response (200):**
```json
{
  "success": true,
  "message": "✅ e-Samadhan AI API is running",
  "database": {
    "connected": true,
    "state": "connected"
  },
  "environment": "development",
  "devMode": {
    "enabled": true,
    "autoReset": false,
    "dataErasedOnShutdown": true
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "2.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "complaints": "/api/complaints",
    "admin": "/api/admin",
    "officer": "/api/officer",
    "notifications": "/api/notifications"
  }
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST request
- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks required permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Rate Limiting

- **Global Limit**: 200 requests per 15 minutes per IP
- **Auth Limit**: 30 requests per 15 minutes for login/register/password endpoints

Headers returned with rate limit info:
```
RateLimit-Limit: 200
RateLimit-Remaining: 199
RateLimit-Reset: 1642264800
```

---

## Socket.io Events

Real-time updates via WebSocket (Socket.io):

### Complaint Events
- `complaint:filed` — New complaint filed
- `complaint:assigned` — Complaint assigned to officer
- `complaint:updated` — Complaint status updated
- `complaint:resolved` — Complaint resolved

### Notification Events
- `notification:new` — New notification received
- `notification:read` — Notification marked as read

### Example Socket.io Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});

socket.on('complaint:updated', (data) => {
  console.log('Complaint updated:', data);
});
```

---

## Best Practices

1. **Always include Authorization header** for protected routes
2. **Handle rate limiting gracefully** - implement exponential backoff
3. **Validate file uploads** - check size and type before uploading
4. **Use pagination** for list endpoints to improve performance
5. **Cache responses** when appropriate
6. **Implement error retry logic** for critical operations
7. **Keep sensitive data secure** - never log tokens or passwords
8. **Monitor API usage** - track response times and error rates

---

## Version History

### v2.0.0 (Current)
- Added voice complaint analysis with Gemini AI
- Implemented face verification system
- Added liveness detection
- Real-time updates via Socket.io
- Comprehensive analytics and reporting

### v1.0.0
- Initial release
- Basic complaint filing and management
- User and officer roles
- Admin dashboard

---

## Support

For API issues or questions:
- **Documentation**: `/api` endpoint
- **Status**: `/api/health` endpoint
- **Report Issues**: Use in-app feedback system

---

**Last Updated:** January 15, 2024  
**API Version:** 2.0.0  
**Maintainer:** Development Team
