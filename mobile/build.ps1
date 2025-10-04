# Script de Build Automatique - ARTU SI SEN KARANGUE
# Créé le : 4 octobre 2025

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("preview", "production", "development")]
    [string]$Profile = "preview",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("android", "ios", "all")]
    [string]$Platform = "android",
    
    [Parameter(Mandatory=$false)]
    [switch]$Local,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipChecks
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ARTU SI SEN KARANGUE - Build Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher les messages
function Write-Step {
    param($Message)
    Write-Host "► $Message" -ForegroundColor Yellow
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Vérifier si nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Error "Erreur: package.json introuvable. Exécutez ce script depuis le dossier mobile/"
    exit 1
}

# Vérifier que Node.js est installé
Write-Step "Vérification de Node.js..."
try {
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-Error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org/"
    exit 1
}

# Vérifier que EAS CLI est installé
if (-not $SkipChecks) {
    Write-Step "Vérification de EAS CLI..."
    try {
        $easVersion = eas --version
        Write-Success "EAS CLI version: $easVersion"
    } catch {
        Write-Info "EAS CLI n'est pas installé. Installation en cours..."
        npm install -g eas-cli
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Impossible d'installer EAS CLI"
            exit 1
        }
        Write-Success "EAS CLI installé avec succès"
    }
}

# Vérifier la connexion EAS
if (-not $SkipChecks) {
    Write-Step "Vérification de la connexion EAS..."
    $easWhoami = eas whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Vous n'êtes pas connecté à EAS. Connexion..."
        eas login
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Échec de la connexion à EAS"
            exit 1
        }
    } else {
        Write-Success "Connecté en tant que: $easWhoami"
    }
}

# Vérifier les dépendances
Write-Step "Vérification des dépendances..."
if (-not (Test-Path "node_modules")) {
    Write-Info "Installation des dépendances..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Échec de l'installation des dépendances"
        exit 1
    }
}
Write-Success "Dépendances OK"

# Vérifier le fichier .env
Write-Step "Vérification de la configuration..."
if (-not (Test-Path ".env")) {
    Write-Info "Fichier .env introuvable. Création depuis .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Success "Fichier .env créé"
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Modifiez le fichier .env avec votre adresse IP locale !" -ForegroundColor Yellow
        Write-Host "   Obtenez votre IP avec: ipconfig | Select-String 'IPv4'" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Voulez-vous continuer ? (O/N)"
        if ($continue -ne "O" -and $continue -ne "o") {
            exit 0
        }
    } else {
        Write-Error "Fichier .env.example introuvable"
        exit 1
    }
}

# Afficher la configuration du build
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Configuration du Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Profile    : $Profile" -ForegroundColor White
Write-Host "Plateforme : $Platform" -ForegroundColor White
Write-Host "Mode       : $(if ($Local) { 'Local' } else { 'Cloud (EAS)' })" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Demander confirmation
if (-not $SkipChecks) {
    $confirm = Read-Host "Lancer le build ? (O/N)"
    if ($confirm -ne "O" -and $confirm -ne "o") {
        Write-Info "Build annulé"
        exit 0
    }
}

# Construire la commande EAS
Write-Host ""
Write-Step "Lancement du build..."
Write-Host ""

$easCommand = "eas build --profile $Profile --platform $Platform"
if ($Local) {
    $easCommand += " --local"
}

Write-Info "Commande: $easCommand"
Write-Host ""

# Exécuter le build
Invoke-Expression $easCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Success "Build terminé avec succès !"
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    if (-not $Local) {
        Write-Info "Votre build est disponible sur :"
        Write-Host "   https://expo.dev/accounts/[votre-username]/projects/artu-si-sen-karangue/builds" -ForegroundColor Cyan
        Write-Host ""
        Write-Info "Scannez le QR code ou téléchargez l'APK depuis le lien fourni ci-dessus"
    } else {
        Write-Info "Le fichier APK/IPA est disponible localement"
    }
    
    Write-Host ""
    Write-Host "📱 Installation sur Android:" -ForegroundColor Yellow
    Write-Host "   1. Téléchargez l'APK" -ForegroundColor White
    Write-Host "   2. Transférez-le sur votre téléphone" -ForegroundColor White
    Write-Host "   3. Activez 'Sources inconnues' dans les paramètres" -ForegroundColor White
    Write-Host "   4. Installez l'APK" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Error "Le build a échoué"
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Info "Consultez les logs ci-dessus pour plus de détails"
    Write-Host ""
    Write-Host "Solutions communes:" -ForegroundColor Yellow
    Write-Host "   1. Nettoyer le cache: npm cache clean --force" -ForegroundColor White
    Write-Host "   2. Réinstaller: rm -rf node_modules; npm install" -ForegroundColor White
    Write-Host "   3. Vérifier la connexion EAS: eas login" -ForegroundColor White
    Write-Host "   4. Consulter BUILD_GUIDE.md pour plus d'aide" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Merci d'utiliser ARTU SI SEN KARANGUE ! 🇸🇳" -ForegroundColor Cyan
Write-Host ""
