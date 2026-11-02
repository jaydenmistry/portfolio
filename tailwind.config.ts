import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple palette (see DESIGN.md). Values are CSS variables in
        // app/globals.css so the dark theme can swap them.
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
        // it is installed; see `SF Pro Local` in globals.css), Segoe UI on
        // Windows, Roboto on Android. No web fonts (DESIGN.md, Type).
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Local"', '"SF Pro Text"', '"Segoe UI"', 'system-ui', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Readability floor: nothing below 14px (`caption`).
        body: ['1.0625rem', { lineHeight: '1.53' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        // Apple type scale: leading and tracking change with size (DESIGN.md).
        display: ['clamp(3.5rem, 11vw, 7.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-1': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-2': ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.004em', fontWeight: '600' }],
        'title-3': ['clamp(1.5rem, 2.6vw, 1.75rem)', { lineHeight: '1.18', letterSpacing: '0', fontWeight: '600' }],
        headline: ['clamp(1.1875rem, 1.8vw, 1.3125rem)', { lineHeight: '1.3', letterSpacing: '0' }],
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
        content: '70rem',
      },
    },
  },
  plugins: [],
};
export default config;
