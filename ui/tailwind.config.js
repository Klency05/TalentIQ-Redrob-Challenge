/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#1D9E75',
          50: '#eafaf4',
          100: '#d2f3e6',
          200: '#a6e7cd',
          300: '#6fd6ad',
          400: '#3fbf92',
          500: '#1D9E75',
          600: '#168563',
          700: '#126a50',
          800: '#0e5440',
          900: '#0a3d2e',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(29, 158, 117, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(29, 158, 117, 0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.4s ease-out forwards',
        scaleX: 'scaleX 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
