import SectionHeading from '@/components/SectionHeading';
import { Chips } from '@/components/WorkOverview';
import { experience, skillGroups } from '@/lib/data';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="container-content flex scroll-mt-12 flex-col gap-10 md:gap-14">
      <SectionHeading id="experience-title" title="Experience" />

      {/* A timeline whose line grows as you scroll down it. */}
      <ol className="relative m-0 flex list-none flex-col p-0">
        <span aria-hidden className="timeline-line absolute bottom-3 left-[0.3125rem] top-3 w-0.5 rounded-full bg-separator lg:left-[16.3125rem]" />
        {experience.map((item) => (
          <li key={item.org} className="reveal relative grid gap-2 pb-12 pl-9 last:pb-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-0 lg:pl-0 lg:pb-16">
            <span aria-hidden className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-accent bg-background lg:left-[16rem]" />
            <p className="m-0 text-callout text-label-2 lg:pr-10 lg:pt-1 lg:text-right">
              {item.dates}
              <span className="block">{item.location}</span>
            </p>
            <div className="flex flex-col gap-1.5 lg:pl-12">
              <h3 className="m-0 text-title-2 text-label">{item.org}</h3>
              <p className="m-0 text-headline font-medium text-label">{item.role}</p>
              <p className="m-0 mt-2 max-w-[44rem] text-pretty text-body text-label-2 md:text-body-lg">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-6 pt-6">
        <h3 className="reveal m-0 text-title-3 text-label">Tools I use</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.id} className="tile reveal flex flex-col gap-4 rounded-card p-6 md:p-7">
              <div className="flex flex-col gap-1.5">
                <h4 className="m-0 text-headline font-semibold text-label">{group.label}</h4>
                <p className="m-0 text-callout text-label-2">{group.blurb}</p>
              </div>
              <Chips items={group.items} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
