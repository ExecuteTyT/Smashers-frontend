/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-ghost': '#F4F5F7',
        'brand-carbon': '#1A1A1A',
        'brand-blue': '#0055A5',
        'brand-action-start': '#059669',
        'brand-action-end': '#22c55e',
        'brand-lime': '#CCFF00',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        marker: ['Permanent Marker', 'cursive'],
      },
      borderRadius: {
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        premium: '0 20px 40px rgba(5, 150, 105, 0.2)',
        'glow-lime': '0 0 15px rgba(204, 255, 0, 0.4)',
      },
      animation: {
        shine: 'shine 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'button-shimmer': 'button-shimmer 3s linear infinite',
        'pulse-button': 'pulse-button 2s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.4)',
          },
        },
        'pulse-button': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)',
          },
          '50%': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.4)',
          },
        },
        'button-shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
