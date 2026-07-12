'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
};

/**
 * Scroll-triggered entrance. Adds `.is-visible` when the element enters the
 * viewport; the animation itself is pure CSS (see globals.css) and is
 * disabled entirely under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={clsx('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
