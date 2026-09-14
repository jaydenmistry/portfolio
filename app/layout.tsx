import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { site, experience } from '@/lib/data';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://jmistry.com'),
  title: 'Jayden Mistry | Software Engineer & Infrastructure Builder',
  description:
    'Portfolio of Jayden Mistry, a software engineer focused on full-stack products, backend systems, and production-minded infrastructure.',
  openGraph: {
    title: 'Jayden Mistry | Software Engineer & Infrastructure Builder',
    description: 'Full-stack products, backend systems, and production-minded infrastructure.',
    url: 'https://jmistry.com',
    siteName: 'Jayden Mistry',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jayden Mistry | Software Engineer & Infrastructure Builder',
    description: 'Full-stack products, backend systems, and production-minded infrastructure.',
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
  ...(education ? { alumniOf: { '@type': 'CollegeOrUniversity', name: education.org } } : {}),
};

export const viewport: Viewport = {
  themeColor: '#0b0e14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
        />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-carbon transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
