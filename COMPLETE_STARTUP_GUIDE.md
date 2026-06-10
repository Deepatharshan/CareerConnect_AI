# 🚀 Complete Project Startup Guide - CareerConnect AI

## ✅ Prerequisites Check

Before starting, verify you have:

```bash
# Check Java version (need 11+)
java -version

# Check Maven version (need 3.6+)
mvn -version

# Check Node.js version (need 16+)
node -v
npm -v

# Check Docker
docker --version
docker-compose --version
```

If any are missing, install them first!

---

## 🎯 Step-by-Step Startup (Total Time: ~10 minutes)

### **Phase 1: Clean Backend Build** (5 minutes)

```bash
# Navigate to project root
cd C:/Users/Deepatharshan/CareerConnect_AI

# Go to backend directory
cd backend

# Clean and build (removes old artifacts)
mvn clean

# Install dependencies and build
mvn install -DskipTests

# Expected output:
# [INFO] BUILD SUCCESS
# [INFO] Total time: XX.XXX s
```

**What this does:**
- Cleans old compiled code
- Downloads dependencies
- Compiles all Java files
- Packages services as JARs
- Creates Docker images

---

### **Phase 2: Start Backend Services via Docker** (2 minutes)

```bash
# Go back to root directory
cd ..

# Stop any existing containers
docker-compose down

# Start fresh containers with rebuilt images
docker-compose up -d

# Check if services are running
docker ps

# Expected output:
# CONTAINER ID   IMAGE                              STATUS
# abc123...      careerconnect/api-gateway:latest   Up 2 seconds
# def456...      careerconnect/auth-service:latest  Up 2 seconds
# ghi789...      careerconnect/job-service:latest   Up 2 seconds
# ... (more services)
```

**Services that should be running:**
- ✅ Eureka Discovery Server (Port 8761)
- ✅ API Gateway (Port 8080)
- ✅ Auth Service (Port 8081)
- ✅ Job Service (Port 8082)
- ✅ Profile Service (Port 8083)
- ✅ Application Service (Port 8084)
- ✅ Company Service (Port 8085)
- ✅ AI CV Service (Port 8086)

---

### **Phase 3: Verify Backend is Healthy** (1 minute)

```bash
# Wait 10-15 seconds for services to fully start

# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check Auth Service health
curl http://localhost:8081/actuator/health

# Check if services registered with Eureka
curl http://localhost:8761/eureka/apps

# Expected output: JSON with "UP" status
```

---

### **Phase 4: Start Frontend** (1 minute)

```bash
# Navigate to frontend directory
cd frontend/career-connect-ui

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Expected output:
# VITE v5.2.0  ready in 234 ms
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

---

### **Phase 5: Access the Application** (1 minute)

Open your browser and navigate to:

```
http://localhost:5173
```

You should see:
- ✅ Beautiful landing page
- ✅ Navigation bar
- ✅ "Get Started" button

---

## 🧪 Complete Verification Checklist

Run through this checklist to verify everything works:

### **Backend Services Running**
```bash
# Verify all containers are running
docker ps | grep careerconnect

# Should show 8 containers (all services)
# Status should be "Up X seconds/minutes"
```

### **Frontend Running**
```bash
# Check if npm dev server is running
curl http://localhost:5173

# Should return HTML of the app
```

### **Services Registered with Eureka**
```bash
curl http://localhost:8761/eureka/apps

# Should show all services with status UP
```

### **API Gateway Routing**
```bash
# Test if API Gateway is routing requests
curl http://localhost:8080/api/v1/auth/register \
  -X OPTIONS \
  -H "Origin: http://localhost:5173"

# Should return 200 OK with CORS headers
```

---

## 📋 Test the Full Flow

### **Test 1: User Registration**

1. Open `http://localhost:5173` in browser
2. Click "Get Started"
3. Select "Job Seeker"
4. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
5. Click "Create Account"
6. ✅ Should redirect to Job Feed page

### **Test 2: User Login**

1. Go to `http://localhost:5173/login`
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. ✅ Should redirect to Job Feed page
5. ✅ Should see jobs listed

### **Test 3: Employer Dashboard**

1. Go to `http://localhost:5173/register`
2. Select "Employer"
3. Fill in:
   - Email: `employer@example.com`
   - Password: `password123`
4. Click "Create Account"
5. ✅ Should redirect to Dashboard
6. Click "Post a New Job"
7. Fill in job details and submit
8. ✅ Should see success notification

### **Test 4: Browse Jobs**

1. Go to `http://localhost:5173/jobs`
2. Should see job listings
3. Try search functionality
4. Try filter by job type
5. ✅ All should work smoothly

---

## 🛠️ Quick Reference Commands

### **View Logs**

```bash
# View API Gateway logs
docker logs api-gateway

# View Auth Service logs
docker logs auth-service

# View live logs (follow)
docker logs -f api-gateway

# View last 50 lines
docker logs --tail 50 api-gateway
```

### **Stop Services**

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop auth-service

# Stop and remove
docker-compose down
```

### **Restart Services**

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart job-service

# Full restart (stop and start)
docker-compose down && docker-compose up -d
```

### **Stop Frontend**

```bash
# In the terminal where npm run dev is running:
# Press Ctrl+C

# Then restart:
cd frontend/career-connect-ui
npm run dev
```

---

## ⚠️ Troubleshooting

### **Issue: Maven build fails (Exit Code 127)**

