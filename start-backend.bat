@echo off
echo ==========================================
echo   ARTU SI SEN KARANGUE - Backend Server
echo ==========================================
echo.

cd /d "%~dp0..\backend"

echo Starting backend on port 5000...
echo.

node src/server.js

pause
