/**
 * All site content lives here. Edit this file to update copy, projects,
 * skills, experience, and metrics — no component changes required.
 */

export const site = {
  name: 'Jayden Mistry',
  role: 'Software Engineer / Infrastructure',
  location: 'Georgia, USA',
  email: 'jayden@jmistry.com',
  github: 'https://github.com/jaydenmistry',
  linkedin: 'https://www.linkedin.com/in/jayden-mistry',
  resumePath: '/resume.pdf', // drop your resume PDF into /public/resume.pdf
  availability: 'Open to Software Engineering Internships',
  headline: 'I build products, platforms, and the systems that keep them running.',
  subhead:
    'I’m Jayden Mistry, a Computer Science student at the University of Georgia focused on backend systems, full-stack products, and infrastructure engineering. I build software end to end — from user-facing applications to containerized deployments, reverse-proxy routing, authentication, and production operations.',
} as const;

export const systemPanel = [
  { key: 'Engineer', value: 'Jayden Mistry' },
  { key: 'Focus', value: 'Backend + Infrastructure' },
  { key: 'Environment', value: 'Production-minded' },
  { key: 'Stack', value: 'TypeScript · Go · Docker · Linux' },
  { key: 'Status', value: 'Building', status: 'ok' as const },
  { key: 'Uptime', value: '99.99% curiosity' },
  { key: 'Location', value: 'Georgia, USA' },
];

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
] as const;

export const principles = [
  {
    title: 'Build end to end',
    body: 'I work across product interfaces, backend services, deployment pipelines, and operational tooling.',
    icon: 'layers' as const,
  },
  {
    title: 'Design for reliability',
    body: 'I care about observability, secure defaults, recoverability, and systems that hold up outside a local development environment.',
    icon: 'shield' as const,
  },
  {
    title: 'Learn by operating',
    body: 'My homelab and infrastructure work let me learn through real deployments, failures, monitoring, and iteration.',
    icon: 'terminal' as const,
  },
];

export type Project = {
  number: string;
  title: string;
  summary: string;
  engineering: string;
  tags: string[];
  github?: string;
  live?: string;
  visual: 'spotr' | 'topology' | 'raft' | 'chat';
};

export const projects: Project[] = [
  {
    number: '01',
    title: 'Spotr — Private-Party Vehicle Intelligence',
    summary:
      'A platform that helps dealerships discover, evaluate, and manage private-party vehicle listings.',
    engineering:
      'Full-stack Next.js application with TypeScript, Prisma, and NextAuth: aggregation and data workflows across listing sources, a drag-and-drop acquisition pipeline, fit-scoring that ranks opportunities, and a Dockerized deployment to production on self-managed infrastructure.',
    tags: ['Next.js', 'TypeScript', 'React', 'Prisma', 'Docker', 'Tailwind CSS'],
    live: 'https://spotrcars.com',
    visual: 'spotr',
  },
  {
    number: '02',
    title: 'Production Infrastructure for Kappa Theta Pi',
    summary:
      'Administering a real service environment supporting web properties, authentication, documentation, game servers, and internal tools.',
    engineering:
      'Proxmox virtualization with LXC-provisioned services, Dockerized applications routed through a Traefik reverse proxy, centralized SSO with Authentik, firewall hardening, SSH-key-only access, and hands-on deployment and operational troubleshooting.',
    tags: ['Proxmox', 'LXC', 'Docker', 'Traefik', 'Authentik', 'Linux', 'Networking'],
    visual: 'topology',
  },
  {
    number: '03',
    title: 'Distributed Key-Value Store',
    summary:
      'A systems project exploring durability, fault injection, replication, and the tradeoffs behind reliable storage.',
    engineering:
      'Written in Go with write-ahead-log persistence for crash durability, deployed across LXC containers on a self-managed Proxmox cluster, and verified through fault-injection testing — forced node kills and unclean shutdowns. Raft leader election and log replication in progress.',
    tags: ['Go', 'Raft', 'Distributed Systems', 'Proxmox', 'LXC', 'Fault Tolerance'],
    github: 'https://github.com/jaydenmistry',
    visual: 'raft',
  },
  {
    number: '04',
    title: 'Real-Time Chat Platform',
    summary:
      'A full-stack messaging application with bidirectional communication and persistent chat workflows.',
    engineering:
      'Node.js and Express backend with Socket.IO for real-time bidirectional messaging, REST APIs, authentication, room management, and message persistence behind a React interface.',
    tags: ['Node.js', 'Express', 'Socket.IO', 'React', 'REST APIs', 'WebSockets'],
    github: 'https://github.com/jaydenmistry',
    visual: 'chat',
  },
];

export type TopologyNode = {
  id: string;
  label: string;
  description: string;
  kind: 'healthy' | 'routing' | 'managed' | 'support';
  /** Position on the desktop diagram, percentage coordinates. */
  x: number;
  y: number;
};

