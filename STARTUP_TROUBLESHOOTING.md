# 🔧 Startup Troubleshooting Guide

Common issues you might face and how to fix them.

---

## ❌ Issue 1: Maven Build Fails with "Command not found"

**Error:**
```
'mvn' is not recognized as an internal or external command
```

**Cause:** Maven is not installed or not in PATH

**Fix:**

### Option 1: Install Maven (Windows)
```bash
# Using Chocolatey
choco install maven

# Then restart terminal and try again
mvn -version
```

### Option 2: Install Maven (Mac)
```bash
# Using Homebrew
brew install maven

# Verify
mvn -version
```

### Option 3: Install Maven (Linux)
```bash
sudo apt update
sudo apt install maven

# Verify
mvn -version
```

### Option 4: Add to PATH manually
1. Download Maven from https://maven.apache.org/download.cgi
2. Extract it
3. Add bin folder to Windows PATH
4. Restart terminal

---

## ❌ Issue 2: Java Version Error

**Error:**
```
[ERROR] COMPILATION ERROR
[ERROR] Source option 11 is no longer supported. Use 12 or later.
```

**Cause:** Java version too old (need Java 11+)

**Fix:**
```bash
# Check current Java version
java -version

# Should show: openjdk version "11" or higher

# If too old, download and install Java 11+
# https://www.oracle.com/java/technologies/downloads/

# Or using package manager:
# Windows: choco install openjdk
# Mac: brew install openjdk
# Linux: sudo apt install openjdk-11-jdk
```

---

## ❌ Issue 3: Docker Containers Won't Start

**Error:**
```
docker: command not found
or
Cannot connect to Docker daemon
```

**Cause:** Docker not installed or not running

**Fix:**

### Windows/Mac:
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Verify: `docker ps`

### Linux:
```bash
sudo apt install docker.io docker-compose
sudo service docker start
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker ps
```

---

## ❌ Issue 4: Port Already in Use

**Error:**
```
ERROR: for api-gateway Cannot start service api-gateway: bind: 
address already in use
```

**Cause:** Another process is using port 8080 (or other services)

**Fix:**

### Windows:
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Example:
taskkill /PID 5432 /F

# Then restart
docker-compose up -d
```

### Mac/Linux:
```bash
# Find process
lsof -i :8080

# Kill it
kill -9 <PID>

# Then restart
docker-compose up -d
```

---

## ❌ Issue 5: Build Success but Docker Won't Run Services

**Error:**
```
Cannot find image careerconnect/api-gateway
```

**Cause:** Docker images weren't built

**Fix:**
```bash
# Rebuild with Docker build
cd backend
mvn clean install -DskipTests

# Make sure it says "Building careerconnect/..." at the end

# Then try again
cd ..
docker-compose up -d
```

---

## ❌ Issue 6: CORS Error in Browser

**Error:**
```
Access to fetch at 'http://localhost:8080/api/v1/auth/register' 
blocked by CORS policy
```

**Cause:** Backend CORS not configured (already fixed in this project)

**Fix:**
```bash
# Make sure CORS config files exist
ls backend/auth-service/src/main/java/com/careerconnect/auth/config/CorsConfig.java

# If missing, rebuild
cd backend
mvn clean install -DskipTests
cd ..

# Restart services
docker-compose down
docker-compose up -d
```

---

## ❌ Issue 7: Frontend npm install Fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency
```

**Cause:** Node version mismatch

**Fix:**
```bash
# Check Node version (need 16+)
node -v

# Update Node if needed
# Windows: https://nodejs.org/
# Mac: brew install node
# Linux: sudo apt install nodejs

# Clear npm cache
npm cache clean --force

# Delete old files
cd frontend/career-connect-ui
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start
npm run dev
```

---

## ❌ Issue 8: Frontend Won't Start on Port 5173

**Error:**
```
Port 5173 is in use by another process
```

**Cause:** Another app using the port

**Fix:**

### Windows:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Mac/Linux:
```bash
lsof -i :5173
kill -9 <PID>
```

### Or use different port:
```bash
npm run dev -- --port 3000
```

---

## ❌ Issue 9: Services Start but Show Error Status

**Error:**
```
docker ps shows services with Exit Code 1
```

**Cause:** Java service crashed

**Fix:**
```bash
# Check logs
docker logs auth-service

# Look for errors in the output

# Rebuild and restart
cd backend
mvn clean install -DskipTests
cd ..
docker-compose down -v
docker-compose up -d
```

---

## ❌ Issue 10: Database Connection Fails

