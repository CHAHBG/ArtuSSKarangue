# Build APK avec URL Railway Production
# Ce script build l'APK qui utilisera automatiquement l'URL Railway

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📦 BUILD APK - URL Railway Production" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "✅ URL Production configurée :" -ForegroundColor Green
Write-Host "   https://artusskarangue-production.up.railway.app/api/v1`n" -ForegroundColor Cyan

Write-Host "📝 Vérification configuration..." -ForegroundColor Yellow
$apiConfig = Get-Content "src\config\api.js" -Raw
if ($apiConfig -match "artusskarangue-production\.up\.railway\.app") {
    Write-Host "   ✅ URL Railway correctement configurée`n" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  URL Railway non trouvée dans api.js" -ForegroundColor Red
    Write-Host "   Vérifiez src/config/api.js`n" -ForegroundColor Yellow
}

Write-Host "🔨 Choix du type de build :`n" -ForegroundColor Yellow
Write-Host "1. Debug APK    (rapide, ~5 min, pour test)" -ForegroundColor White
Write-Host "2. Release APK  (optimisé, ~10 min, pour production)" -ForegroundColor White
Write-Host "3. Annuler`n" -ForegroundColor Gray

$choice = Read-Host "Votre choix (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "`n📱 Build Debug APK..." -ForegroundColor Cyan
        Write-Host "⏳ Temps estimé : 5-10 minutes`n" -ForegroundColor Yellow
        
        cd android
        .\gradlew assembleDebug
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ BUILD RÉUSSI !`n" -ForegroundColor Green
            Write-Host "📦 APK : android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
            Write-Host "`n📲 Installation :" -ForegroundColor Yellow
            Write-Host "   1. Copiez l'APK sur votre téléphone" -ForegroundColor Gray
            Write-Host "   2. Installez l'APK" -ForegroundColor Gray
            Write-Host "   3. Testez avec 4G activé (pas WiFi)`n" -ForegroundColor Gray
            
            # Ouvrir le dossier de l'APK
            explorer "app\build\outputs\apk\debug"
        } else {
            Write-Host "`n❌ BUILD ÉCHOUÉ" -ForegroundColor Red
            Write-Host "Vérifiez les logs ci-dessus`n" -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host "`n📱 Build Release APK..." -ForegroundColor Cyan
        Write-Host "⏳ Temps estimé : 10-15 minutes`n" -ForegroundColor Yellow
        
        cd android
        .\gradlew assembleRelease
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ BUILD RÉUSSI !`n" -ForegroundColor Green
            Write-Host "📦 APK : android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
            Write-Host "`n📲 Installation :" -ForegroundColor Yellow
            Write-Host "   1. Copiez l'APK sur votre téléphone" -ForegroundColor Gray
            Write-Host "   2. Installez l'APK" -ForegroundColor Gray
            Write-Host "   3. Testez avec 4G activé (pas WiFi)`n" -ForegroundColor Gray
            
            # Ouvrir le dossier de l'APK
            explorer "app\build\outputs\apk\release"
        } else {
            Write-Host "`n❌ BUILD ÉCHOUÉ" -ForegroundColor Red
            Write-Host "Vérifiez les logs ci-dessus`n" -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host "`n🚫 Build annulé`n" -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "`n❌ Choix invalide`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 Pour tester l'app :" -ForegroundColor Yellow
Write-Host "   1. Installer l'APK sur votre téléphone" -ForegroundColor Gray
Write-Host "   2. Activer 4G (désactiver WiFi)" -ForegroundColor Gray
Write-Host "   3. Créer un compte depuis l'app" -ForegroundColor Gray
Write-Host "   4. Vérifier que ça communique avec Railway`n" -ForegroundColor Gray
