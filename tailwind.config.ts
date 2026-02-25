import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soraku: {
          dark: '#0D0D1A',
          card: '#111827',
          border: '#1F2937',
          muted: '#374151',
          primary: '#7C3AED',
          secondary: '#EC4899',
          accent: '#06B6D4',
          text: '#F9FAFB',
          sub: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'soraku-gradient': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #06B6D4 100%)',
      },
    },
  },
  plugins: [],
}
export default config
