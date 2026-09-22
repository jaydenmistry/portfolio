# Design rules

The site uses an engineering-blueprint look: drafting paper, graphite ink and
one signal-orange accent. Read this before changing any UI.

## Color

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F3F0E8` | Page background |
| `sheet` | `#FAF8F3` | Raised surfaces: diagram nodes, row hover |
| `grid` | `#E7E2D7` | Diagram grid lines |
| `rule` | `#CFC8B8` | Dividers, list rules, underlines at rest |
| `rule-strong` | `#9A9383` | Dashed boundaries and placeholder outlines. Never text |
| `graphite` | `#16181D` | Headings, primary text, node outlines, primary button |
| `graphite-2` | `#4A4F5A` | Body copy and metadata (7.2:1 on paper) |
| `signal` | `#E2531A` | Lines, markers, traffic paths. 3.4:1, so never text |
| `signal-ink` | `#B23E0C` | Orange text: numbers, focus ring (5.1:1 on paper) |

Orange stays rare. It marks the traffic path, list numbers, the availability
marker and hover states. Everything else is graphite on paper.

## Type

- IBM Plex Sans for everything people read. IBM Plex Mono for labels,
  captions, metadata and diagram text. No third family.
- Weights: 400 body, 500 labels and row titles, 600 headings only.
- Readability floor: no text under 14px, diagram labels included. Mono
  metadata uses the `meta` size. Body copy is 17px on mobile, 18px on desktop.
- Sentence case everywhere. No uppercase tracking labels.

## Layout

- One primitive repeats: a hairline-ruled list or grid. Rows, not cards.
- Left-aligned. Sections open with a mono label row: number, name, rule.
- Figures carry a caption that starts `fig. NN.`

## Motion

- CSS only. Diagrams draw their lines, then their nodes appear, in about a
  second. Text never waits on an animation.
- Hover and press: underline color, a 4px arrow nudge, a 1px button press.
- Native scrolling. No pinned sections, parallax, smooth-scroll libraries,
  custom cursors or scroll-triggered fades on text.
- `prefers-reduced-motion: reduce` shows every figure in its final state.

## Content

- No invented metrics, incidents or dates. If a fact is unknown, leave the
  field out of the UI instead of showing a placeholder.
- The one allowed placeholder is a missing screenshot, labeled as such.

## Banned

Gradients, glows, glassmorphism, rounded cards with shadows, emoji icons,
pill badges, fake terminals or status panels, stat rows, dark mode by default.
