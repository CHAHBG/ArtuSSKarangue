# Script pour Démarrer et Monitorer le Development Build
# Usage: .\start-dev-with-logs.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ARTU SI SEN KARANGUE - Dev Monitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier ADB
Write-Host "[1/5] Verification ADB..." -ForegroundColor Yellow
$device = adb devices | Select-String "device$"
if ($device) {
    Write-Host "OK - Device connected: $device" -ForegroundColor Green
} else {
    Write-Host "ERREUR - No device connected" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Configurer ADB Reverse
Write-Host "[2/5] Configuration ADB Reverse..." -ForegroundColor Yellow
adb reverse tcp:5000 tcp:5000
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Port 5000 redirected" -ForegroundColor Green
} else {
    Write-Host "ERREUR - ADB reverse failed" -ForegroundColor Red
}
Write-Host ""

# 3. Vérifier Backend
Write-Host "[3/5] Verification Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "OK - Backend running on port 5000" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - Backend not running!" -ForegroundColor Red
    Write-Host "Start backend with: cd backend; node src/server.js" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 4. Nettoyer et Préparer Logcat
Write-Host "[4/5] Preparation logs..." -ForegroundColor Yellow
adb logcat -c
Write-Host "OK - Logcat cleared" -ForegroundColor Green
Write-Host ""

# 5. Lancer l'App et Afficher les Logs
Write-Host "[5/5] Lancement de l'app..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LOGS EN TEMPS REEL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Trouver le package de l'app
$package = "host.exp.exponent"  # Development build package

# Lancer l'app
adb shell monkey -p $package -c android.intent.category.LAUNCHER 1 2>&1 | Out-Null

Write-Host "App lancee! Logs ci-dessous:" -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arreter" -ForegroundColor Yellow
Write-Host ""

# Afficher les logs filtrés
adb logcat | Select-String "ReactNativeJS|Expo|Error|artu|API|Auth"
