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
        lab: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        chem: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          indigo: '#4f46e5'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble': 'bubble 2s ease-in-out infinite',
      },
      keyframes: {
        bubble: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-6px) scale(1.08)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
