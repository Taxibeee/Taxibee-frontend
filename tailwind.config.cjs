// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e9ff',
          100: '#c0c8ff',
          200: '#96a4ff',
          300: '#6c7fff',
          400: '#4d5eff',
          500: '#3f4ff5', // Main primary color
          600: '#3a46e1',
          700: '#333cc6',
          800: '#2b32ac',
          900: '#1f2280',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0da2e7',
          600: '#0284c7',
          700: '#036ba1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          100: '#d5d7e0',
          200: '#acaebf',
          300: '#8c8fa3',
          400: '#666980',
          500: '#4d4f66',
          600: '#34354a',
          700: '#292a3d', // Sidebar background
          800: '#141528',
          900: '#0c0d21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
