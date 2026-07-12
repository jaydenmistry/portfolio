'use client';

import { useState, type FormEvent } from 'react';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import { site, contact } from '@/lib/data';
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from '@/components/icons';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

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
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
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
    <section id="contact" className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="07" label="Contact" title={contact.headline} lede={contact.body} />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="flex flex-col items-start gap-3">
            <a href={`mailto:${site.email}`} className="btn-primary">
              <MailIcon width={18} height={18} />
              {site.email}
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">
              <LinkedInIcon width={18} height={18} />
              LinkedIn
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className="btn-secondary">
              <GitHubIcon width={18} height={18} />
              GitHub
            </a>
            <a href={site.resumePath} download className="btn-secondary">
              <DownloadIcon />
              Download Resume
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={handleSubmit} className="card p-6 font-mono text-sm md:p-8" noValidate={false}>
            <p className="mb-6 text-ink-mute" aria-hidden>
              <span className="text-accent">❯</span> initiate_connection
            </p>

            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ink-dim">
                  name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-line bg-carbon px-4 py-3 text-ink placeholder:text-ink-mute focus:border-accent"
                  placeholder="Ada Lovelace"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ink-dim">
                  email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-line bg-carbon px-4 py-3 text-ink placeholder:text-ink-mute focus:border-accent"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ink-dim">
                  message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-y rounded-lg border border-line bg-carbon px-4 py-3 text-ink placeholder:text-ink-mute focus:border-accent"
                  placeholder="What are you building?"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : '[ Send message ]'}
              </button>
              <p role="status" className="text-xs text-ink-dim">
                {status === 'sent' ? <span className="text-ok">Message sent — I’ll reply soon.</span> : null}
                {status === 'error' ? (
                  <span className="text-err">Something went wrong — email me directly instead.</span>
                ) : null}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
