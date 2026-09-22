import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sheet flex-col justify-center gap-6 px-5 md:px-12 xl:px-24">
      <p className="m-0 font-mono text-meta text-signal-ink">404</p>
      <h1 className="m-0 text-[2.75rem] font-semibold leading-[0.98] tracking-display text-graphite md:text-[4.5rem]">
        Page not found
      </h1>
      <p className="m-0 text-body text-graphite-2 md:text-body-lg">That page doesn&apos;t exist or has moved.</p>
      <div>
        <Link href="/" className="btn-dark">
          Back to home
        </Link>
      </div>
    </main>
  );
}
