/**
 * Light and dark themes. The site follows the operating system unless the
 * visitor pins Light or Dark, which is stored under `THEME_KEY` and applied
 * by `themeScript` before first paint. CSS tokens live in app/globals.css.
 * These hex values are for the few places that need colors in JS: the
 * browser theme-color and Calendly.
 */
export type Theme = 'light' | 'dark';
export type ThemePreference = 'system' | Theme;

export const THEME_KEY = 'theme';

export const themePalette: Record<Theme, { background: string; surface: string; label: string; accent: string }> = {
  light: { background: '#FFFFFF', surface: '#F5F5F7', label: '#1D1D1F', accent: '#0066CC' },
  dark: { background: '#000000', surface: '#161617', label: '#F5F5F7', accent: '#2997FF' },
};

/**
 * Runs inline in <head>. Sets `data-theme` (what is shown) and
 * `data-theme-pref` (what was chosen) on <html> before first paint. A pinned
 * theme also overrides the OS-based theme-color meta tags once they exist.
 */
export const themeScript = `(function(){var d=document.documentElement,p;try{p=localStorage.getItem('${THEME_KEY}')}catch(e){}if(p!=='light'&&p!=='dark')p='system';var t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;d.dataset.theme=t;d.dataset.themePref=p;if(p!=='system')document.addEventListener('DOMContentLoaded',function(){var c=t==='dark'?'${themePalette.dark.background}':'${themePalette.light.background}';document.querySelectorAll('meta[name="theme-color"]').forEach(function(e){e.setAttribute('content',c)})})})();`;
