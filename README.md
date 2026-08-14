# e-Samadhan AI 🇮🇳

**AI-Powered Smart Government Grievance Redressal Platform**

A full-stack MERN application enabling citizens to file complaints, track resolutions, and provide feedback. Features JWT authentication, role-based access control, AI-powered complaint analysis, face verification, liveness detection, and real-time updates via Socket.io.

**Version:** 2.0.0  
**License:** MIT

---

## 🚀 Features

### Core Features
- **Complaint Management** - File, track, and resolve citizen grievances
- **Multi-Role System** - Citizen, Officer, and Admin roles with different dashboards
- **Real-Time Updates** - Socket.io integration for instant notifications
- **Advanced Analytics** - Comprehensive dashboards with performance metrics
- **Document Management** - Upload and manage complaint attachments

### AI & Verification
- **Voice Complaint Analysis** - AI-powered transcription and categorization using Gemini AI
- **Emergency Detection** - Automatic identification of critical complaints
- **Multi-Language Support** - Automatic language detection and translation
- **Face Verification** - Government ID and facial matching
- **Liveness Detection** - Anti-spoofing verification for secure authentication

### Officer Management
- **Complaint Assignment** - Automatic or manual assignment to officers
- **Performance Analytics** - Track officer productivity and resolution rates
- **Status Updates** - Real-time complaint status tracking
- **Department Organization** - Organize officers by department

### Admin Features
- **System Dashboard** - Real-time system analytics and alerts
- **User Management** - Manage citizens, officers, and admins
- **Emergency Complaints** - Prioritize and handle critical issues
- **Audit Logging** - Complete activity tracking
- **Report Generation** - PDF/Excel export of complaints and analytics

