import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import { privacy } from '@/lib/privacy';
import { site } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy | Jayden Mistry',
  description: 'What information jmistry.com collects, which services process it, and how to reach me about it.',
  alternates: { canonical: '/privacy' },
};

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="ulink text-graphite" href={href}>
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
        If you switch between light and dark mode, the site saves your choice in your browser&apos;s local storage
        under the name <code className="font-mono text-meta text-graphite">theme</code>. It never leaves your
        device. Clearing this site&apos;s data in your browser removes it.
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
      <header id="top" className="border-b border-rule bg-paper">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-sheet items-center justify-between px-5 md:px-12 xl:px-24"
        >
          <Link href="/" className="text-base font-semibold tracking-[-0.01em] text-graphite no-underline">
            {site.name}
          </Link>
          <div className="flex items-center gap-1 md:gap-6">
            <Link href="/" className="ulink text-[0.9375rem] text-graphite">
              Back to home
            </Link>
            <ThemeToggle className="h-11 w-11 -mr-3 md:-mr-2.5 md:h-10 md:w-10" />
          </div>
        </nav>
      </header>

      <main
        id="main"
        className="mx-auto flex max-w-sheet flex-col gap-10 px-5 pb-24 pt-10 md:gap-12 md:px-12 md:pb-32 md:pt-24 xl:px-24"
      >
        <p className="section-label m-0">
          <span>Privacy notice</span>
          <span aria-hidden className="flex-1 self-center border-t border-rule" />
        </p>
        <div className="flex flex-col gap-6">
          <h1 className="m-0 text-[2.75rem] font-semibold leading-[0.98] tracking-display text-graphite md:text-[4.5rem]">
            Privacy
          </h1>
          <p className="m-0 max-w-[40rem] text-body text-graphite-2 md:text-body-lg">
            This is my personal portfolio. This page explains what information the site collects, which services
            handle it, and how to reach me about it.
          </p>
          <p className="m-0 font-mono text-meta text-graphite-2">Effective {privacy.effectiveDate}</p>
        </div>

        <ol className="m-0 list-none border-b border-rule p-0">
          {sections.map((section) => (
            <li
              key={section.id}
              id={section.id}
              className="grid gap-3 border-t border-rule py-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[4.5rem] lg:py-9"
            >
              <h2 className="m-0 font-mono text-meta font-medium text-graphite">{section.title}</h2>
              <div className="flex max-w-[44rem] flex-col gap-4 text-body text-graphite-2 md:text-body-lg [&_p]:m-0">
                {section.body}
              </div>
            </li>
          ))}
        </ol>

        <p className="m-0 max-w-[44rem] font-mono text-meta text-graphite-2">
          If these practices change, I&apos;ll update this page and its effective date.
        </p>
      </main>
      <Footer />
    </>
  );
}
