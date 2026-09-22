/** Section opener: orange number, name, hairline rule, optional note. */
export default function SectionLabel({
  number,
  name,
  note,
  id,
}: {
  number: string;
  name: string;
  note?: string;
  id?: string;
}) {
  return (
    <div className="section-label">
      <span className="text-signal-ink">{number}</span>
      <h2 id={id} className="m-0 font-mono text-meta font-normal">
        {name}
      </h2>
      <span aria-hidden className="flex-1 self-center border-t border-rule" />
      {note ? <span className="text-graphite-2">{note}</span> : null}
    </div>
  );
}
