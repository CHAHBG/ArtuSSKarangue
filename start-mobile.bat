@echo off
echo ==========================================
echo   ARTU SI SEN KARANGUE - Mobile App
echo ==========================================
echo.

cd /d "%~dp0mobile"

echo Starting Expo development server...
echo.
echo Make sure backend is running first!
echo (Run start-backend.bat in another terminal)
echo.

npm start

pause
