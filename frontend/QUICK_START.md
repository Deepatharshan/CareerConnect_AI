# 🚀 Quick Start Guide - CareerConnect AI Frontend

## Prerequisites

- ✅ Node.js 16+ installed
- ✅ Backend services running on `localhost:8080`
- ✅ npm or yarn package manager

## 1️⃣ Install Dependencies

```bash
cd frontend/career-connect-ui
npm install
```

## 2️⃣ Start Development Server

```bash
npm run dev
```

**Output:**
```
VITE v5.2.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

Open `http://localhost:5173` in your browser! 🎉

## 3️⃣ Test the Application

### **Try as Job Seeker**
1. Click "Get Started" or go to `/register`
2. Select **"Job Seeker"** role
3. Enter any email: `jobseeker@test.com`
4. Enter password: `password123`
5. Click "Create Account"
6. ✅ You're redirected to `/jobs` (Job Feed)
7. Browse jobs, search, filter, and click "Apply Now"

### **Try as Employer**
1. Go to `/register` again (or click "Get Started")
2. Select **"Employer"** role
3. Enter any email: `employer@test.com`
4. Enter password: `password123`
5. Click "Create Account"
6. ✅ You're redirected to `/dashboard` (Employer Dashboard)
7. Click "📌 Post a New Job"
8. Fill in job details and submit
9. Job appears in "Recent Applications" table

### **Test Protected Routes**
```
❌ Try to access /jobs without logging in
  → Redirected to /login

❌ Try to access /dashboard as Job Seeker
  → Redirected to home /

✅ Login as Job Seeker, then visit /dashboard
  → Redirected to / (not allowed)

✅ Login as Employer and visit /dashboard
  → You can see the dashboard
```

## 📱 All Available Routes

```
GET  /              → Home Page
GET  /login         → Login Page
GET  /register      → Register Page
GET  /jobs          → Job Feed (Protected)
GET  /dashboard     → Employer Dashboard (Protected + Employer Role)
```

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Clean
rm -rf node_modules package-lock.json
npm install          # Fresh install
```

## 📂 Project Structure

```
career-connect-ui/
├── src/
│   ├── App.tsx                 # Main router app
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── api.ts                  # API calls
│   ├── components/
│   │   └── Navbar.tsx          # Navigation bar
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state
│   └── pages/
│       ├── Home.tsx            # Landing page
│       ├── Login.tsx           # Login form
│       ├── Register.tsx        # Registration form
│       ├── JobFeed.tsx         # Job listings
│       └── EmployerDashboard.tsx  # Employer portal
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

## 🔌 Backend Requirements

Make sure these services are running:

| Service | Port | Status |
|---------|------|--------|
| API Gateway | 8080 | ⚠️ Required |
| Auth Service | 8081 | ⚠️ Required |
| Job Service | 8082 | ⚠️ Required |

**Start Backend:**
```bash
cd ../..
docker-compose up -d
# or
# npm run backend (if configured)
```

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Kill the process
kill -9 $(lsof -ti:5173)

# Or use different port
npm run dev -- --port 3000
```

### Jobs Not Loading
- ✅ Check if backend is running: `curl http://localhost:8080/api/v1/jobs`
- ✅ Check browser console for errors (F12)
- ✅ Check Network tab to see API calls
- ✅ Placeholder jobs will show if backend is down

### Can't Log In
- ✅ Verify auth service is running on port 8081
- ✅ Try different email/password combination
- ✅ Clear browser cache and localStorage

```javascript
// Clear localStorage in console
localStorage.clear()
// Reload page
window.location.reload()
```

### Styling Broken
```bash
# Rebuild Tailwind cache
npm install
npm run dev
```

## 🎨 Customize Theme

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        600: '#2563eb',  // ← Change main color
        700: '#1d4ed8',
      }
    }
  }
}
```

## 🔒 Authentication Flow

```
Register
  ↓
POST /auth/register
  ↓
Backend returns JWT token
  ↓
Token stored in localStorage
  ↓
Redirect based on role
```

## 📝 Test Accounts

You can use any email/password combination (6+ chars):

```
Job Seeker:
- Email: candidate@test.com
- Password: test123

Employer:
- Email: company@test.com
- Password: test123
```

## ✅ Features Implemented

### ✨ Core Features
- [x] Beautiful landing page
- [x] User authentication (login/register)
- [x] Role-based routing (Job Seeker vs Employer)
- [x] Job feed with search & filters
- [x] Job posting for employers
- [x] Responsive design
- [x] Protected routes
- [x] JWT token management

### 🎯 Job Seeker Features
- [x] Browse all jobs
- [x] Search by title/location
- [x] Filter by job type
- [x] Save/bookmark jobs
- [x] Apply for jobs
- [x] View job details

### 💼 Employer Features
- [x] Dashboard overview
- [x] Post new jobs
- [x] View applicants
- [x] Manage applications
- [x] Track job listings

## 📱 Mobile Responsive

All pages are fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

Test by resizing browser or using DevTools mobile view.

## 🚀 Deploy to Production

```bash
# Build
npm run build

# Output in dist/
# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
# - Your own server
```

## 📞 Need Help?

1. Check [FRONTEND_README.md](./FRONTEND_README.md) for detailed docs
2. Check [PAGES_IMPLEMENTATION.md](./PAGES_IMPLEMENTATION.md) for features
3. Review source code comments
4. Check browser console (F12) for errors

## 🎉 You're All Set!

Your CareerConnect AI frontend is ready to use. Start the dev server and explore the application!

```bash
npm run dev
```

Happy coding! 🚀
