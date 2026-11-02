/**
 * A request's path through the Kappa Theta Pi stack, top to bottom, with a
 * packet travelling down the line. Decorative: the infrastructure section
 * describes the same system in full.
 */
const hops = [
  { label: 'Users', sub: 'internet' },
  { label: 'Traefik', sub: 'TLS' },
  { label: 'Authentik', sub: 'SSO' },
  { label: 'Docker apps', sub: 'services' },
  { label: 'Proxmox host', sub: 'Atlanta' },
];

export default function TrafficSpine() {
  return (
    <div aria-hidden className="relative z-10">
      <span className="absolute bottom-6 left-[1.125rem] top-6 w-0.5 rounded-full bg-accent/30" />
      <span className="traffic-packet absolute left-[0.9375rem] top-6 h-2.5 w-2.5 rounded-full bg-accent" />
      <ol className="relative m-0 flex list-none flex-col gap-2.5 p-0">
        {hops.map((hop) => (
          <li key={hop.label} className="flex items-center gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center">
              <span className="h-3 w-3 rounded-full border-2 border-accent bg-surface" />
            </span>
            <span className="flex flex-1 items-baseline justify-between gap-3 rounded-card bg-elevated px-4 py-2.5">
              <span className="text-callout font-medium text-label">{hop.label}</span>
              <span className="text-caption text-label-2">{hop.sub}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
