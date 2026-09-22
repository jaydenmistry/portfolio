'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { contact } from '@/lib/data';

type CalendlyWindow = Window & {
  Calendly?: {
    initInlineWidget(options: { url: string; parentElement: HTMLElement }): void;
  };
};

const bookingUrl = `${contact.calendlyUrl}?hide_gdpr_banner=1&background_color=f3f0e8&text_color=16181d&primary_color=b23e0c`;

export default function Scheduling() {
  const section = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEnabled(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || status !== 'loading') return;
    const timeout = window.setTimeout(() => setStatus('error'), 20000);
    const onMessage = (event: MessageEvent) => {
      const iframe = container.current?.querySelector('iframe');
      if (
        event.origin === 'https://calendly.com' &&
        iframe && event.source === iframe.contentWindow &&
        ['calendly.profile_page_viewed', 'calendly.event_type_viewed'].includes(event.data?.event)
      ) {
        setStatus('ready');
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
    };
  }, [enabled, status]);

  function initialize() {
    const parentElement = container.current;
    const calendly = (window as CalendlyWindow).Calendly;
    if (!parentElement || !calendly || parentElement.querySelector('iframe')) return;
    calendly.initInlineWidget({ url: bookingUrl, parentElement });
    const iframe = parentElement.querySelector('iframe');
    if (iframe) {
      iframe.title = 'Schedule a meeting with Jayden Mistry';
      iframe.addEventListener('load', () => setStatus('ready'), { once: true });
    }
  }

  return (
    <div ref={section} className="flex min-w-0 flex-col gap-6 border-t border-rule pt-10 md:pt-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <h3 className="m-0 text-2xl font-semibold tracking-tight text-graphite md:text-3xl">Find a time to talk</h3>
        <a className="ulink self-start text-base text-graphite" href={contact.calendlyUrl}>
          Open Calendly<span aria-hidden> ↗</span>
        </a>
      </div>
      <div className="relative h-[750px] min-w-0 border border-rule md:h-[700px]">
        {status === 'loading' ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col gap-8 bg-paper p-6 md:p-10" role="status">
            <p className="m-0 font-mono text-meta text-graphite-2">Loading available times…</p>
            <div aria-hidden className="flex max-w-xl flex-col gap-5">
              <div className="h-6 w-2/3 bg-grid" />
              <div className="h-4 w-1/2 bg-grid" />
              <div className="grid grid-cols-7 gap-3 pt-6">
                {Array.from({ length: 28 }, (_, index) => <div key={index} className="aspect-square border border-rule" />)}
              </div>
            </div>
          </div>
        ) : null}
        <div ref={container} className="h-full w-full" data-auto-load="false" />
        {status === 'error' ? (
          <p role="status" className="absolute inset-x-0 top-0 m-0 border-b border-rule bg-paper p-6 text-base text-graphite">
            The scheduler is taking longer to load.{' '}
            <a className="ulink" href={contact.calendlyUrl}>Open Calendly directly</a> or email me.
          </p>
        ) : null}
        <noscript>
          <p className="absolute inset-x-0 top-0 m-0 bg-paper p-6 text-base text-graphite">
            <a className="ulink" href={contact.calendlyUrl}>Open Calendly to choose a meeting time.</a>
          </p>
        </noscript>
      </div>
      {enabled ? (
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
          onReady={initialize}
          onError={() => setStatus('error')}
        />
      ) : null}
    </div>
  );
}
