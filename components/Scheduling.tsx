'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { contact } from '@/lib/data';
import { ArrowUpRightIcon } from '@/components/icons';
import { themePalette, type Theme } from '@/lib/theme';
import { getTheme, useTheme } from '@/lib/use-theme';

type CalendlyWindow = Window & {
  Calendly?: {
    initInlineWidget(options: { url: string; parentElement: HTMLElement }): void;
  };
};

// Calendly's embed color parameters take hex without the leading '#'.
// Calendly's own cookie banner stays enabled: its embed terms require it
// unless the site provides its own cookie controls for Calendly.
function bookingUrl(theme: Theme) {
  const { surface, label, accent } = themePalette[theme];
  const hex = (color: string) => color.slice(1).toLowerCase();
  return `${contact.calendlyUrl}?background_color=${hex(surface)}&text_color=${hex(label)}&primary_color=${hex(accent)}`;
}

const pageViews = ['calendly.profile_page_viewed', 'calendly.event_type_viewed'];

export default function Scheduling() {
  const section = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const theme = useTheme();
  // Theme the embed was built with, and whether the visitor has moved past
  // its first page. A started booking is never reloaded to change colors.
  const embedTheme = useRef<Theme | null>(null);
  const views = useRef(0);
  const started = useRef(false);

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
        pageViews.includes(event.data?.event)
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

  // Track booking progress for as long as the embed exists.
  useEffect(() => {
    if (!enabled) return;
    const onMessage = (event: MessageEvent) => {
      const iframe = container.current?.querySelector('iframe');
      if (event.origin !== 'https://calendly.com' || !iframe || event.source !== iframe.contentWindow) return;
      const name = event.data?.event;
      if (pageViews.includes(name)) {
        views.current += 1;
        if (views.current > 1) started.current = true;
      } else if (name === 'calendly.date_and_time_selected' || name === 'calendly.event_scheduled') {
        started.current = true;
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [enabled]);

  // Rebuild the embed in the new colors unless a booking is under way.
  useEffect(() => {
    const parentElement = container.current;
    if (!parentElement || !embedTheme.current || embedTheme.current === theme || started.current) return;
    parentElement.replaceChildren();
    setStatus('loading');
    initialize();
  }, [theme]);

  function initialize() {
    const parentElement = container.current;
    const calendly = (window as CalendlyWindow).Calendly;
    if (!parentElement || !calendly || parentElement.querySelector('iframe')) return;
    const current = getTheme();
    embedTheme.current = current;
    views.current = 0;
    calendly.initInlineWidget({ url: bookingUrl(current), parentElement });
    const iframe = parentElement.querySelector('iframe');
    if (iframe) {
      iframe.title = 'Schedule a meeting with Jayden Mistry';
      iframe.addEventListener('load', () => setStatus('ready'), { once: true });
    }
  }

  return (
    <div ref={section} className="tile reveal flex min-w-0 flex-col gap-6 p-4 pt-7 md:p-8 md:pt-10">
      <div className="flex flex-col gap-2 px-3 md:flex-row md:items-baseline md:justify-between md:px-2">
        <h3 className="m-0 text-title-3 text-label">Find a time to talk</h3>
        <a className="link-chevron self-start text-[1.0625rem]" href={contact.calendlyUrl}>
          Open Calendly
          <ArrowUpRightIcon width={15} height={15} />
        </a>
      </div>
      <div className="relative h-[750px] min-w-0 overflow-hidden rounded-card bg-surface md:h-[700px]">
        {status === 'loading' ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col gap-8 bg-surface p-6 md:p-10" role="status">
            <p className="m-0 text-callout text-label-2">Loading available times…</p>
            <div aria-hidden className="skeleton flex max-w-xl flex-col gap-5">
              <div className="h-6 w-2/3 rounded-full bg-fill" />
              <div className="h-4 w-1/2 rounded-full bg-fill" />
              <div className="grid grid-cols-7 gap-3 pt-6">
                {Array.from({ length: 28 }, (_, index) => <div key={index} className="aspect-square rounded-full bg-fill" />)}
              </div>
            </div>
          </div>
        ) : null}
        {/* Calendly's page is color-scheme light; matching it keeps the iframe
            transparent instead of the browser painting it white in dark mode. */}
        <div ref={container} className="h-full w-full [color-scheme:light]" data-auto-load="false" />
        {status === 'error' ? (
          <p role="status" className="material absolute inset-x-3 top-3 m-0 rounded-card p-5 text-callout text-label shadow-float">
            The scheduler is taking longer to load.{' '}
            <a className="link" href={contact.calendlyUrl}>Open Calendly directly</a> or email me.
          </p>
        ) : null}
        <noscript>
          <p className="absolute inset-x-0 top-0 m-0 bg-surface p-6 text-callout text-label">
            <a className="link" href={contact.calendlyUrl}>Open Calendly to choose a meeting time.</a>
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
