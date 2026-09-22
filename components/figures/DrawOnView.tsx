'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Adds `draw-armed` once JS runs, then `draw-go` when the element scrolls
 * into view. Without JS neither class is added and figures render drawn.
 */
export function useDrawOnView<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    el.classList.add('draw-armed');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('draw-go');
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);
  return ref;
}

export default function DrawOnView({
  as: Tag = 'div',
  label,
  className,
  children,
}: {
  as?: 'div' | 'ol';
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useDrawOnView<HTMLElement>();
  return (
    <Tag ref={ref as never} aria-label={label} className={className}>
      {children}
    </Tag>
  );
}