```bash
# Maven not found. Install Maven or add to PATH

# Option 1: Install via package manager
# Windows: choco install maven
# Mac: brew install maven
# Linux: sudo apt install maven

# Option 2: Check PATH
echo $PATH

# Option 3: Run from correct directory
cd C:/Users/Deepatharshan/CareerConnect_AI/backend
```

### **Issue: Java service won't start (Exit Code 1)**

```bash
# Clear and rebuild
mvn clean
mvn install -DskipTests

# Check Java version
java -version

# Restart Docker
docker-compose down -v
docker-compose up -d
```

### **Issue: Port Already in Use**

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Or in Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Then restart Docker
docker-compose restart
```

### **Issue: CORS Error on Frontend**

```bash
# Make sure CORS is configured (already done)
# Rebuild backend
cd backend
mvn clean install -DskipTests
cd ..

# Restart services
docker-compose down
docker-compose up -d
```

### **Issue: Frontend won't start (npm run dev fails)**

```bash
# Clear node modules
cd frontend/career-connect-ui
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start again
npm run dev
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│            Your Browser                             │
│        http://localhost:5173                        │
│      (React Frontend - Career Connect UI)           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP Requests
                       ↓
┌─────────────────────────────────────────────────────┐
│       API Gateway (Spring Cloud Gateway)            │
│            Port 8080                                │
│   Routes requests to microservices                  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
   ┌─────────┐   ┌─────────┐   ┌──────────┐
   │ Auth    │   │ Job     │   │ Profile  │
   │ Service │   │ Service │   │ Service  │
   │ :8081   │   │ :8082   │   │ :8083    │
   └────┬────┘   └────┬────┘   └────┬─────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ↓
         ┌──────────────────────────┐
         │     PostgreSQL Database  │
         │     (Docker Container)   │
         └──────────────────────────┘

Eureka Discovery Server (Port 8761)
  - All services register here
  - API Gateway discovers services
```

---

## 🔐 Default Credentials

**For Testing (After First Registration):**
- Email: `test@example.com`
- Password: `password123`
- Role: Job Seeker (or Employer for dashboard)

---

## 📝 Environment Structure

```
CareerConnect_AI/
├── frontend/
│   └── career-connect-ui/           ← React App (Port 5173)
│       ├── src/
│       ├── package.json
│       └── npm run dev
├── backend/
│   ├── pom.xml                      ← Maven parent
│   ├── api-gateway/                 ← Port 8080
│   ├── auth-service/                ← Port 8081
│   ├── job-service/                 ← Port 8082
│   ├── profile-service/             ← Port 8083
│   ├── application-service/         ← Port 8084
│   ├── company-service/             ← Port 8085
│   ├── ai-cv-service/               ← Port 8086
│   ├── discovery-server/            ← Port 8761 (Eureka)
│   └── notification-service/
├── docker-compose.yml               ← Docker orchestration
├── Jenkinsfile                      ← CI/CD pipeline
└── README.md
```

---

## 🎯 Port Reference

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Frontend | 5173 | ✅ Dev Server | http://localhost:5173 |
| API Gateway | 8080 | ✅ Main API | http://localhost:8080 |
| Auth Service | 8081 | ✅ Direct Access | http://localhost:8081 |
| Job Service | 8082 | ✅ Direct Access | http://localhost:8082 |
| Profile Service | 8083 | ✅ Direct Access | http://localhost:8083 |
| Application Service | 8084 | ✅ Direct Access | http://localhost:8084 |
| Company Service | 8085 | ✅ Direct Access | http://localhost:8085 |
| AI CV Service | 8086 | ✅ Direct Access | http://localhost:8086 |
| Eureka Server | 8761 | ✅ Discovery | http://localhost:8761 |
| PostgreSQL | 5432 | ✅ Database | localhost:5432 |

---

## ✨ Features to Test

After everything is running, test these features:

- [x] **Home Page** - Beautiful landing page
- [x] **Registration** - Create account as Job Seeker or Employer
- [x] **Login** - Sign in with credentials
- [x] **Job Feed** - Browse all jobs (protected route)
- [x] **Search Jobs** - Filter by title/location
- [x] **Filter Jobs** - By job type
- [x] **Save Jobs** - Bookmark for later
- [x] **Employer Dashboard** - View stats and applicants (protected)
- [x] **Post Jobs** - Create new job listings
- [x] **Applications** - View job applications
- [x] **Logout** - Sign out securely

---

## 🚀 Quick Start Summary

```bash
# 1. Build backend
cd backend && mvn clean install -DskipTests

# 2. Start services
cd .. && docker-compose down && docker-compose up -d

# 3. Wait 15 seconds for services to start

# 4. Start frontend
cd frontend/career-connect-ui && npm install && npm run dev

# 5. Open browser
# http://localhost:5173
```

**Total Time: ~10 minutes**

---

## 📞 Need Help?

Check these documents:
- `CORS_FIX_GUIDE.md` - CORS issues
- `CORS_TESTING_GUIDE.md` - How to verify CORS
- `FRONTEND_README.md` - Frontend setup
- `QUICK_START.md` - Frontend quick reference

---

## 🎉 You're Ready!

Once you see:
- ✅ Docker containers running
- ✅ Frontend dev server running
- ✅ `http://localhost:5173` loads
- ✅ No CORS errors
- ✅ Can register and login

**Congratulations! Your full application is running!** 🎊
