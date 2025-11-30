import Link from 'next/link';
import { ArrowRightIcon, EnvelopeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import styles from '@/app/ui/home.module.css';
import { FEATURED_PROJECTS } from '@/app/lib/portfolio-data';
import { SITE } from '@/app/lib/site-data';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <header className="flex items-end justify-between rounded-lg bg-slate-900 p-6 md:h-52">
        <div className="max-w-3xl">
          <p className="text-sm text-slate-300">Hi, I’m</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {SITE.name}
          </h1>
          <p className="mt-3 text-base text-slate-200 md:text-lg">
            {SITE.title} · {SITE.location}. I build {SITE.tagline}.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
              <EnvelopeIcon className="w-5" />
              <span>Email</span>
            </a>

            <a href={SITE.resumePath} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
              <ArrowDownTrayIcon className="w-5" />
              <span>Resume</span>
            </a>

            <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
              GitHub
            </a>

            <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <section className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className={styles.shape} />

          <div>
            <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">About</h2>
            <p className="mt-3 text-base text-gray-700 md:text-lg md:leading-relaxed">
              {SITE.about}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Quick facts</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              {SITE.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 md:text-base">
              <span>View Projects</span>
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>

            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 md:text-base">
              Contact
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-white p-6 md:w-3/5 md:px-10 md:py-12">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">Featured Projects</h2>
            <p className="mt-2 text-gray-600">A few things I’m proud of.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {FEATURED_PROJECTS.map((p) => (
              <a
                key={p.slug}
                href={p.links.live ?? p.links.repo}
                className="group rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:bg-gray-100"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
                  <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Visit →</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500">
              See all projects <ArrowRightIcon className="w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} {SITE.name}. Built with Next.js.
      </footer>
    </main>
  );
}