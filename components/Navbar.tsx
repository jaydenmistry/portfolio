'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { navItems, site } from '@/lib/data';
import { MenuIcon } from '@/components/icons';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import MenuSheet from '@/components/MenuSheet';
import { resumeEvent } from '@/lib/analytics';
import { spring } from '@/lib/motion';

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Mark the nav item whose section is in view.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // iOS Safari only applies :active (press feedback) once a touch listener exists.
  useEffect(() => {
    const noop = () => {};
    document.addEventListener('touchstart', noop, { passive: true });
    return () => document.removeEventListener('touchstart', noop);
  }, []);

  const closeMenu = useCallback(({ restoreFocus }: { restoreFocus: boolean }) => {
    setMenuOpen(false);
    if (restoreFocus) menuButton.current?.focus();
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="material relative">
        <nav aria-label="Primary" className="container-content flex h-[3.25rem] items-center justify-between">
          <a href="#top" className="press -mx-2 rounded-full px-2 py-1.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-label no-underline whitespace-nowrap">
            {site.name}
          </a>

          <div className="flex items-center gap-3">
            <ul className="m-0 hidden list-none items-center gap-0.5 p-0 lg:flex">
              {navItems.map((item) => {
                const current = active === item.href;
                return (
                  <li key={item.href} className="relative">
                    {current ? (
                      <m.span
                        layoutId="nav-active"
                        transition={spring}
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-fill"
                      />
                    ) : null}
                    <a
                      href={item.href}
                      aria-current={current ? 'true' : undefined}
                      className="press relative flex h-9 items-center rounded-full px-3.5 text-callout text-label no-underline"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <ThemeSwitcher className="hidden lg:grid" />

            <a href={site.resumePath} className="button-filled hidden min-h-9 px-4 lg:inline-flex" {...resumeEvent('nav')}>
              Résumé
            </a>

            <button
              ref={menuButton}
              type="button"
              className="press -mr-2.5 flex h-11 w-11 items-center justify-center rounded-full text-label lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
        {/* Scroll edge: a hairline that appears only once content is underneath. */}
        <span aria-hidden className="nav-edge pointer-events-none absolute inset-x-0 bottom-0 h-px bg-separator" />
      </div>

      <MenuSheet open={menuOpen} active={active} onClose={closeMenu} />
    </header>
  );
}
