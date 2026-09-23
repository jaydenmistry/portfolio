/**
 * Optional dark theme. Light is the default; a visitor's explicit choice is
 * stored under `THEME_KEY` and applied by `themeScript` before first paint.
 * CSS tokens live in app/globals.css. These hex values are for the few
 * places that need colors in JS: the browser theme-color and Calendly.
 */
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export const themePalette: Record<Theme, { paper: string; graphite: string; signalInk: string }> = {
  light: { paper: '#F3F0E8', graphite: '#16181D', signalInk: '#B23E0C' },
  dark: { paper: '#1C1B19', graphite: '#EDE8DD', signalInk: '#EE6D35' },
};

/** Runs inline in <head> so a saved dark choice applies before first paint. */
export const themeScript = `(function(){try{if(localStorage.getItem('${THEME_KEY}')==='dark'){document.documentElement.dataset.theme='dark';document.addEventListener('DOMContentLoaded',function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','${themePalette.dark.paper}');});}}catch(e){}})();`;
