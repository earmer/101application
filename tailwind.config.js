/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables manual toggling
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors or CJK-safe font settings here
      },
    },
  },
  plugins: [],
};