'use client';

import { useEffect } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';
import { THEME_KEY } from '@/lib/theme';
import { applyTheme, useTheme } from '@/lib/use-theme';

/**
 * Light/dark switch. The icons swap in CSS off `data-theme`, so the right one
 * shows before hydration; `aria-pressed` follows once the client reads it.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();

  // Follow a choice made in another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) applyTheme(e.newValue === 'dark' ? 'dark' : 'light');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-animate');
    applyTheme(next, { animate: true });
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked; the choice still applies to this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={theme === 'dark'}
      className={`theme-toggle flex items-center justify-center text-graphite transition-colors hover:bg-sheet ${className ?? ''}`}
    >
      <MoonIcon className="theme-icon-moon" />
      <SunIcon className="theme-icon-sun" />
    </button>
  );
}
