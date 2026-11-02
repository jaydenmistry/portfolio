'use client';

import Link from 'next/link';
import { useRef, useState, type FocusEvent, type FormEvent, type FormEventHandler } from 'react';
import { AnimatePresence, m, useAnimate } from 'motion/react';
import Scheduling from '@/components/Scheduling';
import { ArrowUpRightIcon, CheckIcon } from '@/components/icons';
import { site, contact } from '@/lib/data';
import { resumeEvent } from '@/lib/analytics';
import { spring } from '@/lib/motion';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'message';

/** Messages for the browser's own validity checks, shown inline on blur. */
function problem(el: HTMLInputElement | HTMLTextAreaElement): string | null {
  if (el.validity.valid) return null;
  if (el.validity.valueMissing) {
    return { name: 'Enter your name.', email: 'Enter your email address.', message: 'Write a message.' }[el.name as FieldName];
  }
  if (el.validity.typeMismatch) return 'Enter an email address, like name@example.com.';
  return 'Check this field.';
}

function Field({
  name,
  label,
  error,
  multiline,
  type = 'text',
  autoComplete,
  onBlur,
  onInput,
}: {
  name: FieldName;
  label: string;
  error: string | null;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  const id = `contact-${name}`;
  const props = {
    id,
    name,
    required: true,
    placeholder: ' ',
    onBlur,
    onInput,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: `field-input peer ${multiline ? 'min-h-40 resize-y' : ''}`,
  };
  return (
    <div className="field flex flex-col">
      <div className="relative">
        {multiline ? <textarea rows={5} {...props} /> : <input type={type} autoComplete={autoComplete} {...props} />}
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <m.p
            id={`${id}-error`}
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="m-0 overflow-hidden text-callout text-danger"
          >
            <span className="block pt-2">{error}</span>
          </m.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is still on screen.
    }
  }
  return (
    <>
    <button type="button" onClick={copy} className="button-tinted min-h-9 gap-1 px-3.5 text-caption">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={copied ? 'copied' : 'copy'}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={spring}
          className="flex items-center gap-1"
        >
          {copied ? <CheckIcon width={14} height={14} aria-hidden /> : null}
          {copied ? 'Copied' : 'Copy'}
        </m.span>
      </AnimatePresence>
    </button>
    <span className="sr-only" role="status">
      {copied ? 'Email address copied' : ''}
    </span>
    </>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<FieldName, string | null>>({ name: null, email: null, message: null });
  const [scope, animate] = useAnimate<HTMLFormElement>();
  const resetTimer = useRef(0);

  // Validate when a field is left, then keep the message current while typing.
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    // Don't scold an empty field someone has only tabbed through.
    if (!el.value && !errors[el.name as FieldName]) return;
    const message = problem(el);
    setErrors((prev) => ({ ...prev, [el.name]: message }));
  };
  const onInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const el = e.currentTarget;
    if (!errors[el.name as FieldName]) return;
    const message = problem(el);
    setErrors((prev) => ({ ...prev, [el.name]: message }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const found = Object.fromEntries(fields.map((el) => [el.name, problem(el)])) as Record<FieldName, string | null>;
    setErrors(found);
    const firstInvalid = fields.find((el) => found[el.name as FieldName]);
    if (firstInvalid) {
      firstInvalid.focus();
      // A small shake says "not yet", the way a wrong passcode does.
      animate(firstInvalid.closest('.field') as Element, { x: [0, -10, 9, -6, 4, -2, 0] }, { duration: 0.45, ease: 'easeOut' });
      return;
    }

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
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setStatus((s) => (s === 'sent' ? 'idle' : s)), 6000);
    } catch {
      setStatus('error');
    }
  }

  const buttonLabel = { idle: 'Send message', sending: 'Sending…', sent: 'Sent', error: 'Send message' }[status];

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-content flex scroll-mt-12 flex-col gap-4">
      <div className="tile reveal grid gap-12 p-7 md:p-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 id="contact-title" className="m-0 text-balance text-title-1 text-label">
            {contact.headline}
          </h2>
          <p className="m-0 max-w-[30rem] text-pretty text-headline text-label-2">{contact.body}</p>
          <ul className="m-0 mt-2 flex list-none flex-col border-t border-separator p-0">
            <li className="flex items-center justify-between gap-4 border-b border-separator py-3">
              <a className="link text-[1.0625rem]" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <CopyEmail />
            </li>
            {[
              { href: site.linkedin, label: 'LinkedIn' },
              { href: site.github, label: 'GitHub' },
            ].map((item) => (
              <li key={item.label} className="border-b border-separator">
                <a className="link-chevron flex min-h-14 justify-between text-[1.0625rem]" href={item.href}>
                  {item.label}
                  <ArrowUpRightIcon width={15} height={15} />
                </a>
              </li>
            ))}
            <li className="border-b border-separator">
              <a className="link-chevron flex min-h-14 justify-between text-[1.0625rem]" href={site.resumePath} {...resumeEvent('contact')}>
                Résumé (PDF)
                <ArrowUpRightIcon width={15} height={15} />
              </a>
            </li>
          </ul>
        </div>

        <form ref={scope} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field name="name" label="Name" autoComplete="name" error={errors.name} onBlur={onBlur} onInput={onInput} />
          <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} onBlur={onBlur} onInput={onInput} />
          <Field name="message" label="Message" multiline error={errors.message} onBlur={onBlur} onInput={onInput} />
          <p className="m-0 text-callout text-label-2">
            Your name, email and message go to me through Formspree, and I use them to reply.{' '}
            <Link href="/privacy" className="link">
              Privacy
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <m.button
              layout
              transition={spring}
              type="submit"
              className="button-filled min-h-12 px-7 text-[1.0625rem] disabled:opacity-80"
              disabled={status === 'sending'}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={status === 'error' ? 'idle' : status}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={spring}
                  className="flex items-center gap-2"
                >
                  {status === 'sending' ? <span aria-hidden className="spinner" /> : null}
                  {status === 'sent' ? <CheckIcon aria-hidden width={18} height={18} /> : null}
                  {buttonLabel}
                </m.span>
              </AnimatePresence>
            </m.button>
            <p role="status" className="m-0 text-callout text-label">
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
