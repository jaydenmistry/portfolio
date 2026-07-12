'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { navItems, site } from '@/lib/data';
import { CloseIcon, MenuIcon } from '@/components/icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view to highlight the matching nav item.
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

  // Close the mobile menu on escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || menuOpen
          ? 'border-b border-line bg-carbon/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-content items-center justify-between px-5 md:px-8"
      >
        <a
          href="#home"
          className="group flex items-center gap-3 font-mono text-sm font-semibold text-ink"
          aria-label={`${site.name} — back to top`}
        >
          <span className="text-accent">
            JM<span className="cursor-blink">_</span>
          </span>
          <span className="hidden items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-normal text-ink-dim lg:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
            {site.availability}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={clsx(
                  'rounded-md px-3 py-2 text-sm transition-colors duration-200',
                  active === item.href ? 'text-accent' : 'text-ink-dim hover:text-ink',
                )}
                aria-current={active === item.href ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.resumePath} download className="btn-secondary ml-2 !px-4 !py-2">
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="btn-ghost md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {menuOpen ? (
        <div id="mobile-menu" className="border-t border-line bg-carbon/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto max-w-content space-y-1 px-5 py-4">
            <li className="flex items-center gap-2 px-3 pb-3 font-mono text-xs text-ink-dim">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              {site.availability}
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'block rounded-md px-3 py-3 text-base',
                    active === item.href ? 'bg-panel text-accent' : 'text-ink-dim hover:bg-panel hover:text-ink',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href={site.resumePath} download className="btn-secondary w-full">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
