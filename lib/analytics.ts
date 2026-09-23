/**
 * Umami click events, sent through Umami's data attributes so no tracking
 * code runs until the tracker loads. Names are kebab-case `<thing>-click`;
 * the extra attribute records where or what was clicked. These count clicks
 * only; they say nothing about who clicked.
 */
export type ResumeLocation = 'nav' | 'mobile-menu' | 'hero' | 'contact';

export const resumeEvent = (location: ResumeLocation) => ({
  'data-umami-event': 'resume-click',
  'data-umami-event-location': location,
});

export const repoEvent = (project: string) => ({
  'data-umami-event': 'project-repo-click',
  'data-umami-event-project': project,
});
