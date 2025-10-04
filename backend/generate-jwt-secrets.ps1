# Script de generation de secrets JWT
# Genere des secrets cryptographiquement forts pour JWT

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GENERATION DE SECRETS JWT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generer JWT_SECRET (64 caracteres alphanumeriques)
Write-Host "Generation de JWT_SECRET..." -ForegroundColor Yellow
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
Write-Host "[OK] JWT_SECRET genere" -ForegroundColor Green

# Generer JWT_REFRESH_SECRET (64 caracteres alphanumeriques)
Write-Host "Generation de JWT_REFRESH_SECRET..." -ForegroundColor Yellow
$jwtRefreshSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
Write-Host "[OK] JWT_REFRESH_SECRET genere" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SECRETS GENERES AVEC SUCCES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Copiez ces variables dans Railway Dashboard -> Variables :" -ForegroundColor Cyan
Write-Host ""

Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "JWT_EXPIRES_IN=1h" -ForegroundColor Gray
Write-Host "JWT_REFRESH_SECRET=$jwtRefreshSecret" -ForegroundColor White
Write-Host "JWT_REFRESH_EXPIRES_IN=7d" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Option : Sauvegarder dans un fichier
$save = Read-Host "Voulez-vous sauvegarder dans un fichier .env.secrets ? (o/n)"
if ($save -eq "o" -or $save -eq "O") {
    $envContent = @"
# Secrets JWT generes le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# NE PAS COMMITER CE FICHIER !

JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=$jwtRefreshSecret
JWT_REFRESH_EXPIRES_IN=7d
"@
    
    $envContent | Out-File -FilePath ".env.secrets" -Encoding UTF8
    Write-Host ""
    Write-Host "[OK] Secrets sauvegardes dans .env.secrets" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT :" -ForegroundColor Red
    Write-Host "  - Ne PAS commiter ce fichier sur GitHub !" -ForegroundColor Yellow
    Write-Host "  - Ajouter .env.secrets dans .gitignore" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "  1. Copier les variables ci-dessus" -ForegroundColor White
Write-Host "  2. Aller sur Railway Dashboard" -ForegroundColor White
Write-Host "  3. Cliquer sur votre service backend" -ForegroundColor White
Write-Host "  4. Onglet 'Variables'" -ForegroundColor White
Write-Host "  5. Coller les variables" -ForegroundColor White
Write-Host ""