export const topologyNodes: TopologyNode[] = [
  {
    id: 'users',
    label: 'External Users',
    description: 'Traffic from members and the public arriving over the internet.',
    kind: 'support',
    x: 8,
    y: 50,
  },
  {
    id: 'traefik',
    label: 'Traefik',
    description: 'Reverse proxy and routing layer for external services, with automatic TLS.',
    kind: 'routing',
    x: 30,
    y: 50,
  },
  {
    id: 'auth',
    label: 'Authentik / SSO',
    description: 'Centralized access control and single sign-on across all hosted services.',
    kind: 'managed',
    x: 52,
    y: 16,
  },
  {
    id: 'docker',
    label: 'Docker Apps',
    description: 'Consistent application packaging and deployment for hosted services.',
    kind: 'healthy',
    x: 54,
    y: 50,
  },
  {
    id: 'internal',
    label: 'Internal Tools',
    description: 'Deployment tooling, documentation, and utilities the organization relies on.',
    kind: 'managed',
    x: 52,
    y: 84,
  },
  {
    id: 'lxc',
    label: 'LXC Services',
    description: 'Lightweight containers used for isolated service provisioning.',
    kind: 'healthy',
    x: 76,
    y: 30,
  },
  {
    id: 'db',
    label: 'Databases',
    description: 'Persistent storage backing applications and internal tooling.',
    kind: 'support',
    x: 76,
    y: 70,
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    description: 'Visibility into service health and operational behavior.',
    kind: 'routing',
    x: 30,
    y: 84,
  },
  {
    id: 'proxmox',
    label: 'Proxmox Host',
    description: 'Virtualization layer for isolated, manageable workloads in an Atlanta datacenter.',
    kind: 'managed',
    x: 93,
    y: 50,
  },
];

/** Edges between topology nodes, by id. Packets animate along active routes. */
export const topologyEdges: { from: string; to: string; active?: boolean }[] = [
  { from: 'users', to: 'traefik', active: true },
  { from: 'traefik', to: 'auth', active: true },
  { from: 'traefik', to: 'docker', active: true },
  { from: 'traefik', to: 'internal' },
  { from: 'docker', to: 'lxc' },
  { from: 'docker', to: 'db', active: true },
  { from: 'auth', to: 'lxc' },
  { from: 'internal', to: 'db' },
  { from: 'lxc', to: 'proxmox' },
  { from: 'db', to: 'proxmox' },
  { from: 'monitoring', to: 'docker', active: true },
  { from: 'monitoring', to: 'internal' },
];

export const solvingList = [
  'Turning manual deployments into repeatable workflows',
  'Debugging routing, DNS, certificates, and service connectivity',
  'Designing practical self-hosted infrastructure',
  'Improving security without making systems painful to use',
  'Building developer-friendly tooling and internal platforms',
  'Learning through real operations, incidents, and iterations',
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

export const metrics = [
  { value: '10+', label: 'services deployed', note: 'websites, docs, auth, game servers, tooling' },
  { value: '2', label: 'infrastructure environments', note: 'Atlanta datacenter + personal homelab' },
  { value: '20+', label: 'technologies in active use', note: 'across product and platform work' },
  { value: '4', label: 'projects shipped', note: 'full-stack, systems, and infrastructure' },
  { value: '99.99%', label: 'curiosity', note: 'the only uptime figure I’ll claim' },
  { value: '∞', label: 'always learning', note: 'currently: Raft consensus internals' },
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
    dates: '2026 — Present',
    body: 'Building a full-stack platform that helps dealerships find and manage private-party vehicle opportunities, combining product development, data workflows, and deployment infrastructure.',
  },
  {
    org: 'Kappa Theta Pi',
    role: 'Infrastructure Administrator',
    location: 'Atlanta, GA / Remote',
    dates: 'Aug 2025 — Present',
    body: 'Administered a Proxmox-based environment supporting organizational websites, documentation, authentication, internal tools, and game-server infrastructure. Provisioned LXC services, deployed containerized applications behind Traefik, strengthened access controls, and improved operational reliability through hands-on system administration.',
  },
  {
    org: 'University of Georgia',
    role: 'B.S. Computer Science',
    location: 'Athens, GA',
    dates: 'Expected May 2027',
    body: 'Pursuing a Computer Science degree while developing practical depth in systems, infrastructure, backend engineering, and full-stack software development.',
  },
];

export const contact = {
  headline: 'Let’s build something reliable.',
  body: 'I’m looking for opportunities to contribute to teams building thoughtful products, dependable platforms, and systems with real technical depth.',
  /**
   * Formspree form ID (the tail of https://formspree.io/f/<id>). Form IDs are
   * public, so the default is baked in; NEXT_PUBLIC_FORMSPREE_ID overrides it
   * at build time. If both are empty the form falls back to composing an
   * email in the visitor's mail client.
   */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'xwvgkeda',
};
