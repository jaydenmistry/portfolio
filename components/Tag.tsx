export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-ink-dim transition-colors duration-200 hover:border-accent/50 hover:text-accent">
      {children}
    </span>
  );
}