### Security
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Fine-grained permission management
- **Rate Limiting** - Protection against abuse (200 req/15min global, 30 req/15min auth)
- **HTTP-Only Cookies** - Secure token storage
- **Helmet Security** - HTTP security headers
- **CORS Protection** - Cross-origin resource sharing configuration

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) v4.4+ (local or Atlas)
- [npm](https://www.npmjs.com/) v9+
- Git

### Optional
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## 📁 Project Structure

```
e-Samadhan AI/
├── src/                                # React frontend (Vite)
│   ├── api/
│   │   └── axios.js                   # Axios instance + interceptors
│   ├── context/
│   │   └── AuthContext.jsx            # Global auth state management
│   ├── components/
│   │   ├── auth/                      # Login, Signup, Protected routes
│   │   ├── common/                    # Navbar, Footer, Sidebar
│   │   └── dashboard/                 # Shared dashboard components
│   ├── pages/
│   │   ├── auth/                      # Login, signup, forgot/reset password
│   │   ├── dashboards/                # Citizen, officer, and admin dashboards
│   │   └── complaints/                # Complaint views and management screens
│   ├── i18n/                          # Internationalization (translations)
│   ├── hooks/                         # Custom React hooks
│   ├── services/                      # API service functions
│   ├── utils/                         # Helper functions
│   ├── App.jsx                        # Main router + providers
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── backend/
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   ├── cloudinary.js              # Cloudinary config
│   │   ├── mongooseSetup.js           # Mongoose global config
│   │   └── loadEnv.js                 # Environment loading
│   ├── controllers/
│   │   ├── authController.js          # Auth logic
│   │   ├── complaintController.js     # Complaint CRUD
│   │   ├── adminController.js         # Admin operations
│   │   ├── aiController.js            # AI features (voice, language, translate)
│   │   ├── faceController.js          # Face verification
│   │   ├── livenessController.js      # Liveness detection
│   │   ├── reportController.js        # Report generation
│   │   ├── chatbotController.js       # AI chatbot
│   │   └── (other controllers)
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Complaint.js               # Complaint schema
│   │   ├── Admin.js                   # Admin schema
│   │   ├── Officer.js                 # Officer schema
│   │   ├── Notification.js            # Notification schema
│   │   └── (other models)
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints
│   │   ├── complaintRoutes.js         # Complaint endpoints
│   │   ├── adminRoutes.js             # Admin endpoints
│   │   ├── aiRoutes.js                # AI endpoints
│   │   └── (other routes)
│   ├── middleware/
│   │   ├── auth.js                    # JWT verification
│   │   ├── authMiddleware.js          # Admin auth
│   │   ├── errorHandler.js            # Global error handling
│   │   ├── upload.js                  # File upload config
│   │   └── (other middleware)
│   ├── services/
│   │   ├── uploadService.js           # Multer configuration
│   │   ├── notificationService.js     # Notification logic
│   │   └── (other services)
│   ├── utils/
│   │   ├── sendEmail.js               # Nodemailer setup
│   │   ├── sendToken.js               # JWT token utilities
│   │   └── (other utilities)
│   ├── socket/
│   │   └── index.js                   # Socket.io setup
│   ├── data/                          # JSON data files (dev mode)
│   ├── uploads/                       # Local file storage
│   ├── scripts/                       # Utility scripts
│   ├── server.js                      # Express app entry
│   └── package.json
├── public/
│   └── models/                        # ML models (if any)
├── index.html
├── vite.config.js                     # Vite config + API proxy
├── package.json                       # Frontend dependencies
├── postcss.config.js                  # PostCSS configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── api-documentation.md               # Complete API documentation
├── README.md                          # This file
└── LICENSE                            # MIT License
```

---

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/esamadhan-ai.git
cd esamadhan-ai
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/esamadhan_ai
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/esamadhan_ai

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@esamadhan.gov.in
FROM_NAME=e-Samadhan AI

# Frontend
CLIENT_URL=http://localhost:5173

# AI (Gemini API key)
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (Image upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# Start backend server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

## 🔧 Development Setup

### MongoDB Setup

#### Option 1: Local MongoDB

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGO_URI` in `.env`

### Email Configuration (Gmail)

1. Enable 2-factor authentication
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Use app password in `SMTP_PASSWORD`

### API Keys Setup

#### Gemini AI
- Sign up at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Get API key
- Add to `GEMINI_API_KEY` in `.env`

#### Cloudinary (Optional - for image storage)
- Create account at [Cloudinary](https://cloudinary.com/)
- Get credentials from dashboard
- Add to `.env`

---

## 📚 API Documentation

Comprehensive API documentation is available in [api-documentation.md](./api-documentation.md)

### Quick API Reference

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

#### Complaints
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id/status` - Update complaint status
- `POST /api/complaints/:id/upvote` - Upvote complaint
- `POST /api/complaints/:id/feedback` - Submit feedback

#### Admin
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/analytics` - System analytics
- `POST /api/admin/create-officer` - Create officer
- `GET /api/admin/officers` - Get all officers

#### AI Services
- `POST /api/ai/voice-complaint` - Analyze voice complaint
- `POST /api/ai/detect-emergency` - Detect emergency
- `POST /api/ai/translate` - Translate text

#### Other
- `GET /api/health` - Health check
- `POST /api/face/validate-upload` - Face verification
- `GET /api/notifications` - Get notifications

See [api-documentation.md](./api-documentation.md) for complete endpoint documentation.

---

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. User registers/logs in → JWT token issued
2. Token stored as HTTP-only cookie + `localStorage` fallback
3. Axios interceptor attaches token to all requests
4. Server verifies token validity
5. `AuthContext` checks token on app load
6. Protected routes use `ProtectedRoute` component

### Role-Based Access Control

| Role | Permissions | Dashboard |
|------|-----------|-----------|
| **Citizen** | File complaints, view own, upvote, feedback | `/citizen/dashboard` |
| **Officer** | View assigned, update status, analytics | `/officer/dashboard` |
| **Admin** | Full system access, manage users/officers | `/admin/dashboard` |

### Authorization Headers

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## 🗄️ Database Schema

### Key Collections

#### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (bcrypt),
  role: "citizen" | "officer" | "admin",
  profilePicture: String (URL),
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Complaints
```javascript
{
  _id: ObjectId,
  complaintId: String (auto-generated),
  title: String,
  description: String,
  category: String,
  priority: "low" | "medium" | "high" | "critical",
  status: "pending" | "in-progress" | "resolved" | "rejected",
  department: String,
  location: String,
  latitude: Number,
  longitude: Number,
  filedBy: ObjectId (User ref),
  assignedOfficer: ObjectId (Officer ref),
  attachments: [String] (URLs),
  upvotes: Number,
  feedback: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

#### Notifications
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (User ref),
  title: String,
  message: String,
  type: String,
  complaint: ObjectId (Complaint ref),
  isRead: Boolean,
  createdAt: Date
}
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

### Access URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### Test Accounts

**Citizen Account:**
```
Email: citizen@test.com
Password: Test@1234
```

**Officer Account:**
```
Email: officer@test.com
Password: Test@1234
```

**Admin Account:**
```
Email: admin@test.com
Password: Test@1234
```

> Note: Create test accounts via `/register` endpoint

---

## 📊 Available Scripts

### Frontend

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### Backend

```bash
npm run dev           # Start dev server with nodemon
npm start             # Start production server
npm test              # Run tests (if configured)
npm run seed          # Seed database (if script exists)
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- For Atlas, allow IP in network access settings

### JWT Token Expired
```
Error: Token expired
```
**Solution:**
- Clear cookies and localStorage
- Login again to get new token
- Check JWT_EXPIRE in `.env`

### Email Not Sending
```
Error: Invalid SMTP credentials
```
**Solution:**
- Verify SMTP credentials in `.env`
- Enable "Less secure apps" for Gmail or use app password
- Check internet connection

### File Upload Failed
```
Error: File size exceeds limit
```
**Solution:**
- Check file size limit in `backend/services/uploadService.js`
- Default limit: 5MB for images, 10MB for documents

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `CLIENT_URL` in backend `.env`
- Ensure frontend URL matches `CORS` configuration in `server.js`
- Clear browser cache

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

---

## 🧪 Testing

### Manual Testing with Postman

1. Import collection from `backend/postman_collection.json` (if available)
2. Set environment variables
3. Test endpoints

### Testing Workflow

1. **Auth**: Register → Login → Get token
2. **Complaints**: Create → Read → Update → Delete
3. **Admin**: Check analytics → Create officer → Manage users
4. **Real-time**: Open multiple windows to test Socket.io updates

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### Backend Deployment (Heroku/Railway)

```bash
# Build Docker image (if using Docker)
docker build -t esamadhan-ai .

# Or push to Heroku
heroku login
heroku create esamadhan-ai
git push heroku main
```

### Environment Variables (Production)

Update `.env` with production values:
- `MONGO_URI` → MongoDB Atlas connection
- `CLIENT_URL` → Production frontend URL
- `NODE_ENV` → `production`
- `JWT_SECRET` → Strong random key
- Email, API keys, etc.

---

## 📝 Development Guidelines

### Code Style
- Use ES6+ syntax
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages
```
feat: Add complaint upvoting feature
fix: Resolve email validation bug
docs: Update API documentation
style: Format code with Prettier
refactor: Simplify complaint service
test: Add notification tests
```

### Pull Request Process
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request
5. Wait for review and CI to pass
6. Merge to main

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📖 Documentation

- [API Documentation](./api-documentation.md) - Complete API reference
- [Database Schema](./docs/DATABASE.md) - Mongoose models
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production setup

---

## 🆘 Support & Issues

- **Bug Reports**: Open GitHub issue with reproduction steps
- **Feature Requests**: Discuss in GitHub discussions
- **Questions**: Ask in discussions or email support

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙌 Acknowledgments

- Government of India initiative for grievance redressal
- MERN stack community
- Contributors and testers

---

## 📞 Contact

**Project Lead**: Development Team  
**Email**: support@esamadhan.gov.in  
**Website**: https://esamadhan.gov.in

---

**Last Updated:** January 2024  
**Version:** 2.0.0  
**Status:** Active Development
