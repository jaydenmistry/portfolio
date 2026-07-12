import clsx from 'clsx';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import Tag from '@/components/Tag';
import { projects, type Project } from '@/lib/data';
import { ArrowUpRightIcon, GitHubIcon } from '@/components/icons';
import SpotrVisual from '@/components/visuals/SpotrVisual';
import TopologyMiniVisual from '@/components/visuals/TopologyMiniVisual';
import RaftVisual from '@/components/visuals/RaftVisual';
import ChatVisual from '@/components/visuals/ChatVisual';

const visuals = {
  spotr: SpotrVisual,
  topology: TopologyMiniVisual,
  raft: RaftVisual,
  chat: ChatVisual,
};

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const Visual = visuals[project.visual];
  return (
    <article
      className={clsx(
        'card group overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-line-bright hover:shadow-xl hover:shadow-black/30',
        featured ? 'grid lg:grid-cols-2' : 'flex h-full flex-col',
      )}
    >
      {/* Visual */}
      <div
        className={clsx(
          'relative border-line bg-carbon/50',
          featured ? 'order-last border-t lg:order-first lg:border-r lg:border-t-0' : 'border-b',
        )}
      >
        <Visual />
      </div>

      {/* Copy */}
      <div className={clsx('flex flex-col p-7', featured ? 'lg:p-10' : 'flex-1')}>
        <p className="section-label">
          <span className="text-ink-mute">{project.number}</span>
        </p>
        <h3
          className={clsx(
            'mt-4 font-display font-semibold tracking-tight text-ink',
            featured ? 'text-2xl md:text-3xl' : 'text-xl',
          )}
        >
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim md:text-base">{project.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-mute">{project.engineering}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-5 pt-7">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform duration-200 hover:translate-x-0.5"
            >
              Live site <ArrowUpRightIcon />
            </a>
          ) : null}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-ink"
            >
              <GitHubIcon width={16} height={16} /> Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [featured, ...rest] = projects;
  return (
    <section id="projects" className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <SectionHeader
        index="02"
        label="Projects"
        title="Selected Work"
        lede="Products and systems built with practical engineering depth."
      />

      <Reveal>
        <ProjectCard project={featured} featured />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {rest.map((project, i) => (
          <Reveal key={project.number} delay={i * 120}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
