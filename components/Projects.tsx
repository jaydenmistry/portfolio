import CaseStudy from '@/components/CaseStudy';
import { projects } from '@/lib/data';

/** Software case studies. The infrastructure project has its own section. */
export default function Projects() {
  const software = projects.filter((p) => p.id !== 'infrastructure');
  return (
    <section aria-label="Selected work" className="flex flex-col gap-24 md:gap-32">
      {software.map((project, i) => (
        <CaseStudy
          key={project.id}
          project={project}
          total={projects.length}
          label={i === 0 ? { number: '02', name: 'Selected work' } : undefined}
          next={projects[projects.indexOf(project) + 1]}
        />
      ))}
    </section>
  );
}
