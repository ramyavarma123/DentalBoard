/** @type {import('tailwindcss').Config} */
const forms = require('@tailwindcss/forms');
const animate = require('tailwindcss-animate');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          600: '#14b8a6',
          700: '#0d9488',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [forms, animate],
};
