# CareerConnect AI - Frontend Setup Guide

## 🎯 Overview

The frontend is now fully built out with complete React pages using React Router, Tailwind CSS, and Lucide React icons. All pages are styled and fully functional.

## 📋 Pages Implemented

### 1. **Home Page** (`/`)
- Beautiful landing page with hero section
- Features showcase with 4 key features
- Call-to-action section
- Statistics display
- Responsive design for all devices

### 2. **Login Page** (`/login`)
- Email/password authentication
- JWT token storage
- Password visibility toggle
- Link to register page
- Error handling
- Role-based navigation (redirects to /dashboard for EMPLOYER, /jobs for JOB_SEEKER)

### 3. **Register Page** (`/register`)
- Role selection (Job Seeker vs Employer)
- Email/password registration
- Password strength indicator
- Form validation
- Link to login page
- Responsive role picker buttons

### 4. **Job Feed Page** (`/jobs`) 🔒 Protected Route
- List all available jobs
- Search functionality by title/location
- Filter by job type (Full Time, Part Time, Contract, Internship)
- Job cards with salary, location, company info
- Save/bookmark jobs
- Apply button for authenticated users
- Placeholder jobs when backend is down
- Real-time filtered results display

### 5. **Employer Dashboard** (`/dashboard`) 🔒 Protected Route (Employer Only)
- Header with welcome message
- Stats dashboard (Jobs Posted, Applicants, Shortlisted, Active Listings)
- Post new job modal
- Recent applications table
- Job posting form with:
  - Job title
  - Location
  - Job type selector
  - Salary range
  - Description
  - Requirements
- Applicant management
- Success/error notifications

### 6. **Navigation Bar** (Global Component)
- Responsive navigation with mobile menu
- Logo and branding
- Navigation links (Find Jobs, Dashboard for employers, AI Analysis)
- Authentication state indicator
- User profile display
- Logout button
- Sign in/Get Started buttons for unauthenticated users

## 🛠️ Tech Stack

- **React 18.2**: UI library
- **React Router v6**: Client-side routing
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Backend services running on `http://localhost:8080`

### Installation

```bash
# Navigate to frontend directory
cd frontend/career-connect-ui

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (runs on http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm preview
```

### Linting

```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Register**: User chooses role (Job Seeker/Employer) and creates account
2. **Login**: User enters credentials, receives JWT token
3. **Token Storage**: JWT stored in localStorage and Auth Context
4. **Protected Routes**: Routes check authentication and role
5. **Navigation**: Users redirected based on role (EMPLOYER → Dashboard, JOB_SEEKER → Jobs)

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point with AuthProvider
├── index.css              # Global styles
├── api.ts                 # API integration
├── components/
│   └── Navbar.tsx         # Navigation component
├── context/
│   └── AuthContext.tsx    # Auth state management
└── pages/
    ├── Home.tsx           # Landing page
    ├── Login.tsx          # Login page
    ├── Register.tsx       # Registration page
    ├── JobFeed.tsx        # Job listings
    └── EmployerDashboard.tsx  # Employer portal
```

## 🎨 Design Highlights

- **Color Scheme**: Blue gradient primary colors with slate backgrounds
- **Animations**: Smooth transitions and fade-in/slide-up animations
- **Responsive**: Mobile-first design with breakpoints for tablet/desktop
- **Accessibility**: Semantic HTML, proper form labels, accessible buttons
- **Performance**: Lazy loading, optimized images, code splitting via Vite

## 🔌 API Integration

All API calls go through `api.ts` with the base URL configured to:
```
http://localhost:8080/api/v1
```

### Key Endpoints Used:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /jobs` - Fetch all jobs
- `POST /jobs` - Create new job (employer only)
- `POST /jobs/{id}/apply` - Apply for a job
- `GET /companies/{id}/jobs` - Get employer's jobs

## 🧪 Testing Routes

1. **Anonymous User**: Can see Home and register/login pages
2. **Job Seeker**: Can access Job Feed after login
3. **Employer**: Can access Dashboard after login
4. **Protected Routes**: Automatically redirect to login if not authenticated

## 🐛 Troubleshooting

### Jobs not loading?
- Ensure backend is running on `http://localhost:8080`
- Check browser console for API errors
- Placeholder jobs will display if backend is unavailable

### Can't log in?
- Verify backend auth service is running
- Check credentials are correct
- Clear localStorage and try again

### Styling looks off?
- Run `npm install` to ensure all dependencies are installed
- Restart dev server: `npm run dev`
- Clear browser cache

## 📝 Environment Variables

Create a `.env` file (optional, for future use):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Then update `api.ts` to use: `import.meta.env.VITE_API_BASE_URL`

## 🎯 Next Steps

1. **Backend Integration**: Ensure all microservices are running
2. **User Testing**: Test all flows (login, register, job search, posting)
3. **State Management**: Consider Redux/Zustand for complex state
4. **Error Handling**: Add comprehensive error boundaries
5. **Analytics**: Integrate tracking for user behavior
6. **PWA**: Convert to Progressive Web App

## 📞 Support

For issues or questions about the frontend setup, check:
- Browser console for JavaScript errors
- Network tab in DevTools for API calls
- Terminal for build/dev server errors

---

**Version**: 1.0.0  
**Last Updated**: May 28, 2026
