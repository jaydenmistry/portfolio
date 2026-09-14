import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tightest text-ink md:text-5xl">
          Page not found
        </h1>
        <p className="mt-5 text-base text-ink-dim">That page doesn&apos;t exist or has moved.</p>
        <div className="mt-8">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
