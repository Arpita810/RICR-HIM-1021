# e-Samadhan AI 🇮🇳

**AI-Powered Smart Government Grievance Redressal Platform**

Full-stack MERN application with JWT authentication, role-based access control, and a modern React landing page.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

## Project Structure

```
e-Samadhan AI/
├── src/                        # React frontend
│   ├── api/axios.js            # Axios instance + interceptors
│   ├── context/AuthContext.jsx # Auth state management
│   ├── components/
│   │   ├── auth/               # AuthLayout, ProtectedRoute
│   │   └── (landing sections)
│   ├── pages/
│   │   ├── auth/               # Login, Signup, ForgotPassword, ResetPassword
│   │   └── dashboards/         # Citizen, Officer, Admin dashboards
│   └── App.jsx                 # Router + AuthProvider
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── middleware/             # auth, errorHandler, upload
│   ├── models/User.js
│   ├── routes/authRoutes.js
│   ├── utils/                  # sendToken, sendEmail
│   └── server.js
├── index.html
├── vite.config.js              # Proxies /api → localhost:5000
└── package.json
```

---

## Quick Start

### 1. Frontend

```bash
npm install
npm run dev
```
Runs at: http://localhost:5173

### 2. Backend

```bash
cd backend
```

Copy and configure environment:
```bash
copy .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/esamadhan_ai
JWT_SECRET=your_secret_key_min_32_chars
```

Install and start:
```bash
npm install
npm run dev
```
Runs at: http://localhost:5000

---

## API Routes

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register citizen or officer |
| POST | `/api/auth/login` | Public | Login with email + password |
| POST | `/api/auth/logout` | Private | Logout (clears cookie) |
| GET | `/api/auth/me` | Private | Get current user |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password/:token` | Public | Reset password |
| PUT | `/api/auth/update-password` | Private | Change password |
| GET | `/api/health` | Public | Health check |

---

## Auth Flow

1. User registers/logs in → JWT issued as HTTP-only cookie + response body
2. Token stored in `localStorage` as fallback
3. Axios interceptor attaches token to every request
4. `AuthContext` verifies token on app load via `GET /api/auth/me`
5. `ProtectedRoute` / `RoleRoute` guard dashboard pages
6. Role-based redirect: citizen → `/citizen/dashboard`, officer → `/officer/dashboard`, admin → `/admin/dashboard`

---

## Roles

| Role | Registration | Dashboard |
|------|-------------|-----------|
| Citizen | Self-register | `/citizen/dashboard` |
| Officer | Self-register (select department) | `/officer/dashboard` |
| Admin | Backend only (manual DB insert) | `/admin/dashboard` |

### Create Admin (manual)

```js
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@esamadhan.gov.in",
  password: "$2a$12$...", // bcrypt hash of your password
  role: "admin",
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date()
})
```

Or use the seed script approach with bcryptjs.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/esamadhan_ai
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@esamadhan.gov.in
FROM_NAME=e-Samadhan AI
CLIENT_URL=http://localhost:5173
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router DOM v6 |
| HTTP | Axios |
| Auth State | React Context API |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, HTTP-only cookies |
| Security | Helmet, CORS, express-rate-limit |
| File Upload | Multer |
| Email | Nodemailer |

---

## License

MIT
