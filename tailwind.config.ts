import type { Config } from 'tailwindcss';

/**
 * Colors are defined as OKLCH CSS variables in app/globals.css and surfaced
 * here so utilities (bg-sea, text-sunset, …) stay in sync with the tokens.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        sea: {
          DEFAULT: 'var(--sea)',
          deep: 'var(--sea-deep)',
          light: 'var(--sea-light)',
        },
        sunset: {
          DEFAULT: 'var(--sunset)',
          deep: 'var(--sunset-deep)',
        },
        stone: 'var(--stone)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '70ch',
        shell: '78rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      boxShadow: {
        soft: '0 1px 2px oklch(0.33 0.06 224 / 0.04), 0 12px 32px -12px oklch(0.33 0.06 224 / 0.18)',
        lift: '0 2px 6px oklch(0.33 0.06 224 / 0.08), 0 24px 60px -16px oklch(0.33 0.06 224 / 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
