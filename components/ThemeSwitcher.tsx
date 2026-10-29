'use client';

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import clsx from 'clsx';
import { MoonIcon, SunIcon, SystemIcon } from '@/components/icons';
import type { ThemePreference } from '@/lib/theme';
import { applyPreference, savePreference, useThemePreference, watchTheme } from '@/lib/use-theme';

const options: { value: ThemePreference; label: string; Icon: typeof SunIcon }[] = [
  { value: 'system', label: 'System', Icon: SystemIcon },
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
];

/**
 * System / Light / Dark segmented control. The thumb's position comes from
 * `data-theme-pref` in CSS, so it is right before hydration; `aria-checked`
 * follows once the client reads the preference.
 */
export default function ThemeSwitcher({ size = 'sm', className }: { size?: 'sm' | 'lg'; className?: string }) {
  const pref = useThemePreference();
  const group = useRef<HTMLDivElement>(null);

  useEffect(() => watchTheme(), []);

  function choose(value: ThemePreference, origin?: HTMLElement | null) {
    const rect = origin?.getBoundingClientRect();
    savePreference(value);
    applyPreference(value, rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
  }

  function onClick(value: ThemePreference, e: MouseEvent<HTMLButtonElement>) {
    if (value !== pref) choose(value, e.currentTarget);
  }

  // Radio-group keys: arrows move the choice, and focus follows it.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const index = options.findIndex((o) => o.value === pref);
    const next = options[(index + step + options.length) % options.length];
    const button = group.current?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`);
    button?.focus();
    choose(next.value, button);
  }

  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={onKeyDown}
      className={clsx('theme-switcher relative grid grid-cols-3 rounded-full bg-fill p-[3px]', className)}
    >
      <span aria-hidden className="theme-thumb absolute bottom-[3px] left-[3px] top-[3px] w-[calc((100%-6px)/3)] rounded-full bg-elevated shadow-[0_1px_4px_rgb(0_0_0/0.14)]" />
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          data-value={value}
          aria-checked={pref === value}
          aria-label={label}
          title={label}
          tabIndex={pref === value ? 0 : -1}
          onClick={(e) => onClick(value, e)}
          className={clsx(
            'press relative z-10 flex items-center justify-center rounded-full text-label-2 transition-colors duration-200 aria-checked:text-label',
            size === 'sm' ? 'h-8 w-9' : 'h-11 w-full',
          )}
        >
          <Icon width={size === 'sm' ? 17 : 20} height={size === 'sm' ? 17 : 20} />
        </button>
      ))}
    </div>
  );
}
