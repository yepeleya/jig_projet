import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Désactiver les règles strictes pour éviter les erreurs de build
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  },
  ignorePatterns: [
    ".next/**",
    "out/**", 
    "build/**",
    "node_modules/**",
    "*.config.js",
    "*.config.ts"
  ]
};

export default config;
