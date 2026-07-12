'use client';

import { useEffect, useRef, useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import { experience } from '@/lib/data';

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  // Timeline line fills as the list scrolls through the viewport.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = list.getBoundingClientRect();
        const viewport = window.innerHeight;
        const total = rect.height + viewport * 0.4;
        const scrolled = viewport * 0.7 - rect.top;
        setProgress(Math.min(1, Math.max(0, scrolled / total)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="experience" className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="04" label="Experience" title="Experience in production-minded engineering." />

      <ol ref={listRef} className="relative ml-3 space-y-12 border-l border-line pl-8 md:ml-6 md:pl-12">
        {/* Progress line overlaying the static rail */}
        <div
          aria-hidden
          className="absolute -left-px top-0 w-px bg-accent transition-[height] duration-200 ease-out"
          style={{ height: `${progress * 100}%` }}
        />

        {experience.map((item, i) => (
          <Reveal as="li" key={item.org} delay={i * 100} className="relative">
            <span
              aria-hidden
              className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-carbon md:-left-[55px]"
            />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-xl font-semibold text-ink">{item.org}</h3>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{item.role}</span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-ink-mute">
              {item.dates} · {item.location}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-dim md:text-base">{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
