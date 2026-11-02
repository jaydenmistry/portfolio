'use client';

import { useSyncExternalStore } from 'react';
import { THEME_KEY, themePalette, type Theme, type ThemePreference } from '@/lib/theme';

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function readPreference(): ThemePreference {
  const pref = document.documentElement.dataset.themePref;
  return pref === 'light' || pref === 'dark' ? pref : 'system';
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-theme-pref'] });
  return () => observer.disconnect();
}

/** The theme on screen. Server render and hydration see `light`, then the real value. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}

/** The visitor's choice: System, Light or Dark. */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => 'system');
}

export function getTheme(): Theme {
  return readTheme();
}

export function resolve(pref: ThemePreference): Theme {
  if (pref !== 'system') return pref;
  return darkQuery().matches ? 'dark' : 'light';
}

function commit(pref: ThemePreference) {
  const root = document.documentElement;
  const next = resolve(pref);
  // Colors change at once, not element by element.
  root.classList.add('theme-switching');
  root.dataset.theme = next;
  root.dataset.themePref = pref;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', themePalette[next].background));
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

/**
 * Apply a preference. With `origin`, the new theme is revealed in a circle
 * that grows from that point, so the change visibly comes from the control
 * that caused it. Reduced motion switches instantly.
 */
export function applyPreference(pref: ThemePreference, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const changes = resolve(pref) !== readTheme();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!changes || reduce || !document.startViewTransition) {
    commit(pref);
    return;
  }
  const transition = document.startViewTransition(() => commit(pref));
  if (!origin) return;
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.classList.add('theme-reveal');
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove('theme-reveal'));
}

/** Store the choice; System removes the stored value. */
export function savePreference(pref: ThemePreference) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Storage can be blocked; the choice still applies to this page view.
  }
}

/** Keep the page in step with the OS setting and with other tabs. */
export function watchTheme() {
  const query = darkQuery();
  const onSystem = () => {
    if (readPreference() === 'system') applyPreference('system');
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY) return;
    applyPreference(e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : 'system');
  };
  query.addEventListener('change', onSystem);
  window.addEventListener('storage', onStorage);
  return () => {
    query.removeEventListener('change', onSystem);
    window.removeEventListener('storage', onStorage);
  };
}
