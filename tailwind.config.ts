import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blueprint palette (see DESIGN.md). Values are CSS variables in
        // app/globals.css so the optional dark theme can swap them. Contrast
        // on light paper: ink 15.6:1, ink-2 7.2:1, signal-ink 5.1:1. `signal`
        // is 3.4:1, so lines and markers only, never text.
        paper: 'rgb(var(--paper) / <alpha-value>)',
        sheet: 'rgb(var(--sheet) / <alpha-value>)',
        grid: 'rgb(var(--grid) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        'rule-strong': 'rgb(var(--rule-strong) / <alpha-value>)',
        graphite: 'rgb(var(--graphite) / <alpha-value>)',
        'graphite-2': 'rgb(var(--graphite-2) / <alpha-value>)',
        'graphite-hover': 'rgb(var(--graphite-hover) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        'signal-ink': 'rgb(var(--signal-ink) / <alpha-value>)',
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
