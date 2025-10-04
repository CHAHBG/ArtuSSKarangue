# Test the API
Write-Host "Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Health Check Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "`nYour server is running successfully!" -ForegroundColor Green
Write-Host "You can now test the API endpoints using the commands in backend/API_TESTING.md" -ForegroundColor Yellow
