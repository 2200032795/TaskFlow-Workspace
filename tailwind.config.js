/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F1',
          100: '#F7F2E8',
          200: '#EFE7D4',
          300: '#E2D6BC',
          400: '#D6B58C',
          500: '#C9A578',
        },
        coffee: {
          400: '#6B4A3A',
          500: '#513B2F',
          600: '#3F2D24',
          700: '#2D2019',
        },
        sage: {
          300: '#C4CBB6',
          400: '#A3AD91',
          500: '#8B9777',
          600: '#6F7A5E',
        },
        caramel: {
          300: '#E4CDA8',
          400: '#D6B58C',
          500: '#C9A578',
          600: '#B98F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(81, 59, 47, 0.08)',
        card: '0 4px 16px -4px rgba(81, 59, 47, 0.12)',
        lift: '0 12px 32px -8px rgba(81, 59, 47, 0.22)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'progress-fill': {
          from: { width: '0%' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'progress-fill': 'progress-fill 0.8s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
