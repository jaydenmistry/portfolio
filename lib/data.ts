/**
 * All site content lives here. Edit this file to update copy, projects,
 * skills, and experience. Never add a fact here that isn't true: the UI
 * omits any optional field that is left out.
 */

export const site = {
  name: 'Jayden Mistry',
  role: 'Software Engineer',
  location: 'Georgia, USA',
  email: 'jayden@jmistry.com',
  github: 'https://github.com/jaydenmistry',
  linkedin: 'https://www.linkedin.com/in/jayden-mistry',
  resumePath: '/resume.pdf', // drop your resume PDF into /public/resume.pdf
  availability: 'Open to software engineering internships',
  education: 'Computer Science, University of Georgia · December 2027',
  headline: 'I build full-stack products, and I run the infrastructure they ship on.',
  subhead:
    'I’m a CS student at UGA and co-founder of Spotr, a platform that helps dealerships find private-party vehicles. I also administer the production environment for Kappa Theta Pi, on Proxmox, Docker, Traefik and Authentik.',
} as const;

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const;

export type Project = {
  number: string;
  /** Anchor id of the section that tells this project's story. */
  id: string;
  title: string;
  /** Shorter title for the work index. */
  indexTitle: string;
  kind: string;
  summary: string;
  /** What I built, one fact per line. Taken from the project write-up. */
  built: string[];
  stack: string[];
  /** Condensed stack for the work index. */
  indexStack: string;
  /** Only facts I have. Missing fields are left out of the UI. */
  role?: string;
  timeline?: string;
  status?: string;
  live?: { href: string; label: string };
  repo?: string;
  /**
   * Screenshot slot. `src` stays empty until a real capture exists; set it to a
   * path under /public, e.g. '/spotr-pipeline.webp'. Captures are shown
   * in a 16:10 frame, cropped from the top if the ratio differs.
   */
  figure?: { number: string; src?: string; alt: string; caption: string };
};

/**
 * Order matters: software first, infrastructure last, matching the page.
 * The KV store and chat app have no public repo links yet, so none are set.
 */
export const projects: Project[] = [
  {
    number: '01',
    id: 'spotr',
    title: 'Spotr',
    indexTitle: 'Spotr: private-party vehicle intelligence',
    kind: 'Product, full-stack',
    summary:
      'A platform that helps dealerships discover, evaluate and manage private-party vehicle listings.',
    built: [
      'Aggregation and data workflows across multiple listing sources.',
      'A drag-and-drop acquisition pipeline for managing opportunities.',
      'Fit-scoring that ranks which listings are worth pursuing.',
      'Authentication with NextAuth and a Prisma data layer.',
      'A Dockerized production deployment on self-managed infrastructure.',
    ],
    stack: ['Next.js', 'TypeScript', 'React', 'Prisma', 'NextAuth', 'Docker', 'Tailwind CSS'],
    indexStack: 'Next.js · TypeScript · Prisma · Docker',
    role: 'Co-founder, software engineer',
    timeline: '2026 to present',
    live: { href: 'https://spotrcars.com', label: 'spotrcars.com' },
    figure: {
      number: '02',
      src: '/spotr-pipeline.webp',
      alt: 'Spotr acquisition pipeline board with New Leads, Contacted and Appraisal columns of vehicle listings',
      caption: 'The drag-and-drop acquisition pipeline.',
    },
  },
  {
    number: '02',
    id: 'kv-store',
    title: 'Distributed key-value store',
    indexTitle: 'Distributed key-value store',
    kind: 'Systems',
    summary:
      'A systems project exploring durability, fault injection, replication, and the tradeoffs behind reliable storage.',
    built: [
      'Written in Go, with write-ahead-log persistence for crash durability.',
      'Deployed across LXC containers on a self-managed Proxmox cluster.',
      'Verified through fault-injection testing: forced node kills and unclean shutdowns.',
      'Raft leader election and log replication are in progress.',
    ],
    stack: ['Go', 'Raft', 'Proxmox', 'LXC'],
    indexStack: 'Go · write-ahead log · Raft',
    status: 'Raft in progress',
  },
  {
    number: '03',
    id: 'chat',
    title: 'Real-time chat platform',
    indexTitle: 'Real-time chat platform',
    kind: 'Full-stack',
    summary:
      'A full-stack messaging application with bidirectional communication and persistent chat workflows.',
    built: [
      'A Node.js and Express backend with Socket.IO for real-time, bidirectional messaging.',
      'REST APIs, authentication and room management.',
      'Message persistence behind a React interface.',
    ],
    stack: ['Node.js', 'Express', 'Socket.IO', 'React', 'REST APIs', 'WebSockets'],
    indexStack: 'Node.js · Express · Socket.IO · React',
  },
  {
    number: '04',
    id: 'infrastructure',
    title: 'Kappa Theta Pi production infrastructure',
    indexTitle: 'Kappa Theta Pi production infrastructure',
    kind: 'Infrastructure',
    summary:
      'Administering a real service environment supporting web properties, authentication, documentation, game servers, and internal tools.',
    built: [
      'Proxmox virtualization with LXC-provisioned services.',
      'Dockerized applications routed through a Traefik reverse proxy.',
      'Centralized single sign-on with Authentik.',
      'Firewall hardening and SSH-key-only access.',
      'Hands-on deployment and operational troubleshooting.',
    ],
    stack: ['Proxmox', 'LXC', 'Docker', 'Traefik', 'Authentik', 'Linux', 'Networking'],
    indexStack: 'Proxmox · Docker · Traefik · Authentik',
    role: 'Infrastructure administrator',
    timeline: 'Aug 2025 to present',
  },
];

