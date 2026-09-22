import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { site, experience } from '@/lib/data';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jmistry.com'),
  title: 'Jayden Mistry | Software Engineer',
  description:
    'Jayden Mistry is a Computer Science student at the University of Georgia, graduating December 2027, who builds full-stack products and runs the infrastructure they ship on.',
  openGraph: {
    title: 'Jayden Mistry | Software Engineer',
    description: 'UGA Computer Science, December 2027. Full-stack products, and the infrastructure they ship on.',
    url: 'https://jmistry.com',
    siteName: 'Jayden Mistry',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jayden Mistry | Software Engineer',
    description: 'UGA Computer Science, December 2027. Full-stack products, and the infrastructure they ship on.',
  },
};

const education = experience.find(
  (item) => item.role.startsWith('B.S.') || /university|college/i.test(item.org)
);

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jmistry.com',
  email: site.email,
  homeLocation: site.location,
  sameAs: [site.github, site.linkedin],
  ...(education ? { affiliation: { '@type': 'CollegeOrUniversity', name: education.org } } : {}),
};

const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const viewport: Viewport = {
  themeColor: '#F3F0E8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
        />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-graphite px-4 py-3 text-[0.9375rem] font-medium text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        {umamiSrc && umamiWebsiteId ? (
          <Script
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            data-domains="jmistry.com"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
