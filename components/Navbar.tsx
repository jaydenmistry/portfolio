'use client';

import { useEffect, useRef, useState } from 'react';
import { navItems, site } from '@/lib/data';
import { CloseIcon, MenuIcon } from '@/components/icons';
import ThemeToggle from '@/components/ThemeToggle';
import { resumeEvent } from '@/lib/analytics';

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

  useEffect(() => {
    if (!menuOpen) return;
    // Escape closes the menu and puts focus back on the button that opened it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-sheet items-center justify-between px-5 md:px-12 xl:px-24">
        <a href="#top" className="text-base font-semibold tracking-[-0.01em] text-graphite no-underline">
          {site.name}
        </a>

        <div className="flex items-center gap-1 md:gap-6">
          <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="ulink text-[0.9375rem] text-graphite"
                  aria-current={active === item.href ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={site.resumePath} className="btn-line h-10 px-4" {...resumeEvent('nav')}>
                Résumé
              </a>
            </li>
          </ul>

          <ThemeToggle className="h-11 w-11 md:-mr-2.5 md:h-10 md:w-10" />

          <button
            ref={menuButton}
            type="button"
            className="-mr-3 flex h-11 w-11 items-center justify-center text-graphite md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div id="mobile-menu" className="menu-enter border-t border-rule bg-paper md:hidden">
          <ul className="m-0 list-none px-5 py-2">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-12 items-center text-base text-graphite no-underline"
                  aria-current={active === item.href ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.resumePath}
                className="flex h-12 items-center text-base text-graphite no-underline"
                {...resumeEvent('mobile-menu')}
              >
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
