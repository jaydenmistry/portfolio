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
        // Apple palette (see DESIGN.md).
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        label: 'rgb(var(--label) / <alpha-value>)',
        'label-2': 'rgb(var(--label-2) / <alpha-value>)',
        separator: 'rgb(var(--separator) / <alpha-value>)',
        fill: 'rgb(var(--fill) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-fill': 'rgb(var(--accent-fill) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        // The platform's own UI font: SF Pro on Apple devices (or wherever
        // it is installed), Segoe UI on Windows, Roboto on Android. No web
        // fonts (DESIGN.md, Type).
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro"', '"SF Pro Text"', '"Segoe UI"', 'system-ui', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        display: '-0.04em',
      },
      fontSize: {
        // Readability floor: nothing below 14px. Mono metadata sits at `meta`.
        meta: ['0.875rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.53' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        // Apple type scale: leading and tracking change with size (DESIGN.md).
        display: ['clamp(3.5rem, 11vw, 7.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '700' }],
        'title-1': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.028em', fontWeight: '600' }],
        'title-2': ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.022em', fontWeight: '600' }],
        'title-3': ['clamp(1.5rem, 2.6vw, 1.75rem)', { lineHeight: '1.18', letterSpacing: '-0.016em', fontWeight: '600' }],
        headline: ['clamp(1.1875rem, 1.8vw, 1.3125rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        callout: ['0.9375rem', { lineHeight: '1.47' }],
        caption: ['0.875rem', { lineHeight: '1.43', letterSpacing: '0.005em' }],
      },
      borderRadius: {
        card: '1.125rem',
        tile: '1.75rem',
      },
      boxShadow: {
        float: 'var(--shadow-float)',
      },
      maxWidth: {
        sheet: '90rem',
        content: '70rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'var(--spring)',
        'spring-bounce': 'var(--spring-bounce)',
      },
      transitionDuration: {
        spring: '480ms',
        'spring-bounce': '520ms',
      },
    },
  },
  plugins: [],
};
export default config;
