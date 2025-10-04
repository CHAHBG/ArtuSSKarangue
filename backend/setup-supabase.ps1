# Script de Configuration Supabase
# Ce script vous aide a configurer la connexion a Supabase

Write-Host ""
Write-Host "Configuration Supabase pour ARTU SI SEN KARANGUE" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Informations detectees
$supabaseUrl = "https://xsnrzyzgphmjivdqpgst.supabase.co"
$supabaseHost = "db.xsnrzyzgphmjivdqpgst.supabase.co"
$supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbnJ6eXpncGhtaml2ZHFwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTYyMzksImV4cCI6MjA3NTA5MjIzOX0.KR-xiuAw1LM0DZi-1dzuC_qtqAKz_HsZH-BUydHQgpI"

Write-Host "[OK] Projet Supabase detecte :" -ForegroundColor Green
Write-Host "   URL: $supabaseUrl" -ForegroundColor Gray
Write-Host "   Database Host: $supabaseHost" -ForegroundColor Gray
Write-Host ""

# Demander le mot de passe
Write-Host "Etape 1 : Mot de passe de la base de donnees" -ForegroundColor Yellow
Write-Host ""
Write-Host "Vous avez cree un mot de passe lors de la creation du projet Supabase." -ForegroundColor White
Write-Host "Pour le retrouver :" -ForegroundColor White
Write-Host "  1. Allez sur https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Selectionnez votre projet 'artu-karangue'" -ForegroundColor Gray
Write-Host "  3. Settings -> Database -> Connection string" -ForegroundColor Gray
Write-Host "  4. Cliquez sur 'Reset database password' si vous l'avez oublie" -ForegroundColor Gray
Write-Host ""

$password = Read-Host "Entrez votre mot de passe Supabase"

if ([string]::IsNullOrWhiteSpace($password)) {
    Write-Host ""
    Write-Host "[ERREUR] Mot de passe requis. Script annule." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Mot de passe recu" -ForegroundColor Green
Write-Host ""

# Creer la connection string
$connectionString = "postgresql://postgres:$password@$supabaseHost:5432/postgres"

# Mettre a jour le fichier .env
Write-Host "Etape 2 : Mise a jour du fichier .env" -ForegroundColor Yellow
Write-Host ""

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    # Remplacer DATABASE_URL (gerer les differents formats)
    if ($envContent -match 'DATABASE_URL=postgresql://postgres:[^@]*@[^/]*/postgres') {
        $envContent = $envContent -replace 'DATABASE_URL=postgresql://postgres:[^@]*@[^/]*/postgres', "DATABASE_URL=$connectionString"
    } elseif ($envContent -match 'DATABASE_URL=postgresql://postgres:\[YOUR-PASSWORD\]@.*') {
        $envContent = $envContent -replace 'DATABASE_URL=postgresql://postgres:\[YOUR-PASSWORD\]@.*', "DATABASE_URL=$connectionString"
    } else {
        # Ajouter DATABASE_URL si elle n'existe pas
        $envContent = $envContent -replace '(# Option 2: Connection String[^\n]*\n[^\n]*\n)', "`$1DATABASE_URL=$connectionString`n"
    }
    
    # Remplacer DB_PASSWORD
    $envContent = $envContent -replace 'DB_PASSWORD=[^\r\n]*', "DB_PASSWORD=$password"
    
    Set-Content -Path $envPath -Value $envContent
    
    Write-Host "[OK] Fichier .env mis a jour" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[ERREUR] Fichier .env introuvable a : $envPath" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Afficher les informations de connexion
Write-Host "Etape 3 : Informations de connexion" -ForegroundColor Yellow
Write-Host ""
Write-Host "Votre configuration Supabase :" -ForegroundColor White
Write-Host "  Host: $supabaseHost" -ForegroundColor Gray
Write-Host "  Port: 5432" -ForegroundColor Gray
Write-Host "  Database: postgres" -ForegroundColor Gray
Write-Host "  User: postgres" -ForegroundColor Gray
Write-Host "  Password: ******** (cache)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Connection String:" -ForegroundColor Gray
Write-Host "  postgresql://postgres:********@$supabaseHost:5432/postgres" -ForegroundColor Gray
Write-Host ""

# Tester la connexion
Write-Host "Etape 4 : Test de connexion" -ForegroundColor Yellow
Write-Host ""
Write-Host "Voulez-vous tester la connexion maintenant ? (O/N)" -ForegroundColor White
$testConnection = Read-Host

if ($testConnection -eq "O" -or $testConnection -eq "o" -or $testConnection -eq "Y" -or $testConnection -eq "y") {
    Write-Host ""
    Write-Host "Demarrage du serveur backend..." -ForegroundColor Cyan
    Write-Host "Appuyez sur Ctrl+C pour arreter" -ForegroundColor Gray
    Write-Host ""
    
    node src/server.js
} else {
    Write-Host ""
    Write-Host "[OK] Configuration terminee !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pour demarrer le backend :" -ForegroundColor White
    Write-Host "  cd backend" -ForegroundColor Gray
    Write-Host "  node src/server.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Vous devriez voir : '[OK] Connected to Supabase PostgreSQL'" -ForegroundColor White
    Write-Host ""
}
