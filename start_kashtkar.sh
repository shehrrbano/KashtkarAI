#!/bin/bash

echo "🌟 Starting Kashtkar.ai Application"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run the backend."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python to run the frontend server."
    exit 1
fi

echo "✅ Dependencies check passed"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down Kashtkar.ai servers..."
    kill 0
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

echo ""
echo "🚀 Starting Backend Server (Port 8080)..."
cd backend && npm start &
BACKEND_PID=$!

echo "✅ Backend server started (PID: $BACKEND_PID)"

echo ""
echo "🚀 Starting Frontend Server (Port 8081)..."
python -m http.server 8081 &
FRONTEND_PID=$!

echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Kashtkar.ai is now running!"
echo "=============================="
echo "📱 Frontend (Login):    http://localhost:8081/login.html"
echo "📱 Frontend (Signup):   http://localhost:8081/signup.html"
echo "📱 Main Dashboard:     http://localhost:8081/frontend.html"
echo "🔧 Backend API:        http://localhost:8080/api/status"
echo ""
echo "🌐 Access the application at: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait