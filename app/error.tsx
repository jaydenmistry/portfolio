'use client';

import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tightest text-ink md:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-5 text-base text-ink-dim">Try again, or head back to the homepage.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
