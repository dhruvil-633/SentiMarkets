/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        surface: '#161b26',
        border: '#2a2f3e',
        primary: '#3b82f6',
        bull: '#22c55e',
        bear: '#ef4444',
        muted: '#6b7280',
        txt: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
