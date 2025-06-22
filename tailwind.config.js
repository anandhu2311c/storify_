/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7928CA',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
      },
    },
  },
  safelist: [
    // Add colors that might be used dynamically
    'bg-purple-100', 'bg-purple-900/30', 'text-purple-700', 'text-purple-400',
    'bg-green-100', 'bg-green-900/30', 'text-green-700', 'text-green-400',
    'bg-red-100', 'bg-red-900/30', 'text-red-700', 'text-red-400',
    'bg-blue-100', 'bg-blue-900/30', 'text-blue-700', 'text-blue-400',
    'bg-indigo-100', 'bg-indigo-900/30', 'text-indigo-700', 'text-indigo-400',
    'bg-teal-100', 'bg-teal-900/30', 'text-teal-700', 'text-teal-400',
    'bg-orange-100', 'bg-orange-900/30', 'text-orange-700', 'text-orange-400',
    'bg-pink-100', 'bg-pink-900/30', 'text-pink-700', 'text-pink-400'
  ],
  plugins: [],
};