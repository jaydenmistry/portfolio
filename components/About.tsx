import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import { principles } from '@/lib/data';
import { LayersIcon, ShieldIcon, TerminalIcon } from '@/components/icons';

const icons = {
  layers: LayersIcon,
  shield: ShieldIcon,
  terminal: TerminalIcon,
};

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <SectionHeader
        index="01"
        label="Technical Profile"
        title="Engineering with ownership."
        lede="I enjoy building systems that do more than demo well. Whether I’m developing a product feature, designing an API, deploying a service, or troubleshooting an infrastructure issue, I care about reliability, clarity, security, and the people who depend on the system."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {principles.map((principle, i) => {
          const Icon = icons[principle.icon];
          return (
            <Reveal key={principle.title} delay={i * 120}>
              <article className="card group h-full p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-line-bright">
                <div className="mb-6 inline-flex rounded-lg border border-line bg-panel p-3 text-accent transition-colors duration-300 group-hover:border-accent/40">
                  <Icon />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{principle.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
