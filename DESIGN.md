# Design rules

The site uses an engineering-blueprint look: drafting paper, graphite ink and
one signal-orange accent. Read this before changing any UI.

## Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#F3F0E8` | `#1C1B19` | Page background |
| `sheet` | `#FAF8F3` | `#252420` | Raised surfaces: diagram nodes, fields, row hover |
| `grid` | `#E7E2D7` | `#2C2B27` | Diagram grid lines |
| `rule` | `#CFC8B8` | `#3A3833` | Dividers, list rules, underlines at rest |
| `rule-strong` | `#9A9383` | `#6E695F` | Dashed boundaries and placeholder outlines. Never text |
| `graphite` | `#16181D` | `#EDE8DD` | Headings, primary text, node outlines, primary button |
| `graphite-2` | `#4A4F5A` | `#B3ADA1` | Body copy and metadata (7.2:1 light, 7.7:1 dark) |
| `graphite-hover` | `#2A2D34` | `#D9D3C7` | Primary button hover |
| `signal` | `#E2531A` | `#E2531A` | Lines, markers, traffic paths. Never text |
| `signal-ink` | `#B23E0C` | `#EE6D35` | Orange text: numbers, focus ring (5.1:1 light, 5.6:1 dark) |

Figure sheets and hatching use `--figure` and `--hatch` in
`app/globals.css`. Components use tokens only, never raw hex, so both themes
stay in step. The hex values in `lib/theme.ts` exist only for the browser
theme color and the Calendly embed; keep them in sync with the table.

Orange stays rare. It marks the traffic path, list numbers, the availability
marker and hover states. Everything else is graphite on paper.

## Theme

- Light is the default for every first visit. Dark is optional: visitors
  opt in with the header toggle, and their explicit choice is remembered.
  The site does not follow the operating system setting.
- Dark is the same drawing on charcoal: warm off-white ink, subtle grid
  lines, the same orange. No new colors, glows or shadows.
- Screenshots keep their original colors in both themes. No filters.
- The saved theme is applied before first paint; never let a page flash
  the wrong theme.
- Embedded third-party widgets follow the theme when they load. Never reload
  one the visitor has started using just to change its colors.

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

- CSS, driven by small bits of existing React state. No animation
  libraries. Diagrams draw their lines, then their nodes appear, in about a
  second. Text never waits on an animation.
- Hover and press: underline color, a 4px arrow nudge, a 1px button press.
- The mobile menu drops in over 160ms and starts nearly opaque. The theme
  toggle icon turns in after a click, and the page crossfades for 200ms
  where the browser supports view transitions. Nothing else animates.
- Native scrolling. No pinned sections, parallax, smooth-scroll libraries,
  custom cursors or scroll-triggered fades on text.
- `prefers-reduced-motion: reduce` shows every figure in its final state
  and switches themes and menus instantly.

## Content

- No invented metrics, incidents or dates. If a fact is unknown, leave the
  field out of the UI instead of showing a placeholder.
- The one allowed placeholder is a missing screenshot, labeled as such.

## Banned

Gradients, glows, glassmorphism, rounded cards with shadows, emoji icons,
pill badges, fake terminals or status panels, stat rows, dark mode as the
default or following the system setting.
