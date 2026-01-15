#!/usr/bin/env powershell
# Script de démarrage automatique pour JIG2026
# Sauvegardez ce fichier comme: start-jig2026.ps1

Write-Host "🚀 Démarrage des services JIG2026..." -ForegroundColor Green
Write-Host ""

# Chemins vers les projets
$BackendPath = "C:\wamp64\www\jig_projet\jig2026\backend"
$FrontendPath = "C:\wamp64\www\jig_projet\jig2026\frontend"

# Fonction pour vérifier si un port est utilisé
function Test-Port($Port) {
    try {
        $Connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction Stop
        return $Connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# Fonction pour attendre qu'un service soit prêt
function Wait-ForService($Port, $ServiceName, $MaxWait = 30) {
    Write-Host "⏳ Attente du service $ServiceName sur le port $Port..." -ForegroundColor Yellow
    $Counter = 0
    while (-not (Test-Port $Port) -and $Counter -lt $MaxWait) {
        Start-Sleep -Seconds 1
        $Counter++
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    if (Test-Port $Port) {
        Write-Host ""
        Write-Host "✅ $ServiceName est prêt sur le port $Port" -ForegroundColor Green
        return $true
    } else {
        Write-Host ""
        Write-Host "❌ $ServiceName n'a pas pu démarrer dans les temps" -ForegroundColor Red
        return $false
    }
}

# 1. Vérifier WAMP
Write-Host "1️⃣ Vérification de WAMP/MySQL..." -ForegroundColor Cyan
if (-not (Test-Port 3306)) {
    Write-Host "❌ MySQL n'est pas démarré. Veuillez démarrer WAMP d'abord." -ForegroundColor Red
    Write-Host "   Démarrez WAMP Control Panel et attendez que MySQL soit vert."
    Read-Host "Appuyez sur Entrée quand WAMP est démarré"
}

if (Test-Port 3306) {
    Write-Host "✅ MySQL est actif" -ForegroundColor Green
} else {
    Write-Host "❌ Abandon : MySQL est requis" -ForegroundColor Red
    exit 1
}

# 2. Démarrer le Backend si nécessaire
Write-Host ""
Write-Host "2️⃣ Vérification du Backend..." -ForegroundColor Cyan
if (Test-Port 5000) {
    Write-Host "✅ Backend déjà actif sur le port 5000" -ForegroundColor Green
} else {
    Write-Host "🔄 Démarrage du backend..." -ForegroundColor Yellow
    if (Test-Path $BackendPath) {
        # Démarrer le backend en arrière-plan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; npm start" -WindowStyle Minimized
        
        # Attendre que le backend soit prêt
        if (Wait-ForService 5000 "Backend") {
            # Tester l'API
            Start-Sleep -Seconds 2
            try {
                $TestResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5
                Write-Host "✅ Backend API fonctionne" -ForegroundColor Green
            } catch {
                Write-Host "⚠️ Backend démarré mais API peut avoir des problèmes" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "❌ Dossier backend non trouvé: $BackendPath" -ForegroundColor Red
    }
}

# 3. Démarrer le Frontend si nécessaire
Write-Host ""
Write-Host "3️⃣ Vérification du Frontend..." -ForegroundColor Cyan
if (Test-Port 3002) {
    Write-Host "✅ Frontend déjà actif sur le port 3002" -ForegroundColor Green
} else {
    Write-Host "🔄 Démarrage du frontend..." -ForegroundColor Yellow
    if (Test-Path $FrontendPath) {
        # Démarrer le frontend en arrière-plan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; npm run dev" -WindowStyle Minimized
        
        # Attendre que le frontend soit prêt
        Wait-ForService 3002 "Frontend"
    } else {
        Write-Host "❌ Dossier frontend non trouvé: $FrontendPath" -ForegroundColor Red
    }
}

# 4. Test final des services
Write-Host ""
Write-Host "4️⃣ Test final des services..." -ForegroundColor Cyan

# Test Backend API
try {
    $BackendTest = Invoke-WebRequest -Uri "http://localhost:5000/api/projets/public" -TimeoutSec 10
    if ($BackendTest.StatusCode -eq 200) {
        Write-Host "✅ API Backend: Projets accessibles" -ForegroundColor Green
    } else {
        Write-Host "⚠️ API Backend: Status $($BackendTest.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ API Backend: Erreur - $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend
try {
    $FrontendTest = Invoke-WebRequest -Uri "http://localhost:3002" -TimeoutSec 10
    if ($FrontendTest.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Page d'accueil accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: Erreur - $($_.Exception.Message)" -ForegroundColor Red
}

# Test Images
try {
    $ImageTest = Invoke-WebRequest -Uri "http://localhost:5000/uploads/logo/logo_blanc.png" -TimeoutSec 5
    if ($ImageTest.StatusCode -eq 200) {
        Write-Host "✅ Images: Logo accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Images: Logo non accessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Résumé des services JIG2026:" -ForegroundColor Green
Write-Host "   📊 Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "   🔧 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   🗳️ Vote:     http://localhost:3002/voter" -ForegroundColor White
Write-Host "   🖼️ Images:   http://localhost:5000/uploads/" -ForegroundColor White
Write-Host ""

if ((Test-Port 5000) -and (Test-Port 3002)) {
    Write-Host "✅ Tous les services sont opérationnels!" -ForegroundColor Green
    
    # Proposer d'ouvrir le navigateur
    $OpenBrowser = Read-Host "Voulez-vous ouvrir la page d'accueil dans le navigateur? (o/n)"
    if ($OpenBrowser -eq "o" -or $OpenBrowser -eq "O" -or $OpenBrowser -eq "oui") {
        Start-Process "http://localhost:3002"
    }
} else {
    Write-Host "⚠️ Certains services ne sont pas démarrés correctement" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Pour arrêter les services, fermez les fenêtres PowerShell ouvertes" -ForegroundColor Cyan
Write-Host "💡 Pour relancer ce script: ./start-jig2026.ps1" -ForegroundColor Cyan