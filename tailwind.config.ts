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
        // Warm-neutral graphite base. Named "carbon" (not "base") so it
        // can't collide with the text-base font-size utility.
        carbon: '#0b0e14',
        raised: '#0f131c',
        panel: '#121724',
        overlay: '#161d2d',
        line: '#1e2534',
        'line-bright': '#2a3348',
        // Text
        ink: '#e7eaf1',
        'ink-dim': '#9aa5b6',
        'ink-mute': '#5f6b7e',
        // Accents
        accent: '#54c1ff', // electric cyan-blue: interactive / system
        violet: '#a08cff', // managed / secondary highlight
        lime: '#c4e858', // deployment highlight (used sparingly)
        ok: '#41cf8e', // muted green
        warn: '#e0b45a', // subtle amber
        err: '#e26d66', // restrained red
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
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
        content: '72rem',
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
