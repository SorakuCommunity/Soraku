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
        // ── Soraku Theme Tokens (reference CSS variables) ──────────────
        soraku: {
          // Semantic aliases — do NOT use hardcoded hex in components
          dark:     'var(--bg)',
          card:     'var(--bg-card)',
          border:   'var(--border)',
          muted:    'var(--bg-muted)',
          primary:  'var(--color-primary)',
          secondary:'var(--color-secondary)',
          accent:   'var(--color-accent)',
          text:     'var(--text)',
          sub:      'var(--text-sub)',
        },
        // ── Direct palette access (for advanced usage) ──────────────────
        'theme-primary':    'var(--color-primary)',
        'theme-dark-base':  'var(--color-dark-base)',
        'theme-secondary':  'var(--color-secondary)',
        'theme-light-base': 'var(--color-light-base)',
        'theme-accent':     'var(--color-accent)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'soraku-gradient': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        'soraku-gradient-full': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)',
      },
      borderColor: {
        soraku: 'var(--border)',
        'soraku-primary': 'var(--color-primary)',
      },
    },
  },
  plugins: [],
}

export default config
