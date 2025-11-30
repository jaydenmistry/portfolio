export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
  links: {
    live?: string;
    repo: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: 'project-1',
    title: '<project 1 name>',
    description: '<one sentence: what it is + impact>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: [
      '<highlight: perf, scale, UX, etc.>',
      '<highlight: interesting technical detail>',
      '<highlight: measurable outcome if possible>',
    ],
    links: {
      live: 'https://<live-url>',
      repo: 'https://github.com/jay6145/docker',
    },
  },
  {
    slug: 'project-2',
    title: '<project 2 name>',
    description: '<one sentence: what it is + why it matters>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: ['<highlight>', '<highlight>', '<highlight>'],
    links: {
      repo: 'https://github.com/jay6145/portfolio',
    },
  },
  {
    slug: 'project-3',
    title: '<project 3 name>',
    description: '<one sentence: what it is + why it matters>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: ['<highlight>', '<highlight>', '<highlight>'],
    links: {
      repo: 'https://github.com/jay6145/portfolio',
    },
  },
  {
    slug: 'project-4',
    title: '<project 4 name>',
    description: '<one sentence: what it is + why it matters>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: ['<highlight>', '<highlight>', '<highlight>'],
    links: {
      repo: 'https://github.com/jay6145/portfolio',
    },
  },
  {
    slug: 'project-5',
    title: '<project 5 name>',
    description: '<one sentence: what it is + why it matters>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: ['<highlight>', '<highlight>', '<highlight>'],
    links: {
      repo: 'https://github.com/jay6145/portfolio',
    },
  },
  {
    slug: 'project-6',
    title: '<project 6 name>',
    description: '<one sentence: what it is + why it matters>',
    stack: ['<tech>', '<tech>', '<tech>'],
    highlights: ['<highlight>', '<highlight>', '<highlight>'],
    links: {
      repo: 'https://github.com/jay6145/portfolio',
    },
  },
];

export const FEATURED_PROJECTS = PROJECTS.slice(0, 4);