# Script de Test Supabase - Version Simple
# Ce script teste l'API sans arreter le backend

Write-Host ""
Write-Host "Test API Supabase" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

# Verifier le backend
Write-Host "1. Test du backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -ErrorAction Stop
    Write-Host "   [OK] Backend accessible" -ForegroundColor Green
} catch {
    Write-Host "   [ERREUR] Backend non accessible" -ForegroundColor Red
    Write-Host "   Demarrez le backend : node src/server.js" -ForegroundColor Gray
    exit 1
}

# Creer un utilisateur
Write-Host ""
Write-Host "2. Creation utilisateur..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "test.supabase.${timestamp}@artu.sn"

$userData = @{
    nom = "Test"
    prenom = "Supabase"
    telephone = "+221771234567"
    email = $email
    password = "Test123!"
    role = "citizen"
    username = "testsupabase${timestamp}"
    full_name = "Test Supabase"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $userData `
        -ErrorAction Stop
    
    Write-Host "   [OK] Utilisateur cree : $email" -ForegroundColor Green
} catch {
    Write-Host "   [ERREUR] Creation echouee : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Se connecter
Write-Host ""
Write-Host "3. Connexion..." -ForegroundColor Yellow

$loginData = @{
    email = $email
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData `
        -ErrorAction Stop
    
    # Le token est dans data.accessToken
    $token = $loginResponse.data.accessToken
    if (-not $token) {
        $token = $loginResponse.data.token
    }
    if (-not $token) {
        $token = $loginResponse.token
    }
    if (-not $token) {
        $token = $loginResponse.accessToken
    }
    
    Write-Host "   [OK] Connexion reussie" -ForegroundColor Green
} catch {
    Write-Host "   [ERREUR] Connexion echouee : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Recuperer le profil
Write-Host ""
Write-Host "4. Recuperation du profil..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profile = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/me" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "   [OK] Profil recupere" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Informations :" -ForegroundColor White
    Write-Host "     - ID: $($profile.id)" -ForegroundColor Gray
    Write-Host "     - Email: $($profile.email)" -ForegroundColor Gray
    Write-Host "     - Role: $($profile.role)" -ForegroundColor Gray
    Write-Host "     - Actif: $($profile.is_active)" -ForegroundColor Gray
    
} catch {
    Write-Host "   [ERREUR] Profil non recupere : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TOUS LES TESTS REUSSIS !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[OK] Supabase fonctionne parfaitement" -ForegroundColor Green
Write-Host ""
