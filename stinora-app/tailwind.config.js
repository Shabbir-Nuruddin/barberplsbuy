/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        earth: {
          50: '#FCFAF8', // Very light cream (App Background)
          100: '#F5F0E6', // Soft cream (Cards/Surfaces)
          200: '#E6DCC3',
          300: '#D4C4A1',
          400: '#C2AB7F', // Accent Gold/Camel
          500: '#A68A56',
          600: '#8C7043',
          700: '#6B5230',
          800: '#4A3720', // Main Text
          900: '#2E2214', // Headings
          950: '#1C1309',
        }
      },
      boxShadow: {
        'diffusion': '0 20px 40px -15px rgba(74, 55, 32, 0.08)',
        'diffusion-sm': '0 4px 12px rgba(74, 55, 32, 0.04)',
      }
    },
  },
  plugins: [],
}
