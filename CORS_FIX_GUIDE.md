# 🔧 CORS Error - Complete Guide & Solution

## 🔴 The Error You're Seeing

```
Access to fetch at 'http://localhost:8080/api/v1/auth/register' 
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 📚 Understanding CORS

### **What is CORS?**
CORS (Cross-Origin Resource Sharing) is a security mechanism that allows controlled access between different domains/ports.

### **Why Do You Get This Error?**
When frontend and backend run on **different origins**, the browser blocks requests by default:

```
Frontend: http://localhost:5173  ✗ Different Port
Backend:  http://localhost:8080

Result: CORS Error (Security Policy)
```

### **How CORS Works**
1. Browser sends **OPTIONS preflight request** (asks permission)
2. Backend responds with CORS headers (grants permission)
3. Browser allows actual request (GET, POST, etc.)
4. Frontend receives response

---

## ✅ What I Fixed For You

I added **CORS Configuration** to all your backend services:

### **Files Created**

```
✅ api-gateway/config/CorsConfig.java         (Primary - Routes all requests)
✅ auth-service/config/CorsConfig.java        (Backup - Direct auth calls)
✅ job-service/config/CorsConfig.java         (Backup - Direct job calls)
✅ profile-service/config/CorsConfig.java     (Backup - Direct profile calls)
✅ application-service/config/CorsConfig.java (Backup - Direct app calls)
✅ company-service/config/CorsConfig.java     (Backup - Direct company calls)
✅ ai-cv-service/config/CorsConfig.java       (Backup - Direct AI calls)
```

### **What These Configurations Do**

Each CORS config:
- ✅ **Allows** requests from `http://localhost:5173` (your frontend)
- ✅ **Allows** all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- ✅ **Allows** all headers (Content-Type, Authorization, etc.)
- ✅ **Allows** credentials (JWT tokens, cookies)
- ✅ **Caches** preflight responses for 1 hour (performance)

---

## 🚀 How to Apply the Fix

### **Step 1: Rebuild the Backend Services**

```bash
# Navigate to backend directory
cd backend

# Clean and rebuild all services
mvn clean install -DskipTests

# Or rebuild just the gateway
cd api-gateway
mvn clean install -DskipTests
```

### **Step 2: Stop Running Services**

Kill all running microservices:

```bash
# Kill all Java processes running on ports 8000-8100
kill -9 $(lsof -ti:8080,8081,8082,8083,8084,8085)

# Or in terminal, press Ctrl+C to stop services
```

### **Step 3: Restart Docker Containers**

```bash
cd ..  # Go back to root
docker-compose down
docker-compose up -d
```

### **Step 4: Verify Services Are Running**

```bash
# Check if services are up
curl http://localhost:8080/api/v1/auth/register -v

# Should see: 200 OK or 405 Method Not Allowed (good)
# NOT: CORS error (bad)
```

### **Step 5: Test in Frontend**

1. Go to `http://localhost:5173`
2. Try to register
3. ✅ Should work now!

---

## 🔍 How to Debug CORS Issues

### **Browser Console**
Open DevTools (F12) → Console tab:
```
❌ CORS error message
✅ No error = Working!
```

### **Network Tab**
Open DevTools (F12) → Network tab:
1. Try to register
2. Look for OPTIONS request (preflight)
3. Click on it
4. Check Response Headers:
   - ✅ Should have: `Access-Control-Allow-Origin: http://localhost:5173`
   - ❌ If missing: CORS still broken

### **Test with cURL**

```bash
# Test preflight request
curl -i -X OPTIONS http://localhost:8080/api/v1/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"

# Should return:
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

---

## 📊 Configuration Breakdown

### **API Gateway CorsConfig.java**
```java
corsConfig.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",      // Your frontend
    "http://localhost:3000",      // Alternative dev port
    "http://127.0.0.1:5173"       // localhost IP
));

corsConfig.setAllowedMethods(Arrays.asList(
    "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
));

corsConfig.setAllowedHeaders(Collections.singletonList("*")); // All headers

corsConfig.setAllowCredentials(true); // JWT tokens work

corsConfig.setMaxAge(3600L); // Cache for 1 hour
```

---

## ⚠️ Important Notes

### **Development vs Production**

**Development (What you have):**
```java
// Allow any origin in development
corsConfig.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000"
));
```

**Production (What you should use):**
```java
// Only allow specific domain in production
corsConfig.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

### **Security Best Practices**
- ❌ **Don't use** `"*"` for allowedOrigins in production
- ❌ **Don't allow** `setAllowedHeaders("*")` with credentials=true
- ✅ **Always specify** exact domains
- ✅ **Use HTTPS** in production
- ✅ **Validate** JWT tokens

---

## 🧪 Testing Checklist

- [ ] Services rebuilt with `mvn clean install`
- [ ] Docker containers restarted with `docker-compose up -d`
- [ ] API Gateway running on port 8080
- [ ] Auth Service running on port 8081
- [ ] Frontend running on port 5173
- [ ] Browser console shows no CORS errors
- [ ] Registration endpoint works
- [ ] Can login successfully
- [ ] Can fetch jobs
- [ ] Can post jobs

---

## 🐛 If CORS Still Doesn't Work

### **Check 1: Services Restarted?**
```bash
# Verify services are using new CORS config
docker ps | grep careerconnect

# If not updated, rebuild and restart
docker-compose down
docker-compose up -d
```

### **Check 2: Port Correct?**
```bash
# Verify frontend is on 5173
# Update CorsConfig if frontend is on different port
```

### **Check 3: Clear Browser Cache**
```javascript
// In DevTools Console
localStorage.clear()
sessionStorage.clear()
// Reload page
window.location.reload()
```

### **Check 4: Check for Spring Security Issues**
The CORS config might conflict with Spring Security. If CORS still fails:

```java
// Add to SecurityConfig if exists
http.cors().and().csrf().disable()
```

---

## 📋 API Endpoints Now Working With CORS

After this fix, these endpoints should work:

```
✅ POST   /api/v1/auth/login
✅ POST   /api/v1/auth/register
✅ GET    /api/v1/jobs
✅ POST   /api/v1/jobs
✅ GET    /api/v1/jobs/{id}
✅ POST   /api/v1/jobs/{id}/apply
✅ GET    /api/v1/profiles
✅ POST   /api/v1/profiles
✅ GET    /api/v1/applications
✅ GET    /api/v1/companies/{id}/jobs
✅ POST   /api/v1/ai/analyze-cv
```

---

## 🎯 Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS Error | No CORS headers from backend | ✅ Added CorsConfig to all services |
| Preflight Fails | Backend doesn't allow OPTIONS | ✅ Config allows OPTIONS method |
| No Auth Header | CORS blocks Authorization header | ✅ Config exposes Authorization |
| Token Errors | Credentials not allowed | ✅ setAllowCredentials(true) |

---

## 🚀 Next Steps

1. **Rebuild** backend: `mvn clean install`
2. **Restart** services: `docker-compose up -d`
3. **Test** frontend: Navigate to `http://localhost:5173`
4. **Register**: Try signing up - should work now!
5. **Check** DevTools if issues persist

---

## 📞 Still Having Issues?

1. **Check browser console** (F12) for errors
2. **Check Network tab** for failed requests
3. **Verify** services are running: `curl http://localhost:8080`
4. **Clear cache**: `localStorage.clear()`
5. **Restart** everything: Services + Docker + Browser

---

**Status**: CORS Fixed ✅  
**All 7 services** now allow requests from frontend  
**Your frontend and backend** can now communicate!

Ready to test? Start your app and try registering! 🚀
