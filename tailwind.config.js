/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: {
          950: '#050505',
          900: '#0a0a0a',
          850: '#101010',
          800: '#151515',
          700: '#1f1f1f',
          600: '#2a2a2a',
        },
        gold: {
          100: '#f8efd4',
          200: '#f0deaa',
          300: '#e6c975',
          400: '#d4af37',
          500: '#c9a227',
          600: '#a8841c',
          700: '#7d611a',
        },
        ivory: {
          100: '#ffffff',
          200: '#f2f2f2',
          300: '#c9c9c9',
          400: '#9a9a9a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gold-soft': '0 4px 24px -8px rgba(212, 175, 55, 0.25)',
        'card': '0 8px 30px -12px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'logo-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.92)', letterSpacing: '0.6em' },
          '100%': { opacity: '1', transform: 'scale(1)', letterSpacing: '0.18em' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.8s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'spin-slow': 'spin-slow 6s linear infinite',
        'logo-reveal': 'logo-reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
