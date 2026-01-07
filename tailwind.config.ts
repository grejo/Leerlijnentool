import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PXL Brand Colors
        pxl: {
          black: '#030203',
          white: '#FFFFFF',
          gold: '#AE9A64',
        },
        // Keep primary for backwards compatibility, but use PXL colors
        primary: {
          50: '#faf9f7',
          100: '#f5f3ee',
          200: '#e9e5d9',
          300: '#ddd7c4',
          400: '#c5bb9a',
          500: '#AE9A64', // PXL Gold
          600: '#9d8b5a',
          700: '#83734b',
          800: '#695c3c',
          900: '#564b31',
        },
      },
      fontFamily: {
        sans: ['var(--font-museo-sans)', 'Arial', 'sans-serif'],
        heading: ['var(--font-raleway)', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'pxl-card': '0 2px 8px rgba(3, 2, 3, 0.1)',
        'pxl-hover': '0 4px 12px rgba(174, 154, 100, 0.3)',
      },
      borderRadius: {
        'pxl': '8px',
      },
    },
  },
  plugins: [],
}
export default config
