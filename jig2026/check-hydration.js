#!/usr/bin/env node

/**
 * Script pour détecter et corriger les erreurs d'hydratation potentielles
 * dans les projets Next.js
 */

const fs = require('fs');
const path = require('path');

// Patterns à rechercher qui peuvent causer des erreurs d'hydratation
const hydrationIssuePatterns = [
  /new Date\(\)/g,
  /Math\.random\(\)/g,
  /Date\.now\(\)/g,
  /localStorage\./g,
  /sessionStorage\./g,
  /window\./g,
  /document\./g,
  /navigator\./g,
];

// Extensions à vérifier
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

// Dossiers à ignorer
const ignoreFolders = ['node_modules', '.next', 'dist', 'build'];

function scanDirectory(dir, issues = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !ignoreFolders.includes(item)) {
      scanDirectory(fullPath, issues);
    } else if (stat.isFile() && extensions.includes(path.extname(item))) {
      scanFile(fullPath, issues);
    }
  }

  return issues;
}

function scanFile(filePath, issues) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Vérifier si le fichier a 'use client'
  const hasUseClient = content.includes("'use client'") || content.includes('"use client"');

  lines.forEach((line, index) => {
    hydrationIssuePatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
          pattern: pattern.toString(),
          hasUseClient,
          suggestion: getSuggestion(pattern)
        });
      }
    });
  });
}

function getSuggestion(pattern) {
  const suggestions = {
    '/new Date()/g': 'Utilisez useEffect avec useState pour initialiser côté client',
    '/Math.random()/g': 'Utilisez useEffect avec useState pour générer côté client',
    '/Date.now()/g': 'Utilisez useEffect avec useState pour obtenir le timestamp côté client',
    '/localStorage./g': 'Utilisez le hook useLocalStorage ou vérifiez typeof window !== "undefined"',
    '/sessionStorage./g': 'Utilisez useEffect ou vérifiez typeof window !== "undefined"',
    '/window./g': 'Utilisez useEffect ou vérifiez typeof window !== "undefined"',
    '/document./g': 'Utilisez useEffect ou vérifiez typeof document !== "undefined"',
    '/navigator./g': 'Utilisez useEffect ou vérifiez typeof navigator !== "undefined"',
  };
  return suggestions[pattern.toString()] || 'Vérifiez si ce code doit être exécuté côté client uniquement';
}

// Fonction principale
function main() {
  const projectDirs = [
    'C:\\wamp64\\www\\jig_projet\\jig2026\\jury\\src',
    'C:\\wamp64\\www\\jig_projet\\jig2026\\frontend\\src'
  ];

  console.log('🔍 Analyse des erreurs d\'hydratation potentielles...\n');

  projectDirs.forEach(projectDir => {
    if (fs.existsSync(projectDir)) {
      console.log(`📁 Analyse de ${projectDir}:`);
      const issues = scanDirectory(projectDir);

      if (issues.length === 0) {
        console.log('✅ Aucune erreur d\'hydratation potentielle détectée\n');
      } else {
        console.log(`⚠️  ${issues.length} problème(s) potentiel(s) détecté(s):\n`);
        
        issues.forEach(issue => {
          console.log(`📄 ${issue.file}:${issue.line}`);
          console.log(`   Code: ${issue.content}`);
          console.log(`   'use client': ${issue.hasUseClient ? '✅' : '❌'}`);
          console.log(`   💡 Suggestion: ${issue.suggestion}\n`);
        });
      }
    } else {
      console.log(`❌ Répertoire non trouvé: ${projectDir}\n`);
    }
  });

  console.log('🎯 Recommandations générales:');
  console.log('1. Ajoutez "use client" aux composants utilisant des hooks');
  console.log('2. Utilisez useEffect pour le code nécessitant window/document');
  console.log('3. Utilisez les hooks useHydrationFix/useLocalStorage fournis');
  console.log('4. Encapsulez les composants problématiques avec HydrationWrapper');
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile };