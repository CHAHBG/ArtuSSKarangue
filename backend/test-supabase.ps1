# Script de Test Supabase
# Teste la connexion a Supabase et cree un utilisateur test

Write-Host ""
Write-Host "Test de Connexion Supabase" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Verifier que le backend est demarre
Write-Host "Verification du serveur backend..." -ForegroundColor Yellow

$backend = $null
try {
    $backend = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -ErrorAction Stop
    Write-Host "[OK] Backend en ligne" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Backend non accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Demarrez d'abord le backend :" -ForegroundColor White
    Write-Host "  cd backend" -ForegroundColor Gray
    Write-Host "  node src/server.js" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Test 1 : Creation d'un utilisateur" -ForegroundColor Yellow
Write-Host ""

# Donnees de test - Utiliser un email unique base sur timestamp
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testUser = @{
    nom = "Test"
    prenom = "Supabase"
    telephone = "+221771234567"
    email = "test.supabase.${timestamp}@artu.sn"
    password = "Test123!"
    role = "citizen"
    username = "testsupabase${timestamp}"
    full_name = "Test Supabase"
}

Write-Host "Creation de l'utilisateur : $($testUser.email)" -ForegroundColor White

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body ($testUser | ConvertTo-Json) `
        -ErrorAction Stop
    
    Write-Host "[OK] Utilisateur cree avec succes !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Details :" -ForegroundColor White
    Write-Host "  ID: $($response.user.id)" -ForegroundColor Gray
    Write-Host "  Nom: $($response.user.nom) $($response.user.prenom)" -ForegroundColor Gray
    Write-Host "  Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "  Telephone: $($response.user.telephone)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -like "*already exists*" -or $errorMessage -like "*duplicate*") {
        Write-Host "[INFO] Utilisateur existe deja (normal si vous avez deja teste)" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "[ERREUR] Erreur lors de la creation : $errorMessage" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}

Write-Host "Test 2 : Connexion de l'utilisateur" -ForegroundColor Yellow
Write-Host ""

$loginData = @{
    email = $testUser.email
    password = $testUser.password
}

Write-Host "Connexion avec : $($loginData.email)" -ForegroundColor White

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body ($loginData | ConvertTo-Json) `
        -ErrorAction Stop
    
    Write-Host "[OK] Connexion reussie !" -ForegroundColor Green
    Write-Host ""
    
    # Extraire le token (peut etre dans token ou accessToken)
    $token = $null
    if ($loginResponse.token) {
        $token = $loginResponse.token
        $tokenPreview = $token.Substring(0, [Math]::Min(20, $token.Length))
        Write-Host "Token recu : ${tokenPreview}..." -ForegroundColor Gray
    } elseif ($loginResponse.accessToken) {
        $token = $loginResponse.accessToken
        $tokenPreview = $token.Substring(0, [Math]::Min(20, $token.Length))
        Write-Host "Token recu : ${tokenPreview}..." -ForegroundColor Gray
    } else {
        Write-Host "Token recu : [OK]" -ForegroundColor Gray
    }
    Write-Host ""
    
} catch {
    Write-Host "[ERREUR] Erreur de connexion : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Test 3 : Recuperation du profil" -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profile = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/me" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "[OK] Profil recupere !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Informations du profil :" -ForegroundColor White
    Write-Host "  ID: $($profile.id)" -ForegroundColor Gray
    Write-Host "  Nom: $($profile.nom) $($profile.prenom)" -ForegroundColor Gray
    Write-Host "  Email: $($profile.email)" -ForegroundColor Gray
    Write-Host "  Telephone: $($profile.telephone)" -ForegroundColor Gray
    Write-Host "  Role: $($profile.role)" -ForegroundColor Gray
    Write-Host "  Actif: $($profile.is_active)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "[ERREUR] Erreur : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "TOUS LES TESTS REUSSIS !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[OK] Supabase est correctement connecte" -ForegroundColor Green
Write-Host "[OK] L'API fonctionne" -ForegroundColor Green
Write-Host "[OK] Les tables sont accessibles" -ForegroundColor Green
Write-Host ""

Write-Host "Verifier dans Supabase Dashboard :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Allez sur https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Selectionnez votre projet" -ForegroundColor White
Write-Host "3. Table Editor -> Table 'utilisateurs'" -ForegroundColor White
Write-Host "4. Vous devriez voir votre utilisateur test !" -ForegroundColor White
Write-Host ""

Write-Host "Credentials de test :" -ForegroundColor Cyan
Write-Host "  Email: $($testUser.email)" -ForegroundColor Gray
Write-Host "  Password: $($testUser.password)" -ForegroundColor Gray
Write-Host ""
