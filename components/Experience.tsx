import SectionLabel from '@/components/SectionLabel';
import { experience, skillGroups } from '@/lib/data';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="flex scroll-mt-20 flex-col gap-10 md:gap-12">
      <SectionLabel number="04" name="Experience" id="experience-title" />

      <ol className="m-0 list-none border-b border-rule p-0">
        {experience.map((item) => (
          <li
            key={item.org}
            className="grid gap-3 border-t border-rule py-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[4.5rem] lg:py-9"
          >
            <p className="m-0 font-mono text-meta text-graphite-2">
              {item.dates}
              <span className="block">{item.location}</span>
            </p>
            <div className="flex flex-col gap-2">
              <h3 className="m-0 text-2xl font-semibold tracking-[-0.02em] text-graphite md:text-[1.75rem]">{item.org}</h3>
              <p className="m-0 text-base font-medium text-graphite">{item.role}</p>
              <p className="m-0 mt-2 max-w-[44rem] text-body text-graphite-2 md:text-body-lg">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[4.5rem]">
        <h3 className="m-0 font-mono text-meta font-medium text-graphite">Tools I use</h3>
        <dl className="m-0 grid gap-x-12 border-b border-rule sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1 border-t border-rule py-4">
              <dt className="font-mono text-meta text-graphite-2">{group.label}</dt>
              <dd className="m-0 text-base leading-relaxed text-graphite">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
