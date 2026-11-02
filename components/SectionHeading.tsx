/** A section opens with a large headline, Apple product-page style. */
export default function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="reveal flex max-w-3xl flex-col gap-4">
      <h2 id={id} className="m-0 text-balance text-title-1 text-label">
        {title}
      </h2>
      {intro ? <p className="m-0 text-pretty text-headline text-label-2">{intro}</p> : null}
    </div>
  );
}
