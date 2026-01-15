// Couleurs officielles JIG 2026
export const COLORS = {
  // Couleurs principales
  primary: '#9E1B32',      // Rouge JIG
  secondary: '#333333',    // Gris foncé
  background: '#f5f5f5',   // Fond clair
  white: '#FFFFFF',        // Texte principal

  // Variantes
  primaryHover: '#7A1528',
  secondaryHover: '#555555',
  
  // Couleurs utilitaires
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Nuances de gris
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
}

// Classes Tailwind personnalisées pour JIG
export const JIG_CLASSES = {
  // Couleurs de fond
  bgPrimary: 'bg-[#9E1B32]',
  bgSecondary: 'bg-[#333333]',
  bgBackground: 'bg-[#f5f5f5]',
  
  // Couleurs de texte
  textPrimary: 'text-[#9E1B32]',
  textSecondary: 'text-[#333333]',
  textWhite: 'text-white',
  
  // Hovers
  hoverPrimary: 'hover:bg-[#7A1528]',
  hoverSecondary: 'hover:bg-[#555555]',
  hoverTextPrimary: 'hover:text-[#7A1528]',
  
  // Bordures
  borderPrimary: 'border-[#9E1B32]',
  borderSecondary: 'border-[#333333]',
  
  // Boutons
  btnPrimary: 'bg-[#9E1B32] hover:bg-[#7A1528] text-white',
  btnSecondary: 'bg-[#333333] hover:bg-[#555555] text-white',
  btnOutline: 'border-[#9E1B32] text-[#9E1B32] hover:bg-[#9E1B32] hover:text-white'
}