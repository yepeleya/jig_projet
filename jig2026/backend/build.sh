# 🔧 Script de correction Render robuste
# =====================================

# Étape 1 : Générer Prisma sans erreur
echo "🔄 Génération Prisma..."
npx prisma generate || echo "⚠️ Génération Prisma échouée - Continuer"

# Étape 2 : Migration prudente
echo "🗃️ Migration base de données..."
npx prisma migrate deploy || echo "⚠️ Migration échouée - Continuer"

# Étape 3 : Vérification avant démarrage
echo "✅ Validation environnement..."
node -e "
  console.log('🔍 DATABASE_URL:', !!process.env.DATABASE_URL);
  console.log('🔍 JWT_SECRET:', !!process.env.JWT_SECRET);
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL manquante');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET manquante');  
    process.exit(1);
  }
  console.log('✅ Variables OK');
" || exit 1

echo "🚀 Démarrage serveur..."