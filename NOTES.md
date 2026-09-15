# Working notes

## Phase 1 — redesign

Goal: stop the site reading as AI-generated. The problem is design decisions,
not tooling; the Next.js + Docker stack stays.

Order: Phase 1 (redesign) before Phase 2 (Calendly), so the embed lands in the
restructured contact section rather than the current one.

Process: design canvas first — 2–3 hero directions plus one project card, varying
typeface (single vs pairing), neutral warmth, whitespace, intro length, with real
first-person copy. No component code until a direction is picked.

### Remove

- Fake-terminal framing: `system_status` panel, `❯ initiate_connection` form
  styling, footer "System status: operational", blinking `JM_` logo cursor,
  "Scroll to explore".
- Metrics section and the illustrative activity bar chart.
- Dot grid, glow blobs, constellation, and pointer parallax backgrounds.
- Cyan-on-navy palette; three typefaces (Inter, Space Grotesk, JetBrains Mono).
- Generic headline copy ("Engineering with ownership.", "Let's build something
  reliable.").

### Keep

- The infrastructure topology diagram — it is real and differentiating.
- The content model in `lib/data.ts`.

### Structure

Hero → Selected work → Infrastructure → Experience → Contact. Fold Stack into
Experience; fold the About principle cards into the hero paragraph.

### Content

- Real screenshots: Spotr UI, Proxmox/Traefik dashboard, KV-store test output.
- Fix the two project `github` links that point at the profile, not the repos.

### Accessibility — must fix in Phase 1 (pre-existing, not Phase 5 regressions)

Lighthouse accessibility is 96 on both the pre- and post-Phase-5 builds because of:

- `text-ink-mute` (`#5f6b7e`) at 12–14px on the dark background measures 3.5:1;
  WCAG AA needs 4.5:1. Affects the nav availability pill and project/experience
  meta lines. Fix at the token, not per element.
- The nav logo `<a aria-label="Jayden Mistry — back to top">` does not contain its
  visible text "JM" (label-content-name-mismatch). Start the accessible name with
  the visible text, or drop the aria-label.

Re-run Lighthouse after the redesign; a11y should reach 100. `app/not-found.tsx`
and `app/error.tsx` use the current tokens and need a light touch once tokens change.

### Baseline (2026-09-15, Lighthouse 12.8, single throttled run)

Mobile 94 / 96 / 100 / 100, desktop 100 / 96 / 100 / 100
(performance / accessibility / best practices / SEO). Page weight 299 KB.
The 95→94 mobile delta from Phase 5 is single-run noise; the +12 KB is the error
boundary and is accepted.

## Phase 2 — Calendly

Inline widget at `https://calendly.com/jaydenmistry`, loaded via `next/script`
(not a raw `<script>` tag). Theme via URL params; hide the GDPR banner. Lives in
the redesigned contact section.
