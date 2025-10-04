@echo off
echo ==========================================
echo   LOGS DEVELOPMENT BUILD - LIVE
echo ==========================================
echo.

REM Lancer les logs React Native
echo Monitoring React Native logs...
echo Press Ctrl+C to stop
echo.

adb logcat ReactNativeJS:V ReactNative:V *:S

pause