export type TopologyNode = {
  id: string;
  label: string;
  /** Short label shown under the name in the diagram. */
  sub: string;
  description: string;
  /** Center position on the desktop diagram, percentage coordinates. */
  x: number;
  y: number;
};

export const topologyNodes: TopologyNode[] = [
  { id: 'users', label: 'Users', sub: 'members, public', description: 'Traffic from members and the public arriving over the internet.', x: 8, y: 50 },
  { id: 'traefik', label: 'Traefik', sub: 'routing, TLS', description: 'Reverse proxy and routing layer for external services, with automatic TLS.', x: 25, y: 50 },
  { id: 'auth', label: 'Authentik', sub: 'single sign-on', description: 'Centralized access control and single sign-on across all hosted services.', x: 47, y: 15 },
  { id: 'docker', label: 'Docker apps', sub: 'sites, docs, tools', description: 'Consistent application packaging and deployment for hosted services.', x: 47, y: 50 },
  { id: 'internal', label: 'Internal tools', sub: 'deploy tooling, docs', description: 'Deployment tooling, documentation, and utilities the organization relies on.', x: 25, y: 85 },
  { id: 'monitoring', label: 'Monitoring', sub: 'service health', description: 'Visibility into service health and operational behavior.', x: 47, y: 85 },
  { id: 'lxc', label: 'LXC services', sub: 'isolated workloads', description: 'Lightweight containers used for isolated service provisioning.', x: 70, y: 30 },
  { id: 'db', label: 'Databases', sub: 'persistent storage', description: 'Persistent storage backing applications and internal tooling.', x: 70, y: 70 },
  { id: 'proxmox', label: 'Proxmox host', sub: 'Atlanta datacenter', description: 'Virtualization layer for isolated, manageable workloads in an Atlanta datacenter.', x: 90, y: 50 },
];

/**
 * Edges between topology nodes, by id. `active` edges carry request traffic
 * and are drawn in the signal color. `via` is the x (percent) of the vertical
 * run for an elbow route, so parallel routes don't overlap. `route` overrides
 * the path entirely, in percent coordinates.
 */
