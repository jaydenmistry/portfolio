import type { CSSProperties } from 'react';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import { metrics } from '@/lib/data';

/**
 * Deterministic pseudo-random bar heights so server and client render match.
 * Purely illustrative — labeled as such below the chart.
 */
const bars = Array.from({ length: 48 }, (_, i) => {
  const wave = Math.sin(i * 0.55) * 0.3 + Math.sin(i * 0.21 + 2) * 0.25;
  return Math.round(Math.min(100, Math.max(12, 52 + wave * 60 + ((i * 37) % 23) - 11)));
});

export default function Metrics() {
  return (
    <section className="border-y border-line bg-raised/40">
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <SectionHeader index="06" label="Metrics" title="Engineering, measured in ownership." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 80}>
              <div className="card group h-full p-6 transition-colors duration-300 hover:border-line-bright">
                <p className="font-display text-4xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                  {metric.value}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim">{metric.label}</p>
                <p className="mt-2 text-sm text-ink-mute">{metric.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <figure className="card p-6">
            <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Building, learning, and shipping.
              </span>
              <span className="font-mono text-[11px] text-ink-mute">
                illustrative activity — not live GitHub data
              </span>
            </figcaption>
            <div className="flex h-24 items-end gap-1" aria-hidden>
              {bars.map((height, i) => (
                <span
                  key={i}
                  className="bar-grow min-w-0 flex-1 rounded-sm bg-accent/60 transition-colors duration-200 hover:bg-accent"
                  style={{ height: `${height}%`, '--bar-delay': `${i * 18}ms` } as CSSProperties}
                />
              ))}
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
