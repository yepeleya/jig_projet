# Installation automatique des dépendances JIG2026
Write-Host "📦 Installation des dépendances JIG2026..." -ForegroundColor Green

# Backend
Write-Host "🔧 Installation dépendances Backend..." -ForegroundColor Yellow
Set-Location "jig2026\backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend: dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: erreur d'installation" -ForegroundColor Red
}

# Frontend
Write-Host "👥 Installation dépendances Frontend..." -ForegroundColor Yellow
Set-Location "..\frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend: dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: erreur d'installation" -ForegroundColor Red
}

# Jury
Write-Host "⚖️ Installation dépendances Jury..." -ForegroundColor Yellow
Set-Location "..\jury"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Jury: dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Jury: erreur d'installation" -ForegroundColor Red
}

# Dashboard
Write-Host "📊 Installation dépendances Dashboard..." -ForegroundColor Yellow
Set-Location "..\..\dashboard"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dashboard: dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Dashboard: erreur d'installation" -ForegroundColor Red
}

# Retour au dossier racine
Set-Location ".."

Write-Host ""
Write-Host "🎉 Installation terminée!" -ForegroundColor Green
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Configurez votre base de données dans jig2026\backend\.env" -ForegroundColor White
Write-Host "   2. Exécutez: .\start-jig2026.ps1" -ForegroundColor White