/**
 * Conceptual replication visualization: five nodes, an elected leader with
 * heartbeat rings, log replication to followers, and one failed node.
 */

const followers = [
  { x: 90, y: 70, log: 5, state: 'ok' as const },
  { x: 330, y: 70, log: 5, state: 'ok' as const },
  { x: 90, y: 230, log: 4, state: 'ok' as const },
  { x: 330, y: 230, log: 2, state: 'down' as const },
];

const LEADER = { x: 210, y: 150 };

export default function RaftVisual() {
  return (
    <div aria-hidden className="flex h-full min-h-[300px] items-center justify-center p-5">
      <svg viewBox="0 0 420 300" className="h-full w-full max-w-sm font-mono" fill="none">
        {/* Replication edges */}
        {followers.map((follower, i) => (
          <g key={i}>
            <path
              d={`M${LEADER.x} ${LEADER.y} L ${follower.x} ${follower.y}`}
              stroke={follower.state === 'down' ? '#2a3348' : '#2a3348'}
              strokeWidth="1.5"
              strokeDasharray={follower.state === 'down' ? '3 5' : undefined}
            />
            {follower.state === 'ok' ? (
              <path
                d={`M${LEADER.x} ${LEADER.y} L ${follower.x} ${follower.y}`}
                stroke="#54c1ff"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                className="dash-flow"
                style={{ animationDelay: `${-i * 0.4}s` }}
              />
            ) : null}
          </g>
        ))}

        {/* Leader heartbeat rings */}
        <circle cx={LEADER.x} cy={LEADER.y} r="34" stroke="#54c1ff" strokeOpacity="0.5" className="heartbeat-ring" />
        <circle
          cx={LEADER.x}
          cy={LEADER.y}
          r="34"
          stroke="#54c1ff"
          strokeOpacity="0.5"
          className="heartbeat-ring"
          style={{ animationDelay: '-1.3s' }}
        />

        {/* Leader node */}
        <g>
          <circle cx={LEADER.x} cy={LEADER.y} r="34" fill="#121724" stroke="#54c1ff" strokeWidth="1.5" />
          <text x={LEADER.x} y={LEADER.y - 4} textAnchor="middle" fill="#e7eaf1" fontSize="11">
            node-1
          </text>
          <text x={LEADER.x} y={LEADER.y + 12} textAnchor="middle" fill="#54c1ff" fontSize="9">
            LEADER · t3
          </text>
        </g>

        {/* Follower nodes with log bars */}
        {followers.map((follower, i) => {
          const down = follower.state === 'down';
          return (
            <g key={i} opacity={down ? 0.55 : 1}>
              <circle
                cx={follower.x}
                cy={follower.y}
                r="30"
                fill="#121724"
                stroke={down ? '#e26d66' : '#2a3348'}
                strokeWidth="1.5"
              />
              <text x={follower.x} y={follower.y - 8} textAnchor="middle" fill="#9aa5b6" fontSize="10">
                node-{i + 2}
              </text>
              {/* Log entries */}
              <g>
                {[0, 1, 2, 3, 4].map((slot) => (
                  <rect
                    key={slot}
                    x={follower.x - 21 + slot * 9}
                    y={follower.y + 2}
                    width="7"
                    height="9"
                    rx="1.5"
                    fill={slot < follower.log ? (down ? '#e26d66' : '#41cf8e') : '#1e2534'}
                  />
                ))}
              </g>
              <text
                x={follower.x}
                y={follower.y + 45}
                textAnchor="middle"
                fill={down ? '#e26d66' : '#5f6b7e'}
                fontSize="8.5"
              >
                {down ? 'UNREACHABLE' : 'follower'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
