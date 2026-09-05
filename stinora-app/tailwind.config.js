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
        dark: {
          950: '#0B0A09', // Deepest background
          900: '#11100E', // Main Background
          800: '#1A1816', // Cards / Surfaces
          700: '#23201D', // Hover states
          600: '#332F2A', // Borders / Dividers
          500: '#524C44',
          400: '#7A7266', // Muted Text
          300: '#A39989',
          200: '#C2B8A3',
          100: '#E0D6C1', // Primary Text
          50: '#F5ECE3',  // Headings
        },
        accent: {
          blue: '#7E93FF', // Blurple CTA
          green: '#4ADE80', // Success / Availability
          orange: '#FF8A65', // Gradient element
          teal: '#2DD4BF', // Gradient element
        }
      },
      boxShadow: {
        'diffusion-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'diffusion-sm': '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
      }
    },
  },
  plugins: [],
}
