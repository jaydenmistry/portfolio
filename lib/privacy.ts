import { site } from '@/lib/data';

/**
 * Facts the privacy page depends on. Change these, and the page copy in
 * app/privacy/page.tsx, whenever the site's services or practices change.
 */
export const privacy = {
  // Update on release so it matches the date the notice goes live.
  effectiveDate: 'September 24, 2026',
  contactEmail: site.email,
  links: {
    formspree: 'https://formspree.io/legal/privacy-policy/',
    calendly: 'https://calendly.com/legal/privacy-notice',
    cloudflare: 'https://www.cloudflare.com/privacypolicy/',
  },
};
