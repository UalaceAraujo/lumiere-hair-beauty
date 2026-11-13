/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#F3E5AB',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B59224',
        },
        obsidian: '#0A0A0A',
      }
    },
  },
  plugins: [],
}
