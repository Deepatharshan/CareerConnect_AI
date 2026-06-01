# 📖 Step-by-Step Visual Guide - Run Your Project

This guide shows exactly what you'll see at each step.

---

## 📍 Step 1: Navigate to Backend Directory

**Command:**

```bash
cd C:/Users/Deepatharshan/CareerConnect_AI/backend
```

**Expected Result:**

```
C:\Users\Deepatharshan\CareerConnect_AI\backend>
```

✅ You're in the backend folder

---

## 📍 Step 2: Build Backend

**Command:**

```bash
mvn clean install -DskipTests
```

**What You'll See:**

```
[INFO] Scanning for projects...
[INFO]
[INFO] --------< com.careerconnect:careerconnect-parent >--------
[INFO] Building careerconnect-parent 1.0.0-SNAPSHOT
[INFO] --------------------------------[ pom ]--------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ careerconnect-parent ---
[INFO] Deleting C:\Users\Deepatharshan\CareerConnect_AI\backend\target
...
[INFO] Building careerconnect/auth-service:latest
[INFO] Building careerconnect/job-service:latest
[INFO] Building careerconnect/api-gateway:latest
...
[INFO] BUILD SUCCESS
[INFO] Total time: 3 min 45 s
[INFO] Finished at: 2026-05-28T10:30:00+00:00
```

✅ When you see "BUILD SUCCESS", you're done with this step!

**Time:** 3-5 minutes

---

## 📍 Step 3: Navigate to Root and Stop Old Services

**Command:**

```bash
cd ..
docker-compose down
```

**What You'll See:**

```
Stopping careerconnect_job_1 ... done
Stopping careerconnect_auth_1 ... done
Stopping careerconnect_api_gateway_1 ... done
... (more services)
Removing careerconnect_job_1 ... done
Removing careerconnect_auth_1 ... done
... (more services)
Removing network careerconnect_default
```

✅ All old containers are stopped and removed

---

## 📍 Step 4: Start Fresh Services

**Command:**

```bash
docker-compose up -d
```

**What You'll See:**

```
Creating network "careerconnect_default" with the default driver
Creating careerconnect_postgres_1         ... done
Creating careerconnect_discovery_server_1 ... done
Creating careerconnect_auth_service_1     ... done
Creating careerconnect_job_service_1      ... done
Creating careerconnect_api_gateway_1      ... done
... (more services)
```

✅ All services are starting!

**Time:** 15-20 seconds for full startup

---

## 📍 Step 5: Verify Services Are Running

**Command:**

```bash
docker ps
```

**What You'll See:**

```
CONTAINER ID   IMAGE                              PORTS                   STATUS
abc12345ab12   careerconnect/api-gateway:latest   0.0.0.0:8080->8080/tcp  Up 5 seconds
def45678de45   careerconnect/auth-service:latest  0.0.0.0:8081->8081/tcp  Up 4 seconds
ghi78901gh78   careerconnect/job-service:latest   0.0.0.0:8082->8082/tcp  Up 3 seconds
jkl01234jk01   careerconnect/profile-service      0.0.0.0:8083->8083/tcp  Up 2 seconds
... (more services)
```

✅ All services are UP and running!

---

## 📍 Step 6: Open NEW Terminal for Frontend

**Action:**

