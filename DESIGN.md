# Design rules

The site follows Apple's interface design, translated for the web: system
type, neutral surfaces, one blue accent, translucent floating chrome and
spring motion that responds the moment you touch something. Read this before
changing any UI.

## Color

Tokens are RGB channels in `app/globals.css`, exposed to Tailwind in
`tailwind.config.ts`. Components use tokens only, never raw hex.

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#FFFFFF` | `#000000` | Page |
| `surface` | `#F5F5F7` | `#161617` | Tiles, alternating sections, fields |
| `elevated` | `#FFFFFF` | `#1C1C1E` | Tiles that sit on `surface` |
| `label` | `#1D1D1F` | `#F5F5F7` | Headings and primary text |
| `label-2` | `#6E6E73` | `#A1A1A6` | Secondary text (5.07:1 light on white, 4.66:1 on surface; 8.16:1 dark) |
| `separator` | `#D2D2D7` | `#38383A` | Hairlines. Never text |
| `fill` | `#E8E8ED` | `#2C2C2E` | Chips, segmented-control tracks. Only `label` text on it |
| `accent` | `#0066CC` | `#2997FF` | Links, focus rings, active states (5.11:1 on surface light, 6.00:1 dark) |
| `accent-fill` | `#0071E3` | `#0071E3` | Filled buttons, with white text (4.70:1) |
| `success` | `#34C759` | `#30D158` | The availability dot. Never text |

The infrastructure section is always dark: it wraps itself in
`.surface-dark`, which swaps in the dark token values locally.

The hex values in `lib/theme.ts` exist only for the browser theme color and
the Calendly embed; keep them in sync with this table.

## Theme

- The site follows the operating system setting by default. Visitors can pin
  Light or Dark with the System / Light / Dark control; the pinned choice is
  stored in `localStorage` under `theme`. Choosing System removes it.
- The saved choice is applied before first paint; never flash the wrong theme.
- Switching themes reveals the new one in a circle that grows from the control
  that was pressed. With reduced motion it switches instantly.
- Screenshots keep their original colors in both themes.
- Embedded third-party widgets follow the theme when they load. Never reload
  one the visitor has started using just to change its colors.

## Type

- The system font: SF Pro on Apple devices, Segoe UI on Windows, Roboto on
  Android. No web fonts on the page. `ui-monospace` only for code.
- Tracking and leading change with size. Use the named sizes in
  `tailwind.config.ts`, which carry both; never set one letter-spacing for
  every size. The values follow Apple's own web type for SF Pro: SF's
  Display design is already tight, so only the largest sizes go negative.
- SF Pro installed as a file (not via the OS) is loaded through the
  `SF Pro Local` face in `app/globals.css` so its optical sizes work.

| Size | px | Leading | Tracking |
|---|---|---|---|
| `display` | 56–120 | 1.02 | −0.02em |
| `title-1` | 40–64 | 1.06 | −0.01em |
| `title-2` | 32–40 | 1.1 | −0.004em |
| `title-3` | 24–28 | 1.18 | 0 |
| `headline` | 19–21 | 1.3 | 0 |
| `body` | 17 (18 on desktop) | 1.53 | 0 |
| `callout` | 15 | 1.47 | 0 |
| `caption` | 14 | 1.43 | 0.005em |

- Readability floor: nothing under 14px.
- Weights: 400 body, 500 labels, 600 headings, 700 for `display` only.
- Sizes are in `rem`, so the layout grows with the reader's text size.
- Sentence case everywhere.

## Layout

- Content sits in a 1120px column with 20px gutters on phones.
- Rounded tiles (`rounded-tile`, 28px; `rounded-card`, 18px) on `surface`,
  with no shadows on flat content. Shadows belong to floating layers only.
- Sections are introduced by a large `title-1` heading, not by labels or
  numbers.

## Materials

- Translucent material is for floating chrome only: the nav bar, the mobile
  menu sheet, the screenshot viewer controls and diagram popovers. Never on
  content tiles, and never stack one translucent layer on another.
- `.material` is `background` at 72% with `saturate(180%) blur(20px)`;
  `.material-thick` raises the opacity and blur for larger surfaces.
- No border under the nav at rest. A hairline fades in once content scrolls
  underneath it.
- `prefers-reduced-transparency: reduce` makes every material solid.
  `prefers-contrast: more` makes them solid and adds a visible border.

## Motion

Motion uses springs. Apple's two parameters, damping and response, map onto
Motion's `bounce` and `visualDuration`, and onto the CSS curves `--spring`
and `--spring-bounce` in `app/globals.css` (generated from the same values).

| Use | Damping | Response | CSS | Motion |
|---|---|---|---|---|
| Default (everything) | 1.0 | 0.35s | `var(--spring)` over 0.48s | `spring` in `lib/motion.ts` |
| After a flick or throw | 0.8 | 0.4s | `var(--spring-bounce)` over 0.52s | `springBounce` |
| Press feedback | — | 0.1s | `ease-out` | — |

- Feedback starts on pointer-down: buttons scale to 0.97, tiles to 0.985.
- Hover effects only where the device can hover (`@media (hover: hover)`).
- Things enter and leave along the same path, and open from the control that
  triggered them (`transform-origin` at the trigger).
- Draggable surfaces (the mobile menu sheet and the screenshot viewer) follow
  the pointer 1:1 from where it was grabbed, resist past their bounds, and
  on release carry the pointer's velocity. Whether they close is decided by
  where the release velocity projects them (`lib/motion.ts`), not by where
  the pointer let go.
- Never block input during an animation. Motion animations start from the
  value on screen, so they can be grabbed and reversed mid-flight.
- Scroll reveals use CSS scroll-driven animations, tied to position rather
  than timers, so a section reached by an anchor link is already settled.
  Browsers without support show everything in its final state.
- Text is readable from the first frame: entrance animations on text start
  partly visible and never delay the main heading.
- Only `transform`, `opacity` and `filter` animate.
- `prefers-reduced-motion: reduce` replaces slides, scales and springs with
  short crossfades, removes the traffic animation in the diagram, and shows
  every figure in its final state.

## Content

- No invented metrics, incidents or dates. If a fact is unknown, leave the
  field out of the UI instead of showing a placeholder.
- The privacy page states only practices that are verified or confirmed by
  Jayden. Update it whenever a service, tracker or embed changes.

## Banned

Gradient text, glowing blobs or aurora backgrounds, emoji icons, stat rows,
fake terminals or status panels, looping background motion, scroll-jacking,
pinned scroll sequences, custom cursors, and any animation that hides the
page's main text.
