import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blueprint palette (see DESIGN.md). Contrast on paper: ink 15.6:1,
        // ink-2 7.2:1, signal-ink 5.1:1. `signal` is 3.4:1, so lines and
        // markers only, never text.
        paper: '#F3F0E8',
        sheet: '#FAF8F3',
        grid: '#E7E2D7',
        rule: '#CFC8B8',
        'rule-strong': '#9A9383',
        graphite: '#16181D',
        'graphite-2': '#4A4F5A',
        signal: '#E2531A',
        'signal-ink': '#B23E0C',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        display: '-0.04em',
      },
      fontSize: {
        // Readability floor: nothing below 14px. Mono metadata sits at `meta`.
        meta: ['0.875rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
      },
      maxWidth: {
        sheet: '90rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
