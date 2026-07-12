/**
 * Animated mini topology for the KTP infrastructure project:
 * Internet → Traefik → services, with packets flowing along active routes.
 */

const services = [
  { label: 'Website', y: 40, status: 'bg-ok' },
  { label: 'Docs', y: 84, status: 'bg-ok' },
  { label: 'Auth', y: 128, status: 'bg-violet' },
  { label: 'Minecraft', y: 172, status: 'bg-ok' },
  { label: 'Tools', y: 216, status: 'bg-violet' },
  { label: 'Monitoring', y: 260, status: 'bg-accent' },
];

export default function TopologyMiniVisual() {
  return (
    <div aria-hidden className="flex h-full min-h-[300px] items-center justify-center p-5">
      <svg viewBox="0 0 460 300" className="h-full w-full max-w-md font-mono" fill="none">
        {/* Edges: internet -> traefik */}
        <path id="edge-in" d="M78 150 H 170" stroke="#2a3348" strokeWidth="1.5" />
        <path d="M78 150 H 170" stroke="#54c1ff" strokeOpacity="0.5" strokeWidth="1.5" className="dash-flow" />

        {/* Edges: traefik -> each service */}
        {services.map((service, i) => (
          <g key={service.label}>
            <path
              d={`M262 150 C 300 150, 300 ${service.y + 12}, 336 ${service.y + 12}`}
              stroke="#2a3348"
              strokeWidth="1.5"
            />
            <path
              d={`M262 150 C 300 150, 300 ${service.y + 12}, 336 ${service.y + 12}`}
              stroke="#54c1ff"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              className="dash-flow-slow"
              style={{ animationDelay: `${-i * 0.5}s` }}
            />
          </g>
        ))}

        {/* Packets on the ingress edge */}
        {[0, 1, 2].map((packet) => (
          <circle
            key={packet}
            r="2.5"
            fill="#54c1ff"
            className="packet"
            style={
              {
                offsetPath: 'path("M78 150 H 170")',
                '--packet-duration': '2.2s',
                '--packet-delay': `${packet * 0.7}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Internet node */}
        <g>
          <circle cx="46" cy="150" r="26" fill="#121724" stroke="#2a3348" strokeWidth="1.5" />
          <text x="46" y="154" textAnchor="middle" fill="#9aa5b6" fontSize="10">
            WAN
          </text>
        </g>

        {/* Traefik node */}
        <g>
          <rect x="170" y="126" width="92" height="48" rx="10" fill="#121724" stroke="#54c1ff" strokeOpacity="0.6" strokeWidth="1.5" />
          <text x="216" y="147" textAnchor="middle" fill="#e7eaf1" fontSize="11">
            Traefik
          </text>
          <text x="216" y="162" textAnchor="middle" fill="#5f6b7e" fontSize="8.5">
            reverse proxy
          </text>
        </g>

        {/* Service nodes */}
        {services.map((service) => (
          <g key={service.label}>
            <rect x="336" y={service.y} width="100" height="26" rx="7" fill="#121724" stroke="#2a3348" strokeWidth="1.5" />
            <circle
              cx="350"
              cy={service.y + 13}
              r="3"
              fill={
                service.status === 'bg-ok' ? '#41cf8e' : service.status === 'bg-violet' ? '#a08cff' : '#54c1ff'
              }
            />
            <text x="362" y={service.y + 17} fill="#9aa5b6" fontSize="10">
              {service.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
