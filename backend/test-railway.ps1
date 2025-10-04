# Script de test pour l'API Railway
# Remplacez l'URL par votre URL Railway

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayUrl
)

Write-Host ""
Write-Host "Test API Railway" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL testee : $RailwayUrl" -ForegroundColor Gray
Write-Host ""

# Nettoyer l'URL (enlever le / final)
$RailwayUrl = $RailwayUrl.TrimEnd('/')

# Test 1 : Health Check
Write-Host "1. Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$RailwayUrl/health" -Method GET -ErrorAction Stop
    Write-Host "   [OK] API accessible" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERREUR] API non accessible" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2 : Register
Write-Host ""
Write-Host "2. Test Register..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testUser = @{
    nom = "Test"
    prenom = "Railway"
    telephone = "+221771234567"
    email = "test.railway.$timestamp@artu.sn"
    password = "Test123!"
    role = "citizen"
    username = "testrailway$timestamp"
    full_name = "Test Railway"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod `
        -Uri "$RailwayUrl/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testUser `
        -ErrorAction Stop
    
    Write-Host "   [OK] Utilisateur cree" -ForegroundColor Green
    Write-Host "   Email: test.railway.$timestamp@artu.sn" -ForegroundColor Gray
} catch {
    Write-Host "   [ERREUR] Creation echouee" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3 : Login
Write-Host ""
Write-Host "3. Test Login..." -ForegroundColor Yellow

$loginData = @{
    email = "test.railway.$timestamp@artu.sn"
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "$RailwayUrl/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData `
        -ErrorAction Stop
    
    $token = $loginResponse.data.accessToken
    Write-Host "   [OK] Connexion reussie" -ForegroundColor Green
} catch {
    Write-Host "   [ERREUR] Connexion echouee" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4 : Get Profile
Write-Host ""
Write-Host "4. Test Get Profile..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profile = Invoke-RestMethod `
        -Uri "$RailwayUrl/api/v1/auth/me" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "   [OK] Profil recupere" -ForegroundColor Green
    Write-Host "   Email: $($profile.data.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($profile.data.user.role)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERREUR] Erreur profil" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TOUS LES TESTS REUSSIS !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[OK] Votre API Railway fonctionne parfaitement" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine etape :" -ForegroundColor Yellow
Write-Host "  1. Mettre a jour mobile/src/config/api.js avec :" -ForegroundColor White
Write-Host "     const API_URL = '$RailwayUrl/api/v1';" -ForegroundColor Gray
Write-Host "  2. Rebuild l'app mobile" -ForegroundColor White
Write-Host ""
