import CaseStudy from '@/components/CaseStudy';
import SectionHeading from '@/components/SectionHeading';
import WorkOverview from '@/components/WorkOverview';
import { projects } from '@/lib/data';

/** Every project as a tile, then the software case studies in full. */
export default function Work() {
  const software = projects.filter((p) => p.id !== 'infrastructure');
  return (
    <section id="work" aria-labelledby="work-title" className="container-content flex scroll-mt-12 flex-col gap-10 md:gap-14">
      <SectionHeading id="work-title" title="Selected work" intro="Products, systems and the infrastructure they run on." />
      <WorkOverview />
      <div className="flex flex-col gap-28 pt-16 md:gap-40 md:pt-24">
        {software.map((project) => (
          <CaseStudy key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
