@echo off
echo 🌟 Starting Kashtkar.ai Application
echo ==================================
echo.

echo 🔍 Checking dependencies...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js to run the backend.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python to run the frontend server.
    pause
    exit /b 1
)

echo ✅ Dependencies check passed
echo.

echo 🚀 Starting Backend Server (Port 8080)...
start /B cmd /k "cd backend && npm start"
set BACKEND_PID=%errorlevel%

echo ✅ Backend server started
echo.

echo 🚀 Starting Frontend Server (Port 8081)...
start /B python -m http.server 8081
set FRONTEND_PID=%errorlevel%

echo ✅ Frontend server started
echo.

echo 🎉 Kashtkar.ai is now running!
echo ==============================
echo 📱 Frontend (Login):    http://localhost:8081/login.html
echo 📱 Frontend (Signup):   http://localhost:8081/signup.html
echo 📱 Main Dashboard:     http://localhost:8081/frontend.html
echo 🔧 Backend API:        http://localhost:8080/api/status
echo.
echo 🌐 Access the application at: http://localhost:8081
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo 🛑 Shutting down Kashtkar.ai servers...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
echo ✅ All servers stopped