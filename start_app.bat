@echo off
title Food Ordering System (Swiggy / Zomato Clone)
echo ========================================================
echo   Food Ordering System - Full Stack Application
echo   Frontend : React (Production UI)
echo   Backend  : Node.js + Express
echo   Database : Persistent SQLite / MongoDB
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Waiting for server to initialize, then opening browser...
start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000/"

echo [2/2] Starting Node.js backend server...
echo.
echo   * React Web UI:      http://localhost:5000/
echo   * API Directory:     http://localhost:5000/api
echo   * Food Menu API:     http://localhost:5000/api/foods
echo   * Orders History:    http://localhost:5000/api/orders
echo.
echo Server is live! Keep this window open. Press Ctrl+C to stop.
echo.
node backend/server.js
pause
