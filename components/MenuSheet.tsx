'use client';

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, animate, m, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { navItems, site } from '@/lib/data';
import { ChevronRightIcon, CloseIcon } from '@/components/icons';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { resumeEvent } from '@/lib/analytics';
import { project, rubberband, spring, springBounce } from '@/lib/motion';

type Props = {
  open: boolean;
  active: string | null;
  onClose: (options: { restoreFocus: boolean }) => void;
};

/**
 * The phone menu as a bottom sheet. It follows the finger 1:1 when dragged,
 * resists being pulled up, and on release goes wherever the flick projects
 * it: closed if that lands past half its height, otherwise back home.
 */
export default function MenuSheet({ open, active, onClose }: Props) {
  const sheet = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  // The scrim lightens as the sheet is pulled down: feedback during the drag.
  const scrimOpacity = useTransform(y, [0, 360], [1, 0]);

  useEffect(() => {
    if (!open) return;
    y.set(0);
    sheet.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose({ restoreFocus: true });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, y]);

  // Keep Tab inside the sheet while it is open.
  function trapFocus(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !sheet.current) return;
    const focusable = [...sheet.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onPan(_: PointerEvent, info: PanInfo) {
    const height = sheet.current?.offsetHeight ?? 400;
    const offset = info.offset.y;
    y.set(offset >= 0 ? offset : rubberband(offset, height));
  }

  function onPanEnd(_: PointerEvent, info: PanInfo) {
    const height = sheet.current?.offsetHeight ?? 400;
    const velocity = info.velocity.y;
    const resting = y.get() + project(velocity);
    if (resting > height / 2) {
      // Hand the finger's speed to the closing animation; no seam.
      animate(y, height + 24, { ...spring, velocity });
      onClose({ restoreFocus: false });
    } else {
      // Settling back after a flick earns a little bounce.
      animate(y, 0, { ...(Math.abs(velocity) > 300 ? springBounce : spring), velocity });
    }
  }

  return (
    <AnimatePresence>
      {open ? [
          <m.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 z-[60] touch-none lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => onClose({ restoreFocus: true })}
          >
            <m.div className="absolute inset-0 bg-[rgb(var(--scrim))]" style={{ opacity: scrimOpacity }} />
          </m.div>,

          <m.div
            key="sheet"
            ref={sheet}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={trapFocus}
            onPan={onPan}
            onPanEnd={onPanEnd}
            style={{ y }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            className="material-thick fixed inset-x-2 bottom-2 z-[70] touch-none lg:hidden rounded-[2rem] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 shadow-float"
          >
            <div aria-hidden className="mx-auto mb-1 h-[5px] w-9 rounded-full bg-label/25" />
            <div className="flex items-center justify-between">
              <p className="m-0 text-caption font-medium text-label-2">Menu</p>
              <button
                type="button"
                onClick={() => onClose({ restoreFocus: true })}
                aria-label="Close menu"
                className="press -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-label-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fill">
                  <CloseIcon width={16} height={16} strokeWidth={2.25} />
                </span>
              </button>
            </div>

            <ul className="m-0 list-none p-0">
              {navItems.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.04 * i }}
                  className="border-b border-separator/70 last:border-0"
                >
                  <a
                    href={item.href}
                    onClick={() => onClose({ restoreFocus: false })}
                    aria-current={active === item.href ? 'true' : undefined}
                    className="press flex h-14 items-center justify-between text-title-3 text-label no-underline"
                  >
                    {item.label}
                    <ChevronRightIcon className="text-label-2" width={18} height={18} />
                  </a>
                </m.li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-3">
              <a href={site.resumePath} className="button-filled w-full" {...resumeEvent('mobile-menu')}>
                Résumé (PDF)
              </a>
              <ThemeSwitcher size="lg" />
            </div>
          </m.div>,
        ] : null}
    </AnimatePresence>
  );
}
