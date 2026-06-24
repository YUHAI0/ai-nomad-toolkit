import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
        },
        brand: {
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
