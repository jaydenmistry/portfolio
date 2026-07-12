import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import Tag from '@/components/Tag';
import { skillGroups } from '@/lib/data';

/** Subtle constellation backdrop — decorative only. */
function Constellation() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="#2a3348" strokeWidth="1">
        <path d="M120 90 L 300 160 L 520 110 L 700 190" />
        <path d="M90 330 L 260 400 L 470 350 L 690 420" />
        <path d="M300 160 L 260 400 M520 110 L 470 350" />
      </g>
      <g fill="#54c1ff">
        {[
          [120, 90],
          [300, 160],
          [520, 110],
          [700, 190],
          [90, 330],
          [260, 400],
          [470, 350],
          [690, 420],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" className="drift" style={{ '--drift-delay': `${-i * 2}s` } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

export default function Skills() {
  return (
    <section id="stack" className="relative overflow-hidden">
      <Constellation />
      <div className="relative mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <SectionHeader
          index="05"
          label="Stack"
          title="My engineering stack."
          lede="Tools chosen for how they behave in production, not just how they demo. Each group is something I use, not something I list."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={(i % 3) * 100}>
              <article className="card group h-full p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40">
                <h3 className="flex items-baseline justify-between font-display text-lg font-semibold text-ink">
                  {group.label}
                  <span className="font-mono text-[11px] font-normal text-ink-mute transition-colors group-hover:text-accent">
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </h3>
                <p className="mt-2 min-h-[3.5rem] text-sm leading-relaxed text-ink-dim">{group.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
