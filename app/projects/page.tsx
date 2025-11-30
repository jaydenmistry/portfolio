import Link from 'next/link';
import { PROJECTS } from '@/app/lib/portfolio-data';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-5xl">
                <header className="flex flex-col gap-3 rounded-lg bg-slate-900 p-6 text-white">
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        Projects
                    </h1>
                    <p className="text-slate-200">
                        A collection of things I’ve built. Each one links to a repo (and a
                        live demo when available).
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3">
                        <Link
                            href="/"
                            className="inline-flex w-fit items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
                        >
                            ← Back home
                        </Link>

                        <a
                            href="mailto:<email>"
                            className="inline-flex w-fit items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
                        >
                            Contact
                        </a>
                    </div>
                </header>

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    {PROJECTS.map((p) => (
                        <article
                            key={p.slug}
                            className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {p.title}
                                </h2>

                                <a
                                    href={p.links.live ?? p.links.repo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Open <ArrowTopRightOnSquareIcon className="w-4" />
                                </a>
                            </div>

                            <p className="mt-2 text-gray-700">{p.description}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {p.stack.map((t, i) => (
                                    <span key={`${t}-${i}`} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                                {p.highlights.map((h, i) => (
                                    <li key={i}>{h}</li>
                                ))}
                            </ul>

                            <div className="mt-5 flex flex-wrap gap-3">
                                {p.links.live && (
                                    <a
                                        href={p.links.live}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                                    >
                                        Live Demo
                                    </a>
                                )}
                                <a
                                    href={p.links.repo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                                >
                                    Source Code
                                </a>
                            </div>
                        </article>
                    ))}
                </section>

                <footer className="mt-8 text-sm text-gray-500">
                    Tip: edit your projects in{' '}
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                        app/lib/portfolio-data.ts
                    </code>
                    .
                </footer>
            </div>
        </main>
    );
}