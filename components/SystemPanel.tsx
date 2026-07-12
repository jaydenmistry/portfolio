'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { systemPanel } from '@/lib/data';

/**
 * Operational status panel in the hero. Lines reveal one by one with a
 * terminal cursor; under reduced motion everything renders immediately.
 */
export default function SystemPanel() {
  const [visibleLines, setVisibleLines] = useState(0);
  const done = visibleLines >= systemPanel.length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleLines(systemPanel.length);
      return;
    }
    let line = 0;
    const interval = setInterval(() => {
      line += 1;
      setVisibleLines(line);
      if (line >= systemPanel.length) clearInterval(interval);
    }, 260);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className="card relative overflow-hidden bg-raised/80 p-6 font-mono text-sm shadow-2xl shadow-black/40 backdrop-blur-sm"
      role="figure"
      aria-label="System status panel summarizing Jayden Mistry's engineering profile"
    >
      {/* Window chrome */}
      <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-dim">system_status</span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
          <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
        </span>
      </div>

      <dl className="space-y-2.5">
        {systemPanel.map((line, i) => (
          <div
            key={line.key}
            className={clsx(
              'flex items-baseline gap-3 transition-opacity duration-300',
              i < visibleLines ? 'opacity-100' : 'opacity-0',
            )}
          >
            <dt className="w-28 shrink-0 text-ink-mute">{line.key}</dt>
            <dd className="flex items-center gap-2 text-ink">
              {'status' in line && line.status === 'ok' ? (
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              ) : null}
              {line.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-ink-mute" aria-hidden>
        <span className="text-accent">❯</span>
        {done ? (
          <span>
            ready<span className="cursor-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" />
          </span>
        ) : (
          <span className="cursor-blink inline-block h-4 w-2 translate-y-0.5 bg-accent" />
        )}
      </p>
    </div>
  );
}
