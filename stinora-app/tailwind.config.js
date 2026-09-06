/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // '@fontsource/geist-sans' registers the family as "Geist Sans"; the bare
        // "Geist" the Google Fonts CDN served is kept as a fallback for anyone who
        // happens to have it installed locally.
        sans: ['Geist Sans', 'Geist', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C7CDFF',
          300: '#A4AFFF',
          400: '#7E8BFF',
          500: '#5452FF', // Signature StinOra Electric Blurple
          600: '#3D38FF',
          700: '#2A24F2',
          800: '#221EC0',
          900: '#1D1A9B',
          950: '#100E5C',
        },
        editorial: {
          950: 'rgb(var(--editorial-950) / <alpha-value>)',
          900: 'rgb(var(--editorial-900) / <alpha-value>)',
          800: 'rgb(var(--editorial-800) / <alpha-value>)',
          700: 'rgb(var(--editorial-700) / <alpha-value>)',
          600: 'rgb(var(--editorial-600) / <alpha-value>)',
          500: 'rgb(var(--editorial-500) / <alpha-value>)',
          400: 'rgb(var(--editorial-400) / <alpha-value>)',
          300: 'rgb(var(--editorial-300) / <alpha-value>)',
          200: 'rgb(var(--editorial-200) / <alpha-value>)',
          100: 'rgb(var(--editorial-100) / <alpha-value>)',
          50: 'rgb(var(--editorial-50) / <alpha-value>)',
        }
      },
      boxShadow: {
        'bento': 'var(--bento-shadow)',
        'bento-hover': 'var(--bento-hover-shadow)',
        'glow': '0 0 40px -10px rgba(84, 82, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
