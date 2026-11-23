@echo off
echo ========================================================
echo   Starting Food Ordering System in Development Mode
echo ========================================================
echo.
cd /d "%~dp0"
start "Backend Server (Port 5000)" cmd /k "cd backend && node --watch server.js"
start "Frontend Vite (Port 3000)" cmd /k "cd frontend && npm.cmd run dev"
echo Backend and Frontend dev servers launched!
echo Frontend will be live on http://localhost:3000
echo Backend API will be live on http://localhost:5000