- Open a new terminal window (don't close the current one)

**Command:**

```bash
cd C:/Users/Deepatharshan/CareerConnect_AI/frontend/career-connect-ui
```

**Expected Result:**

```
C:\Users\Deepatharshan\CareerConnect_AI\frontend\career-connect-ui>
```

✅ You're in the frontend folder

---

## 📍 Step 7: Install Frontend Dependencies

**Command:**

```bash
npm install
```

**What You'll See:**

```
npm notice created a lockfile as package-lock.json
npm notice New packages added, removed one and audited 48 packages in 8.5s

npm notice found 0 vulnerabilities
```

✅ Dependencies installed!

**Time:** 1-2 minutes

---

## 📍 Step 8: Start Frontend Development Server

**Command:**

```bash
npm run dev
```

**What You'll See:**

```
  VITE v5.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is running!

**Keep this terminal open!** Don't close it or the app will stop.

---

## 📍 Step 9: Open in Browser

**Action:**
Open your web browser and go to:

```
http://localhost:5173
```

**What You'll See:**

```
┌─────────────────────────────────────────────┐
│  CareerConnect AI                           │
│  ─────────────────────────────────────────  │
│                                             │
│  Find Your Dream Job with                  │
│  Superhuman Precision                      │
│                                             │
│  [Search bar]  [Search bar]  [Search Btn]  │
│                                             │
│  [Get Started button]                       │
│                                             │
└─────────────────────────────────────────────┘
```

✅ Your homepage is loading!

---

## 📍 Step 10: Test the Application

**Click "Get Started"**

You should see:

```
┌─────────────────────────────────────────────┐
│  Create your account                        │
│  ─────────────────────────────────────────  │
│                                             │
│  [Job Seeker]  [Employer]                  │
│                                             │
│  Email: [text field]                        │
│  Password: [password field]                 │
│                                             │
│  [Create Account]                           │
│                                             │
└─────────────────────────────────────────────┘
```

✅ Registration page loaded!

---

## 📍 Step 11: Register an Account

**Fill in the form:**

```
Select: Job Seeker
Email:  test@example.com
Password: password123
```

**Click:** "Create Account"

**What You'll See:**

```
✅ Form submits
✅ Loading spinner appears
✅ Redirects to Job Feed page
✅ Shows list of jobs
```

✅ **SUCCESS!** Your app is working!

---

## 📍 Step 12: Browse Jobs

You should see:

```
┌─────────────────────────────────────────────┐
│ Find Your Next Opportunity                  │
│ ─────────────────────────────────────────── │
│ [Search bar]  [Filter dropdown]             │
│                                             │
│ Job Cards:                                  │
│ ┌─────────────────────────────────────────┐ │
│ │ Senior Java Backend Engineer      [❤]  │ │
│ │ TechCorp · Remote                       │ │
│ │ 📍 Remote  💼 Full Time  💰 $90k-$130k │ │
│ │ [Apply Now]                             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ React Frontend Developer          [❤]  │ │
│ │ StartupXYZ · Bangalore                  │ │
│ │ 📍 Bangalore  💼 Full Time  💰 $60k-$90k│
│ │ [Apply Now]                             │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ... (more jobs)                            │
└─────────────────────────────────────────────┘
```

✅ Jobs are displaying!

---

## 📍 Step 13: Test Employer Dashboard

**Go to URL:**

```
http://localhost:5173/register
```

**This time:**

1. Click "Employer" role
2. Fill email: `employer@example.com`
3. Fill password: `password123`
4. Click "Create Account"

**You'll see:**

```
┌─────────────────────────────────────────────┐
│  Employer Dashboard                         │
│  ─────────────────────────────────────────  │
│                                             │
│  📊 Stats:                                  │
│  │ Jobs Posted: 3                          │
│  │ Total Applicants: 47                    │
│  │ Shortlisted: 12                         │
│  │ Active Listings: 3                      │
│                                             │
│  [📌 Post a New Job]                        │
│                                             │
│  Recent Applications:                       │
│  ┌─────────────────────────────────────────┐ │
│  │ Arun Kumar  |  Senior Java Engineer  │ │
│  │ Status: SHORTLISTED                  │ │
│  └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

✅ Employer dashboard is working!

---

## 📍 Step 14: Post a Job (Optional Test)

**Click:** "📌 Post a New Job"

**Fill in:**

```
Job Title: React Developer
Location: Remote
Job Type: Full Time
Salary Min: $70000
Salary Max: $100000
Description: Looking for experienced React developer...
```

**Click:** "🚀 Post Job"

**You should see:**

```
✅ Job posted successfully!
The listing is now live.
```

✅ Jobs posting works!

---

## 🎉 All Done! Your App is Running!

### **What's Running:**

| Component        | Status     | URL                   |
| ---------------- | ---------- | --------------------- |
| React Frontend   | ✅ Running | http://localhost:5173 |
| API Gateway      | ✅ Running | http://localhost:8080 |
| Auth Service     | ✅ Running | http://localhost:8081 |
| Job Service      | ✅ Running | http://localhost:8082 |
| Database         | ✅ Running | PostgreSQL            |
| Discovery Server | ✅ Running | http://localhost:8761 |

### **Features Working:**

- ✅ Homepage
- ✅ User Registration (Job Seeker & Employer)
- ✅ User Login
- ✅ Job Feed
- ✅ Job Search & Filtering
- ✅ Employer Dashboard
- ✅ Post Jobs
- ✅ Application Management

---

## 📋 Summary

**You just:**

1. ✅ Built the entire backend
2. ✅ Started 8 microservices with Docker
3. ✅ Started the React frontend
4. ✅ Registered as Job Seeker
5. ✅ Registered as Employer
6. ✅ Tested the full application flow

**Total Time: ~10 minutes**

**Congratulations!** 🎊 Your CareerConnect AI application is fully running!

---

## 🚀 Next Steps

1. **Explore the app** - Try all features
2. **Check DevTools** (F12) - Verify no errors
3. **Test API calls** - See data flowing
4. **Build more features** - Use this as your base

---

## 🛑 To Stop Everything

**Stop Frontend:**

```bash
# In frontend terminal, press Ctrl+C
```

**Stop Backend:**

```bash
# In backend terminal, run:
docker-compose down
```

---

**Happy coding!** 🚀