**Error:**
```
[ERROR] Could not connect to database
[ERROR] Connection refused
```

**Cause:** PostgreSQL container not running

**Fix:**
```bash
# Check if Postgres is running
docker ps | grep postgres

# If not running, restart all
docker-compose down
docker-compose up -d

# Wait 30 seconds
sleep 30

# Check again
docker ps
```

---

## ❌ Issue 11: Register Works but Login Fails

**Error:**
```
Invalid email or password
```

**Cause:** Account wasn't actually created (check backend logs)

**Fix:**
```bash
# Check auth service logs
docker logs auth-service

# Make sure there are no errors

# Try registering again with different email
# Use: newuser@example.com

# Check for database issues
docker logs postgres
```

---

## ❌ Issue 12: Frontend Shows Blank Page

**Error:**
```
White screen with no errors
```

**Cause:** JavaScript error or React issue

**Fix:**
```bash
# Open DevTools (F12)
# Check Console tab for errors

# Restart frontend
# In frontend terminal: Ctrl+C
cd frontend/career-connect-ui
npm run dev

# Or hard reload browser
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

---

## ❌ Issue 13: Git Clone Issues

**Error:**
```
Permission denied (publickey)
```

**Cause:** SSH key not set up

**Fix:**
```bash
# Use HTTPS instead of SSH
# Or generate SSH key
ssh-keygen -t ed25519
# Add to GitHub settings

# Then try again
git clone <repo>
```

---

## ✅ Quick Diagnostic Commands

Use these to diagnose issues:

```bash
# Check all Docker containers
docker ps -a

# Check Docker logs for specific service
docker logs api-gateway
docker logs auth-service

# Check if ports are open
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # Mac/Linux

# Check Java version
java -version

# Check Maven version
mvn -version

# Check Node version
node -v
npm -v

# Test API Gateway
curl http://localhost:8080/actuator/health

# Test Auth Service
curl http://localhost:8081/actuator/health

# Test Frontend
curl http://localhost:5173
```

---

## 🔄 Nuclear Option (Start Fresh)

If everything is broken, do a complete restart:

```bash
# Kill everything
docker-compose down -v
npm cache clean --force

# Remove old files
cd backend
rm -rf target
cd ../frontend/career-connect-ui
rm -rf node_modules package-lock.json

# Start fresh
cd ../..
cd backend
mvn clean install -DskipTests

cd ..
docker-compose up -d
sleep 20

cd frontend/career-connect-ui
npm install
npm run dev
```

---

## 📊 Debug Checklist

Go through this when something is wrong:

- [ ] Is Docker Desktop running? (Windows/Mac)
- [ ] Are all containers running? (`docker ps`)
- [ ] Any port conflicts? (`netstat -ano | findstr :8080`)
- [ ] Is Java installed? (`java -version`)
- [ ] Is Maven installed? (`mvn -version`)
- [ ] Is Node.js installed? (`node -v`)
- [ ] Did Maven build succeed? (look for BUILD SUCCESS)
- [ ] Are services up for 30+ seconds?
- [ ] Is frontend running on 5173?
- [ ] Are there CORS errors? (F12 Console)
- [ ] Is database running? (`docker logs postgres`)

---

## 💡 Pro Tips

1. **Always read error messages** - They tell you what's wrong
2. **Check logs first** - `docker logs service-name` is your friend
3. **Wait for services** - Takes 15-30 seconds to fully start
4. **Clear cache** - npm and Docker caches cause issues
5. **Use DevTools** - Press F12 to see frontend errors
6. **Restart Docker** - Often fixes mysterious issues
7. **One step at a time** - Don't run multiple commands at once
8. **Keep terminals open** - Shows you when things fail

---

## 🆘 Still Stuck?

1. **Check all logs:**
   ```bash
   docker logs api-gateway
   docker logs auth-service
   ```

2. **Verify connectivity:**
   ```bash
   curl http://localhost:8080/actuator/health
   curl http://localhost:5173
   ```

3. **Check ports:**
   ```bash
   netstat -ano | grep LISTENING
   ```

4. **Try nuclear restart:**
   ```bash
   docker-compose down -v && docker-compose up -d
   ```

5. **Restart everything:**
   - Close frontend terminal (Ctrl+C)
   - Restart Docker Desktop
   - Rebuild and restart

---

**Still having issues?** Check these guides:
- `COMPLETE_STARTUP_GUIDE.md`
- `CORS_FIX_GUIDE.md`
- `QUICK_STARTUP.md`
