#!/bin/bash

echo "🔍 DIAGNOSTIC RENDER - JIG2026"
echo "=============================="
echo "Date: $(date)"
echo "Commit: $RENDER_GIT_COMMIT"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo ""
echo "📁 Structure répertoire:"
ls -la

echo ""
echo "📦 Package.json:"
cat package.json | head -20

echo ""
echo "🌍 Variables d'environnement:"
echo "PORT: $PORT"
echo "DATABASE_URL présente: $([ -n "$DATABASE_URL" ] && echo "✅ OUI" || echo "❌ NON")"
echo "JWT_SECRET présente: $([ -n "$JWT_SECRET" ] && echo "✅ OUI" || echo "❌ NON")"
echo "NODE_ENV: $NODE_ENV"

echo ""
echo "📁 Fichiers src:"
ls -la src/

echo ""
echo "🔧 Test index minimal:"
node -c src/index-minimal.js && echo "✅ Syntaxe OK" || echo "❌ Erreur syntaxe"

echo ""
echo "📦 Installation dépendances:"
npm install --production
echo "✅ Installation terminée"

echo ""
echo "🚀 Diagnostic terminé - Prêt pour démarrage"