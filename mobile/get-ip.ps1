# Script pour obtenir l'adresse IP locale
# Utilisez cette IP dans votre fichier .env

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Obtenir l'adresse IP locale" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtenir l'adresse IPv4
$ipInfo = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -like "192.168.*" -or 
    $_.IPAddress -like "10.*" -or 
    $_.IPAddress -like "172.*"
} | Select-Object -First 1

if ($ipInfo) {
    $ip = $ipInfo.IPAddress
    
    Write-Host "OK - Votre adresse IP locale :" -ForegroundColor Green
    Write-Host ""
    Write-Host "   $ip" -ForegroundColor Yellow
    Write-Host ""
    
    # Copier dans le presse-papier
    $ip | Set-Clipboard
    Write-Host "OK - Adresse IP copiee dans le presse-papier !" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Configuration a utiliser dans .env :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   API_URL=http://${ip}:5000/api/v1" -ForegroundColor White
    Write-Host "   SOCKET_URL=http://${ip}:5000" -ForegroundColor White
    Write-Host ""
    
    # Proposer de mettre a jour automatiquement .env
    if (Test-Path ".env") {
        $update = Read-Host "Voulez-vous mettre a jour automatiquement le fichier .env ? (O/N)"
        if ($update -eq "O" -or $update -eq "o") {
            $envContent = Get-Content ".env" -Raw
            $envContent = $envContent -replace 'API_URL=http://[0-9.]+:5000', "API_URL=http://${ip}:5000"
            $envContent = $envContent -replace 'SOCKET_URL=http://[0-9.]+:5000', "SOCKET_URL=http://${ip}:5000"
            $envContent | Set-Content ".env" -NoNewline
            
            Write-Host ""
            Write-Host "OK - Fichier .env mis a jour avec succes !" -ForegroundColor Green
        }
    } else {
        Write-Host "ATTENTION - Fichier .env introuvable. Creez-le depuis .env.example" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "ERREUR - Impossible de trouver l'adresse IP locale" -ForegroundColor Red
    Write-Host ""
    Write-Host "Essayez manuellement avec :" -ForegroundColor Yellow
    Write-Host "   ipconfig" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Afficher aussi toutes les interfaces
Write-Host "INFO - Toutes les interfaces reseau :" -ForegroundColor Blue
Write-Host ""
ipconfig | Select-String "IPv4"
Write-Host ""
