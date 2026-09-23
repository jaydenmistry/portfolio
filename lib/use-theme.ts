'use client';

import { useSyncExternalStore } from 'react';
import { themePalette, type Theme } from '@/lib/theme';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The active theme. Server render and hydration see `light`, then the real value. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}

export function getTheme(): Theme {
  return readTheme();
}

/** Switch themes without every element running its own color transition. */
export function applyTheme(next: Theme, { animate = false } = {}) {
  const root = document.documentElement;
  const commit = () => {
    root.classList.add('theme-switching');
    if (next === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themePalette[next].paper);
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animate && !reduce && document.startViewTransition) document.startViewTransition(commit);
  else commit();
}
