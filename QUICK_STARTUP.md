# ⚡ Super Quick Start - 5 Commands to Run Everything

Copy and paste these commands one by one. Wait for each to complete before the next.

---

## 🎯 Command 1: Build Backend

```bash
cd C:/Users/Deepatharshan/CareerConnect_AI/backend
mvn clean install -DskipTests
```

**Wait for:** `BUILD SUCCESS` message

---

## 🎯 Command 2: Start Docker Services

```bash
cd ..
docker-compose down
docker-compose up -d
```

**Wait for:** 15-20 seconds for all services to start

---

## 🎯 Command 3: Verify Services Running

```bash
docker ps
```

**Check:** Should see 8 containers with "Up" status

---

## 🎯 Command 4: Start Frontend (in NEW terminal)

```bash
cd frontend/career-connect-ui
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173`

---

## 🎯 Command 5: Open in Browser

```
http://localhost:5173
```

**You should see:** Home page with "Get Started" button

---

## ✅ Done! Your App is Running!

Test it:
1. Click "Get Started"
2. Select "Job Seeker"
3. Enter email & password
4. Click "Create Account"
5. ✅ Should redirect to Job Feed

---

## 🆘 If Something Goes Wrong

**Backend won't build?**
```bash
# Make sure you're in backend folder
cd C:/Users/Deepatharshan/CareerConnect_AI/backend

# Check Maven is installed
mvn -version

# Try building again
mvn clean install -DskipTests
```

**Docker containers not running?**
```bash
# Make sure Docker Desktop is open (Windows/Mac)
# Check running containers
docker ps

# If empty, restart
docker-compose up -d

# View logs if stuck
docker logs api-gateway
```

**Frontend won't start?**
```bash
# Make sure you're in frontend folder
cd C:/Users/Deepatharshan/CareerConnect_AI/frontend/career-connect-ui

# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start
npm run dev
```

**CORS error in browser?**
```bash
# Rebuild and restart
cd C:/Users/Deepatharshan/CareerConnect_AI/backend
mvn clean install -DskipTests
cd ..
docker-compose restart
```

---

## 🎯 Service Ports Reference

| What | Port | URL |
|------|------|-----|
| Frontend (React) | 5173 | http://localhost:5173 |
| Backend (API) | 8080 | http://localhost:8080 |
| Service Discovery | 8761 | http://localhost:8761 |

---

**That's it!** Total time: ~10 minutes 🚀
