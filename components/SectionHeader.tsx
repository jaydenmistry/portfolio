import Reveal from '@/components/Reveal';

type SectionHeaderProps = {
  index: string;
  label: string;
  title: string;
  lede?: string;
};

export default function SectionHeader({ index, label, title, lede }: SectionHeaderProps) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="section-label">
        <span className="text-ink-mute">{index} /</span> {label}
      </p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tightest text-ink md:text-5xl">
        {title}
      </h2>
      {lede ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg">{lede}</p> : null}
    </Reveal>
  );
}
