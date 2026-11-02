'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import clsx from 'clsx';

/**
 * A tile that links somewhere. It presses in on pointer-down, and with a
 * mouse a soft light follows the pointer across its surface, like light
 * catching a material.
 */
export default function SpotlightTile({
  href,
  className,
  children,
  label,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);

  function onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${clientY - rect.top}px`);
    });
  }

  return (
    <a ref={ref} href={href} aria-label={label} onPointerMove={onPointerMove} className={clsx('tile tile-link spotlight', className)}>
      {children}
    </a>
  );
}
