# Script de Build Local Simple - ARTU SI SEN KARANGUE
# Usage: .\build-simple.ps1 -Profile development -Local

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("preview", "production", "development")]
    [string]$Profile = "development",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("android", "ios", "all")]
    [string]$Platform = "android",
    
    [Parameter(Mandatory=$false)]
    [switch]$Local
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BUILD LOCAL ARTU SI SEN KARANGUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Profile: $Profile" -ForegroundColor Yellow
Write-Host "Platform: $Platform" -ForegroundColor Yellow
Write-Host "Type: " -NoNewline
if ($Local) {
    Write-Host "Local" -ForegroundColor Green
} else {
    Write-Host "Cloud (EAS)" -ForegroundColor Cyan
}
Write-Host ""

# Vérifier Node.js
Write-Host "[1/5] Verification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Node.js n'est pas installe" -ForegroundColor Red
    Write-Host "Installez Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK - Node.js $nodeVersion" -ForegroundColor Green
Write-Host ""

# Vérifier EAS CLI
Write-Host "[2/5] Verification de EAS CLI..." -ForegroundColor Yellow
$easVersion = eas --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: EAS CLI n'est pas installe" -ForegroundColor Red
    Write-Host "Installation de EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Impossible d'installer EAS CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK - EAS CLI installe" -ForegroundColor Green
Write-Host ""

# Vérifier .env
Write-Host "[3/5] Verification du fichier .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "ATTENTION: Fichier .env introuvable" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Write-Host "Creation de .env depuis .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "OK - Fichier .env cree" -ForegroundColor Green
        Write-Host "IMPORTANT: Verifiez l'adresse IP dans .env" -ForegroundColor Yellow
        Write-Host "Executez: .\get-ip.ps1 pour detecter votre IP locale" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "ERREUR: .env.example introuvable" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "OK - Fichier .env existe" -ForegroundColor Green
}
Write-Host ""

# Vérifier node_modules
Write-Host "[4/5] Verification des dependances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Installation des dependances echouee" -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK - Dependances installees" -ForegroundColor Green
Write-Host ""

# Construire la commande
$easCommand = "eas build --profile $Profile --platform $Platform"
if ($Local) {
    $easCommand += " --local"
}

Write-Host "[5/5] Lancement du build..." -ForegroundColor Yellow
Write-Host "Commande: $easCommand" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Exécuter le build
Invoke-Expression $easCommand

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($LASTEXITCODE -eq 0) {
    Write-Host "BUILD TERMINE AVEC SUCCES !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($Local) {
        Write-Host "Le fichier APK/IPA se trouve dans le dossier de sortie" -ForegroundColor Yellow
    } else {
        Write-Host "Telechargez votre build depuis:" -ForegroundColor Yellow
        Write-Host "https://expo.dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "BUILD ECHOUE" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Verifiez votre connexion EAS: eas login" -ForegroundColor White
    Write-Host "2. Nettoyez le cache: npm cache clean --force" -ForegroundColor White
    Write-Host "3. Reinstallez: rm -rf node_modules; npm install" -ForegroundColor White
    Write-Host "4. Consultez BUILD_GUIDE.md" -ForegroundColor White
    exit 1
}

Write-Host ""