export const topologyEdges: { from: string; to: string; active?: boolean; via?: number; route?: string }[] = [
  { from: 'users', to: 'traefik', active: true },
  { from: 'traefik', to: 'auth', active: true, via: 36 },
  { from: 'traefik', to: 'docker', active: true },
  { from: 'traefik', to: 'internal' },
  { from: 'monitoring', to: 'docker' },
  { from: 'monitoring', to: 'internal' },
  { from: 'docker', to: 'lxc', via: 58 },
  { from: 'docker', to: 'db', active: true, via: 58 },
  { from: 'auth', to: 'lxc', via: 63 },
  { from: 'internal', to: 'db', route: 'M25 85 V96 H63 V70 H70' },
  { from: 'lxc', to: 'proxmox', via: 80 },
  { from: 'db', to: 'proxmox', via: 80 },
];

export type SkillGroup = {
  id: string;
  label: string;
  blurb: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    blurb: 'TypeScript and Go for most new work; Python for automation and data tasks.',
    items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'Bash'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'I build interfaces that stay fast and readable — React with Next.js, styled with Tailwind.',
    items: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    label: 'Backend',
    blurb: 'APIs and services designed around clear contracts, authentication, and predictable data flows.',
    items: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'Prisma', 'FastAPI'],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    blurb: 'I use containerized workflows to make services portable, repeatable, and easier to operate.',
    items: ['Docker', 'Proxmox', 'Linux', 'LXC', 'Traefik', 'Dokploy', 'Nginx'],
  },
  {
    id: 'data',
    label: 'Data',
    blurb: 'Relational-first: schemas managed through Prisma migrations, tuned for the access patterns that matter.',
    items: ['PostgreSQL', 'SQLite', 'MySQL', 'Prisma', 'MongoDB'],
  },
  {
    id: 'practices',
    label: 'Practices',
    blurb: 'Version control, CI/CD, security hardening, and observability as defaults — not afterthoughts.',
    items: ['Git', 'GitHub Actions', 'CI/CD', 'Networking', 'Security Hardening', 'Observability', 'System Design'],
  },
];

export type ExperienceItem = {
  org: string;
  role: string;
  location: string;
  dates: string; // editable placeholder-friendly
  body: string;
};

export const experience: ExperienceItem[] = [
  {
    org: 'Spotr',
    role: 'Co-Founder / Software Engineer',
    location: 'Remote',
    dates: '2026 to present',
    body: 'Building a full-stack platform that helps dealerships find and manage private-party vehicle opportunities, combining product development, data workflows, and deployment infrastructure.',
  },
  {
    org: 'Kappa Theta Pi',
    role: 'Infrastructure Administrator',
    location: 'Atlanta, GA / Remote',
    dates: 'Aug 2025 to present',
    body: 'Administered a Proxmox-based environment supporting organizational websites, documentation, authentication, internal tools, and game-server infrastructure. Provisioned LXC services, deployed containerized applications behind Traefik, strengthened access controls, and improved operational reliability through hands-on system administration.',
  },
  {
    org: 'University of Georgia',
    role: 'B.S. Computer Science',
    location: 'Athens, GA',
    dates: 'Expected December 2027',
    body: 'Pursuing a Computer Science degree while developing practical depth in systems, infrastructure, backend engineering, and full-stack software development.',
  },
];

export const contact = {
  calendlyUrl: 'https://calendly.com/jaydenmistry',
  headline: 'Get in touch',
  body: 'I’m looking for a software engineering internship. Email is the fastest way to reach me, or use the form.',
  /**
   * Formspree form ID (the tail of https://formspree.io/f/<id>). Form IDs are
   * public, so the default is baked in; NEXT_PUBLIC_FORMSPREE_ID overrides it
   * at build time. If both are empty the form falls back to composing an
   * email in the visitor's mail client.
   */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'xwvgkeda',
};
