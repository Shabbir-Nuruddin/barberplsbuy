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
        brand: {
          50: '#fbf7ea',
          100: '#f5edcf',
          200: '#eedfa3',
          300: '#e4cd71',
          400: '#dab646',
          500: '#d4af37', // Gold Accent
          600: '#bc9027',
          700: '#966a22',
          800: '#7d5624',
          900: '#6a4724',
          950: '#3d2510',
        },
        surface: {
          light: '#2A2C2F',
          DEFAULT: '#1E2022',
          dark: '#121415',
        }
      },
      boxShadow: {
        'liquid': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'liquid-heavy': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 20px 40px -15px rgba(0,0,0,0.5)',
      }
    },
  },
  plugins: [],
}
