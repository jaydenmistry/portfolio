'use client';

import { useState, type FormEvent } from 'react';
import SectionLabel from '@/components/SectionLabel';
import Scheduling from '@/components/Scheduling';
import { site, contact } from '@/lib/data';
import { resumeEvent } from '@/lib/analytics';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'w-full border border-graphite bg-sheet px-4 py-3 text-base text-graphite placeholder:text-graphite-2 focus:border-signal-ink';

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');

    // Without a Formspree ID, fall back to composing an email.
    if (!contact.formspreeId) {
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${contact.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="flex scroll-mt-20 flex-col gap-10 md:gap-12">
      <SectionLabel number="05" name="Contact" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[4.5rem]">
        <div className="flex flex-col gap-6">
          <h3
            id="contact-title"
            className="m-0 text-[2.75rem] font-semibold leading-[0.98] tracking-display text-graphite md:text-[4.5rem]"
          >
            {contact.headline}
          </h3>
          <p className="m-0 max-w-[36rem] text-body text-graphite-2 md:text-body-lg">{contact.body}</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-base md:text-lg">
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={site.linkedin}>
                LinkedIn
              </a>
            </li>
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={site.github}>
                GitHub
              </a>
            </li>
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={site.resumePath} {...resumeEvent('contact')}>
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="font-mono text-meta text-graphite">
              Name
            </label>
            <input id="contact-name" name="name" type="text" required autoComplete="name" className={field} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="font-mono text-meta text-graphite">
              Email
            </label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="font-mono text-meta text-graphite">
              Message
            </label>
            <textarea id="contact-message" name="message" required rows={5} className={`${field} resize-y`} />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button type="submit" className="btn-dark" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p role="status" className="m-0 text-[0.9375rem] text-graphite">
              {status === 'sent' ? 'Message sent. I’ll reply soon.' : null}
              {status === 'error' ? 'Something went wrong. Please email me directly.' : null}
            </p>
          </div>
        </form>
      </div>
      <Scheduling />
    </section>
  );
}
