/**
 * Abstract dashboard mock for Spotr: listing cards with fit scores and a
 * small pipeline. Sample data only — no real marketplace UI or brands.
 */

const listings = [
  { name: '2019 Sedan · 62k mi', price: '$14,200', fit: 92, tone: 'text-ok border-ok/40' },
  { name: '2021 SUV · 38k mi', price: '$23,900', fit: 84, tone: 'text-accent border-accent/40' },
  { name: '2017 Truck · 91k mi', price: '$18,500', fit: 71, tone: 'text-warn border-warn/40' },
];

const pipeline = [
  { stage: 'New', count: 12, width: 'w-full' },
  { stage: 'Contacted', count: 7, width: 'w-3/5' },
  { stage: 'Appraisal', count: 3, width: 'w-1/3' },
];

export default function SpotrVisual() {
  return (
    <div aria-hidden className="flex h-full min-h-[300px] flex-col gap-3 p-5 font-mono text-[11px]">
      {/* Top bar */}
      <div className="flex items-center justify-between rounded-lg border border-line bg-panel px-3 py-2">
        <span className="text-ink-dim">spotr / acquisition</span>
        <span className="flex items-center gap-1.5 text-ok">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" />
          80+ listings/day
        </span>
      </div>

      <div className="grid flex-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
        {/* Listing cards */}
        <div className="space-y-2.5">
          {listings.map((listing) => (
            <div
              key={listing.name}
              className="flex items-center gap-3 rounded-lg border border-line bg-panel p-3 transition-colors duration-300 group-hover:border-line-bright"
            >
              {/* Generic car silhouette */}
              <svg viewBox="0 0 48 24" width="42" height="21" className="shrink-0 text-ink-mute" fill="currentColor">
                <path d="M6 16c0-1 .8-3.4 2-4l4-1.6L17 6.6c.6-.5 1.4-.6 2-.6h10c.8 0 1.6.3 2.2.9l4.4 4.1 4.8 1.4c1 .3 1.6 1.3 1.6 2.3V17a1 1 0 0 1-1 1h-2a4 4 0 0 0-8 0H17a4 4 0 0 0-8 0H7a1 1 0 0 1-1-1v-1Z" />
                <circle cx="13" cy="18.5" r="2.4" />
                <circle cx="35" cy="18.5" r="2.4" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ink">{listing.name}</p>
                <p className="text-ink-mute">{listing.price} · private party</p>
              </div>
              <span className={`shrink-0 rounded border bg-raised px-1.5 py-0.5 ${listing.tone}`}>
                fit {listing.fit}
              </span>
            </div>
          ))}
        </div>

        {/* Pipeline panel */}
        <div className="hidden flex-col justify-between rounded-lg border border-line bg-panel p-3 sm:flex">
          <div>
            <p className="mb-3 uppercase tracking-widest text-ink-mute">Pipeline</p>
            <div className="space-y-3">
              {pipeline.map((stage) => (
                <div key={stage.stage}>
                  <div className="mb-1 flex justify-between text-ink-dim">
                    <span>{stage.stage}</span>
                    <span>{stage.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-raised">
                    <div className={`h-full rounded-full bg-accent/70 ${stage.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 border-t border-line pt-2 text-ink-mute">
            sources: <span className="text-ink-dim">3 aggregated</span>
          </p>
        </div>
      </div>
    </div>
  );
}
