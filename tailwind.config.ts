
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444', // rojo vibrante
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#F59E0B', // amarillo vibrante
          foreground: '#111827'
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
}
export default config
