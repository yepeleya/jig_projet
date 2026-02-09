# 🎯 SCRIPT DE VALIDATION FINALE - COMPATIBILITÉ FRONTEND/BACKEND
# Execute ce script pour confirmer que toutes les corrections fonctionnent

Write-Host "🚀 VALIDATION FINALE - COMPATIBILITÉ JIG2026" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Yellow

# Configuration
$API_URL = "https://jig-projet-1.onrender.com/api"
$FRONTEND_URL = "https://jig-projet-ea3m.vercel.app"

Write-Host ""
Write-Host "📋 TESTS DE COMPATIBILITÉ..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check Backend
Write-Host "🩺 Test 1: Health Check Backend" -ForegroundColor White
try {
    $health = Invoke-WebRequest -Uri "$API_URL/../health" -UseBasicParsing -TimeoutSec 10
    if ($health.StatusCode -eq 200) {
        Write-Host "  ✅ Backend Online - Status 200" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ Backend Health Check Failed" -ForegroundColor Red
}

Write-Host ""

# Test 2: Register avec les bons champs
Write-Host "🔐 Test 2: Authentication Register (Champs corrects)" -ForegroundColor White
$registerBody = @{
    nom = "ValidateUser"
    prenom = "Final"
    email = "validate-final-$(Get-Date -Format 'yyyyMMddHHmmss')@exemple.com"
    password = "password123"  # ✅ password (pas motDePasse)
    role = "ETUDIANT"
} | ConvertTo-Json

try {
    $register = Invoke-WebRequest -Uri "$API_URL/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 15
    if ($register.StatusCode -eq 201) {
        Write-Host "  ✅ Register Success - Status 201 (Champs alignés)" -ForegroundColor Green
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  ❌ Register Failed - Status $statusCode" -ForegroundColor Red
    Write-Host "     Vérifier les champs envoyés vs schema backend" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Login avec mauvais identifiants (doit retourner 400)
Write-Host "🚪 Test 3: Login Invalide (Doit retourner 400, pas 500)" -ForegroundColor White
$loginBody = @{
    email = "fake@invalid.com"
    password = "wrongpassword"  # ✅ password (pas motDePasse)
} | ConvertTo-Json

try {
    $login = Invoke-WebRequest -Uri "$API_URL/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    Write-Host "  ⚠️  Login Unexpected Success - Vérifier validation" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "  ✅ Login Invalid - Status 400 (Code correct)" -ForegroundColor Green  
    } elseif ($statusCode -eq 500) {
        Write-Host "  ❌ Login Invalid - Status 500 (PROBLÈME: devrait être 400)" -ForegroundColor Red
    } else {
        Write-Host "  ⚠️  Login Invalid - Status $statusCode (Inattendu)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 4: CORS Headers
Write-Host "🌐 Test 4: CORS Headers (Autorisation Vercel)" -ForegroundColor White
try {
    $cors = Invoke-WebRequest -Uri "$API_URL/../health" -Headers @{
        'Origin' = $FRONTEND_URL
    } -UseBasicParsing -TimeoutSec 10
    
    $corsHeaders = $cors.Headers
    if ($corsHeaders.'Access-Control-Allow-Origin' -like '*vercel.app*' -or $corsHeaders.'Access-Control-Allow-Origin' -eq '*') {
        Write-Host "  ✅ CORS Configured - Vercel Origin Accepted" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  CORS Headers Present but need verification" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ CORS Test Failed" -ForegroundColor Red
}

Write-Host ""

# Test 5: Frontend Disponible  
Write-Host "🖥️  Test 5: Frontend Accessibility" -ForegroundColor White
try {
    $frontend = Invoke-WebRequest -Uri $FRONTEND_URL -UseBasicParsing -TimeoutSec 10
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  ✅ Frontend Online - Status 200" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ Frontend Inaccessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 RÉSUMÉ DES CORRECTIONS APPLIQUÉES:" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 Backend (Render):" -ForegroundColor White
Write-Host "  ✅ Suppression validation champ 'niveau' inexistant"
Write-Host "  ✅ Correction codes erreur auth: 400 au lieu de 500"  
Write-Host "  ✅ Enum Role: VISITEUR → ETUDIANT"
Write-Host "  ✅ Middleware logging détaillé ajouté"
Write-Host "  ✅ CORS configuré pour tous domaines .vercel.app"

Write-Host ""
Write-Host "🖥️  Frontend (Vercel):" -ForegroundColor White
Write-Host "  ✅ API register: motDePasse → password"
Write-Host "  ✅ Suppression champ 'filiere' de register"
Write-Host "  ✅ Suppression champ 'niveau' de soumission projet"
Write-Host "  ✅ Nettoyage toutes références champs inexistants"

Write-Host ""
Write-Host "🔍 MONITORING ET DEBUG:" -ForegroundColor White  
Write-Host "  • Backend Logs: https://dashboard.render.com/web/srv-cr8h8lkqj1kc73af9t20/logs"
Write-Host "  • Frontend App: $FRONTEND_URL"
Write-Host "  • API Health: $API_URL/../health"

Write-Host ""
if ($register.StatusCode -eq 201 -and $statusCode -eq 400) {
    Write-Host "🎉 COMPATIBILITÉ FRONTEND/BACKEND: RÉUSSIE !" -ForegroundColor Green
    Write-Host "   Toutes les corrections sont opérationnelles." -ForegroundColor Green
} else {
    Write-Host "⚠️  COMPATIBILITÉ: VALIDATION INCOMPLÈTE" -ForegroundColor Yellow
    Write-Host "   Vérifier les logs pour diagnostic approfondi." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Pour tester l'intégration complète:" -ForegroundColor Cyan
Write-Host "   1. Aller sur $FRONTEND_URL"
Write-Host "   2. Tester inscription/connexion"  
Write-Host "   3. Vérifier logs Render pour traçage requêtes"
Write-Host ""