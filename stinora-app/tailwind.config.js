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
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C7CDFF',
          300: '#A4AFFF',
          400: '#7E8BFF',
          500: '#5452FF', // The signature StinOra Blurple CTA
          600: '#3D38FF',
          700: '#2A24F2',
          800: '#221EC0',
          900: '#1D1A9B',
          950: '#100E5C',
        },
        editorial: {
          950: '#070707',
          900: '#0C0B0A', // Main Background
          800: '#141311', // Card Background
          700: '#1C1A18', 
          600: '#2A2724', // Thin structural borders
          500: '#4D4742',
          400: '#736B63',
          300: '#998E84',
          200: '#BFB2A6',
          100: '#E6D7C8', // Secondary Text
          50: '#F5EBE1',  // Primary Text
        }
      },
      boxShadow: {
        'bento': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'bento-hover': 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'glow': '0 0 40px -10px rgba(84, 82, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
