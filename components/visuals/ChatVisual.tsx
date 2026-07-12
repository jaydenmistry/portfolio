import type { CSSProperties } from 'react';

/**
 * Dark messaging interface mock with staggered message entrances and a small
 * connection status strip.
 */

const messages = [
  { from: 'them', text: 'deploy finished — can you verify?', time: '14:02' },
  { from: 'me', text: 'on it. checking the health endpoint', time: '14:02' },
  { from: 'me', text: 'all green ✓ socket reconnects look clean', time: '14:03' },
  { from: 'them', text: 'nice. shipping the release notes', time: '14:03' },
];

export default function ChatVisual() {
  return (
    <div aria-hidden className="flex h-full min-h-[300px] flex-col p-5 font-mono text-[11px]">
      {/* Channel header */}
      <div className="flex items-center justify-between rounded-t-lg border border-line bg-panel px-3 py-2">
        <span className="text-ink-dim"># ops-room</span>
        <span className="flex items-center gap-1.5 text-ok">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" />
          connected
        </span>
      </div>

      {/* Message stream */}
      <div className="flex flex-1 flex-col justify-end gap-2.5 border-x border-line bg-raised/60 p-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`msg-in flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}
            style={{ '--msg-delay': `${0.3 + i * 0.35}s` } as CSSProperties}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 ${
                message.from === 'me'
                  ? 'rounded-br-sm bg-accent/15 text-ink'
                  : 'rounded-bl-sm border border-line bg-panel text-ink-dim'
              }`}
            >
              <p>{message.text}</p>
              <p className="mt-1 text-right text-[9px] text-ink-mute">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status strip */}
      <div className="flex items-center justify-between rounded-b-lg border border-line bg-panel px-3 py-2 text-ink-mute">
        <span>
          ws: <span className="text-ok">open</span>
        </span>
        <span>
          latency: <span className="text-accent">12ms</span>
        </span>
        <span>
          events/s: <span className="text-ink-dim">44</span>
        </span>
      </div>
    </div>
  );
}
