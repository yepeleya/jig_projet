import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette JIG 2026
        jig: {
          primary: '#9E1B32',    // Rouge signature JIG
          secondary: '#333333',  // Gris foncé
          background: '#f5f5f5', // Gris clair
          text: '#FFFFFF',       // Blanc pour texte
          accent: '#fef2f2',     // Rouge très clair
          dark: '#1a1a1a',       // Noir profond
        },
        // Raccourcis directs pour faciliter l'utilisation
        'jig-primary': '#9E1B32',
        'jig-secondary': '#333333',
        'jig-background': '#f5f5f5',
        'jig-text': '#FFFFFF',
        'jig-accent': '#fef2f2',
        'jig-dark': '#1a1a1a',
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#9E1B32',  // Couleur principale JIG
          700: '#7f1d1d',
          800: '#6b1f1f',
          900: '#5a1a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(158, 27, 50, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(158, 27, 50, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-jig': 'linear-gradient(135deg, #9E1B32 0%, #d1477a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      },
    },
  },
  plugins: [],
};

export default config;