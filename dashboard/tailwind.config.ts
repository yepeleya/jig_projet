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
        primary: {
          50: '#fef2f2',   // red-50
          100: '#fee2e2',  // red-100
          200: '#fecaca',  // red-200
          300: '#fca5a5',  // red-300
          400: '#f87171',  // red-400
          500: '#ef4444',  // red-500
          600: '#dc2626',  // red-600 - Principal
          700: '#b91c1c',  // red-700 - Secondaire
          800: '#991b1b',  // red-800
          900: '#7f1d1d',  // red-900
        },
        jig: {
          primary: '#dc2626',    // Rouge signature JIG
          secondary: '#b91c1c',  // Rouge foncé
          accent: '#fef2f2',     // Rouge très clair
          dark: '#7f1d1d',       // Rouge très foncé
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;