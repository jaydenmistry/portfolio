import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { privacy } from '@/lib/privacy';
import { site } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy | Jayden Mistry',
  description: 'What information jmistry.com collects, which services process it, and how to reach me about it.',
  alternates: { canonical: '/privacy' },
};

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="link" href={href}>
      {children}
    </a>
  );
}

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'contact-form',
    title: 'Contact form',
    body: (
      <>
        <p>
          When you send a message, your name, email address and message go to{' '}
          <External href={privacy.links.formspree}>Formspree</External>, which delivers them to my email. Like any
          web request, Formspree also receives technical details such as your IP address and browser. I use what you
          send to reply to you.
        </p>
      </>
    ),
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    body: (
      <>
        <p>
          This site uses Calendly to book meetings. When you scroll near the Contact section, the page loads
          Calendly&apos;s scheduler from calendly.com. Calendly collects the details you enter to book, and certain
          other information, as described in{' '}
          <External href={privacy.links.calendly}>Calendly&apos;s Privacy Notice</External>.
        </p>
        <p>
          Calendly sets cookies. Use the cookie banner or the Cookie settings link inside the scheduler to decline
          optional Calendly cookies. You can also email me instead of using the scheduler.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: 'Analytics',
    body: (
      <>
        <p>
          I use Umami, an analytics tool I host on a server I run, to count visits. It records the page address and
          title, the referring site, your screen size and browser language. It also records clicks on the résumé
          and project source links. From the request itself it sees your IP address and browser details, which it
          uses to derive the browser, operating system, device type and approximate location.
        </p>
        <p>
          Umami does not use cookies or store anything in your browser. As configured here, it combines your IP
          address and browser details into a visitor identifier that changes each month, and does not save the IP
          address in its database.
        </p>
      </>
    ),
  },
  {
    id: 'delivery',
    title: 'Delivery and security',
    body: (
      <p>
        <External href={privacy.links.cloudflare}>Cloudflare</External> delivers this site and protects it from
        abuse, so it processes every request, including your IP address. Cloudflare also hides the email addresses
        on this page from spam bots, using a small script that reveals them in your browser.
      </p>
    ),
  },
  {
    id: 'browser-storage',
    title: 'Stored in your browser',
    body: (
      <p>
        The site follows your device&apos;s light or dark setting. If you choose Light or Dark instead, it saves
        that choice in your browser&apos;s local storage under the name{' '}
        <code className="font-mono text-[0.9375rem] text-label">theme</code>. It never leaves your device. Choosing
        System, or clearing this site&apos;s data in your browser, removes it.
      </p>
    ),
  },
  {
    id: 'requests',
    title: 'Your requests',
    body: (
      <p>
        To ask what information I have about you from the contact form or scheduler, or to have it corrected or
        deleted, email <External href={`mailto:${privacy.contactEmail}`}>{privacy.contactEmail}</External>.
        Depending on where you live, you may have other rights under local law.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header id="top" className="sticky top-0 z-50">
        <div className="material relative">
          <nav aria-label="Primary" className="container-content flex h-[3.25rem] items-center justify-between">
            <Link href="/" className="press -mx-2 hidden rounded-full px-2 py-1.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-label no-underline sm:block">
              {site.name}
            </Link>
            <div className="flex flex-1 items-center justify-between gap-4 sm:flex-none">
              <Link href="/" className="link-chevron text-callout">
                Back to home
              </Link>
              <ThemeSwitcher />
            </div>
          </nav>
          <span aria-hidden className="nav-edge pointer-events-none absolute inset-x-0 bottom-0 h-px bg-separator" />
        </div>
      </header>

      <main id="main" className="container-content flex flex-col gap-12 pb-28 pt-16 md:gap-16 md:pb-40 md:pt-28">
        <div className="hero-in flex max-w-3xl flex-col gap-5">
          <p className="m-0 text-headline font-semibold text-accent">Privacy notice</p>
          <h1 className="m-0 text-title-1 text-label">Privacy</h1>
          <p className="m-0 text-pretty text-headline text-label-2">
            This is my personal portfolio. This page explains what information the site collects, which services
            handle it, and how to reach me about it.
          </p>
          <p className="m-0 text-callout text-label-2">Effective {privacy.effectiveDate}</p>
        </div>

        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {sections.map((section) => (
            <li
              key={section.id}
              id={section.id}
              className="tile reveal grid gap-3 rounded-card p-7 md:p-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12"
            >
              <h2 className="m-0 text-headline font-semibold text-label">{section.title}</h2>
              <div className="flex max-w-[44rem] flex-col gap-4 text-body text-label-2 md:text-body-lg [&_p]:m-0">
                {section.body}
              </div>
            </li>
          ))}
        </ol>

        <p className="m-0 max-w-[44rem] text-callout text-label-2">
          If these practices change, I&apos;ll update this page and its effective date.
        </p>
      </main>
      <Footer />
    </>
  );
}
