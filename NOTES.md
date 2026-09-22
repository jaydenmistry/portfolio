# Working notes

## Current scope — 2026-09-22

The blueprint redesign is approved. Keep its layout and follow DESIGN.md.
This pass covers Calendly, Umami setup and maintenance. The user deferred
separate project case-study pages and technical articles; do not add them.
Do not push, merge or deploy without the user's next instruction.

## Complete locally

- Blueprint design, IBM Plex fonts, readable palette, native scrolling and
  reduced-motion support. The old JM accessible-name mismatch no longer applies:
  the navigation link displays and announces Jayden Mistry.
- Spotr screenshot: public/spotr-pipeline.webp, 1600 x 1000, with a full-size link.
- Resume: preserve the user's public/resume.pdf exactly. It says Fall 2027;
  the site says December 2027. The user accepted both wordings.
- LAN and Tailscale preview access both confirmed by the user. Current URLs:
  http://10.5.1.23:3100 and http://100.100.22.25:3100.
  Rerun both Windows setup modes after WSL's IP changes.
- Calendly: components/Scheduling.tsx, contact.calendlyUrl in lib/data.ts.
  Uses next/script, loads near the viewport, reserves embed space, supplies
  blueprint color parameters, hides the cookie banner as previously requested,
  and keeps a direct-link fallback. Desktop/mobile meeting selection verified;
  no meeting was booked.
- CI, Docker and package engines use the Node 22 line; pnpm remains 10.
- Person JSON-LD uses affiliation for the current university instead of alumniOf.
- Stray Lighthouse browser profiles moved out of the repo to the Windows temp
  directory portfolio-lighthouse-archive-20260922. They were not deleted.

## Umami activation remains on hp-envy

The user supplied ~/docker/stacks/apps/compose.yml. Confirmed conventions:
entrypoint websecure, TLS enabled, resolver cf, external network TRAEFIK_NET.
deploy/umami/compose.yml now matches these conventions. The separate database
network and no published ports are retained. A portfolio Compose override supplies
NEXT_PUBLIC_* values as build args; the existing short build syntax did not.

Follow deploy/umami/README.md. Still needed on the host: the actual TRAEFIK_NET
value, generated secrets, analytics DNS, starting Umami, changing its initial
password, creating the website ID, then an approved portfolio rebuild/deploy.
No remote host access was supplied and no service was started from this session.
Compose files were checked against the upstream Compose JSON schema, not run
through Docker Compose locally (Docker is not installed in this environment).

## Maintenance and release notes

- Current validation: full pnpm lint and production build (including TypeScript)
  passed. Calendly meeting options and the calendar were inspected at desktop
  and 390px mobile widths, with no horizontal page overflow. No fresh Lighthouse
  score is claimed for the Calendly build.

- ESLint 9.39.5 is EOL. Registry versions checked on 2026-09-22:
  eslint-plugin-react 7.37.5 and eslint-plugin-jsx-a11y 6.10.2 do not declare
  ESLint 10 support. Leave the current lint checks intact until a compatible
  migration can be validated; do not force peer overrides.
- origin/main has 6cc7502 (resume update), absent from redesign/blueprint.
  The redesign branch's PDF includes GPA 3.84/4.0, while the remote copy omits it.
  Preserve the approved redesign PDF when reconciling the histories.
  No merge was performed in this pass.
- Public KV-store and chat repository URLs remain unknown and hidden.
- Contact-form delivery is still untested. Do not submit test messages without
  explicit authorization.
- Prior agent Lighthouse results (before Calendly): mobile 96-99 performance,
  other categories 100; desktop all 100. These are historical, not new scores.
