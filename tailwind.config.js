/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0B0F17',
          card: '#111827',
          surface: '#182234',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#0D9488', // Sophisticated Pine Teal
          accentHover: '#0F766E',
          income: '#10B981', // Crisp Emerald Mint
          incomeBg: 'rgba(16, 185, 129, 0.1)',
          expense: '#F43F5E', // Elegant Coral Rose
          expenseBg: 'rgba(244, 63, 94, 0.1)',
          amber: '#F59E0B',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'fintech': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'glow-teal': '0 0 25px -5px rgba(13, 148, 136, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
      }
    },
  },
  plugins: [],
}
