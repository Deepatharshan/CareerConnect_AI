# 🧪 CORS Fix - Testing & Verification Guide

## 📋 Complete Steps to Fix and Test CORS

### **Phase 1: Rebuild Backend** (5 minutes)

```bash
# Navigate to backend
cd backend

# Clean build (removes old compiled code)
mvn clean

# Build all services
mvn install -DskipTests

# Expected output: "BUILD SUCCESS"
```

**What this does:**
- Compiles all Java files with new CORS config
- Creates updated JAR files for Docker
- Prepares services to be deployed

---

### **Phase 2: Restart Docker Services** (2 minutes)

```bash
# Go to root directory
cd ..

# Stop all running containers
docker-compose down

# Start fresh containers with new code
docker-compose up -d

# Verify services are running
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE                    STATUS
abc123...      careerconnect/api-gateway        Up 2 seconds
def456...      careerconnect/auth-service      Up 2 seconds
ghi789...      careerconnect/job-service       Up 2 seconds
jkl012...      careerconnect/profile-service   Up 2 seconds
...
```

---

### **Phase 3: Verify Services Are Healthy** (1 minute)

```bash
# Check API Gateway
curl http://localhost:8080/actuator/health

# Check Auth Service
curl http://localhost:8081/actuator/health

# Check Job Service
curl http://localhost:8082/actuator/health
```

**Expected output:**
```json
{
  "status": "UP",
  "components": {
    "discoveryClient": {
      "status": "UP"
    }
  }
}
```

---

### **Phase 4: Test CORS Preflight Request** (2 minutes)

Open terminal and run this command:

```bash
curl -i -X OPTIONS http://localhost:8080/api/v1/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Expected output:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

**What each header means:**
- `Access-Control-Allow-Origin: http://localhost:5173` ✅ Allows your frontend
- `Access-Control-Allow-Methods` ✅ Allows these HTTP methods
- `Access-Control-Allow-Credentials: true` ✅ Allows JWT tokens
- `Access-Control-Max-Age: 3600` ✅ Caches this for 1 hour

---

### **Phase 5: Test in Browser** (3 minutes)

#### **Method 1: Simple Test**

1. Open `http://localhost:5173` in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Paste this code:

```javascript
fetch('http://localhost:8080/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    role: 'JOB_SEEKER'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Success!', data))
.catch(err => console.error('❌ Error:', err))
```

5. Press Enter
6. Should see: ✅ Success! (or user already exists error)
7. ❌ Should NOT see CORS error

#### **Method 2: Full Registration Flow**

1. Go to `http://localhost:5173`
2. Click "Get Started"
3. Select "Job Seeker"
4. Enter email: `test@example.com`
5. Enter password: `password123`
6. Click "Create Account"
7. ✅ Should redirect to `/jobs` page
8. ❌ Should NOT see CORS error in console

#### **Method 3: Check Network Tab**

1. Open `http://localhost:5173`
2. Press F12 → Network tab
3. Click "Get Started"
4. Fill form and submit
5. Look for `register` request
6. Click on it
7. Check **Response Headers** section:
   - Should see: `access-control-allow-origin: http://localhost:5173`
   - Should see: `access-control-allow-credentials: true`

---

## 🔍 Debugging: If CORS Still Doesn't Work

### **Issue 1: Still Getting CORS Error**

**Check:**
```bash
# 1. Verify Docker is running
docker ps | grep careerconnect

# 2. Check if services restarted
docker logs api-gateway | grep CorsConfig

# 3. Force rebuild
docker-compose down -v
docker-compose up --build -d
```

**Fix:**
```bash
# Clean everything and rebuild
docker-compose down -v
cd backend && mvn clean install -DskipTests
cd ..
docker-compose up -d
```

---

### **Issue 2: Services Not Running**

**Check:**
```bash
# See Docker logs
docker logs api-gateway

# Check port conflicts
lsof -i :8080
lsof -i :8081
```

**Fix:**
```bash
# Kill conflicting processes
kill -9 $(lsof -ti:8080)
kill -9 $(lsof -ti:8081)

# Restart Docker
docker-compose restart
```

---

### **Issue 3: Frontend Still on Port 5173?**

**Check:**
```bash
# Verify frontend port
curl http://localhost:5173

# Should return HTML page
```

**Fix:**
```bash
cd frontend/career-connect-ui
npm run dev
```

---

### **Issue 4: Browser Cache Issues**

**Clear cache:**
```javascript
// In DevTools Console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

Or use hard refresh: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)

---

## ✅ Verification Checklist

Use this checklist to confirm everything is working:

- [ ] Backend rebuilt: `mvn clean install -DskipTests`
- [ ] Docker restarted: `docker-compose down && docker-compose up -d`
- [ ] API Gateway running: `curl http://localhost:8080/actuator/health` returns UP
- [ ] Auth Service running: `curl http://localhost:8081/actuator/health` returns UP
- [ ] Job Service running: `curl http://localhost:8082/actuator/health` returns UP
- [ ] CORS preflight works: OPTIONS request returns 200 with CORS headers
- [ ] Frontend runs: `http://localhost:5173` loads home page
- [ ] Registration works: Can fill form and submit without CORS error
- [ ] No errors in DevTools Console (F12)
- [ ] Network tab shows successful requests (green 200 status)

---

## 🎯 Expected Results

### **Before CORS Fix** ❌
```
Frontend tries: POST to http://localhost:8080/api/v1/auth/register
Browser blocks it with CORS error
User sees: "CORS policy error in console"
Application: Doesn't work
```

### **After CORS Fix** ✅
```
Frontend tries: POST to http://localhost:8080/api/v1/auth/register
Browser sends OPTIONS (preflight)
Backend responds: "Access-Control-Allow-Origin: http://localhost:5173"
Browser allows: Sends POST request
Backend responds: User registered successfully
User sees: Redirected to /jobs page
Application: Works perfectly!
```

---

## 📊 Request/Response Flow

```
Browser (5173)
    ↓
1. Sends OPTIONS (preflight)
    ↓
API Gateway (8080)
    ↓
2. Returns CORS headers
    ↓
Browser allows actual request
    ↓
3. Sends POST /auth/register
    ↓
Auth Service
    ↓
4. Processes and responds
    ↓
Frontend receives response
    ↓
5. User logged in ✅
```

---

## 🚀 Quick Test Command

Run this single command to test everything:

```bash
# Rebuild and restart
cd backend && mvn clean install -DskipTests && cd .. && \
docker-compose down && docker-compose up -d && \
echo "✅ Services restarting..." && sleep 10 && \
echo "✅ Testing CORS..." && \
curl -X OPTIONS http://localhost:8080/api/v1/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep "Access-Control-Allow-Origin"
```

If you see:
```
< Access-Control-Allow-Origin: http://localhost:5173
```

**✅ CORS is fixed!**

---

## 📝 Next Steps

1. ✅ Run the 5 phases above
2. ✅ Verify with the checklist
3. ✅ Test in browser with registration flow
4. ✅ Check DevTools console for errors
5. ✅ If working, celebrate! 🎉

---

## 💡 Pro Tips

**Tip 1: Keep DevTools Open While Testing**
- Press F12 while testing
- Watch Network tab for requests
- Watch Console for errors
- Much easier to debug

**Tip 2: Test Both Frontend and Backend**
- Test backend with curl
- Test frontend with browser
- Test together for integration

**Tip 3: Check Service Logs**
```bash
docker logs api-gateway --tail 50 -f
docker logs auth-service --tail 50 -f
```

---

**Ready to test?** Follow the 5 phases above! 🚀
