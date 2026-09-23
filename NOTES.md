# Working notes

## Current scope - 2026-09-23

The blueprint redesign, Calendly and Umami are published on main and deployed
at https://jmistry.com; Umami records visits. Keep the layout and follow
DESIGN.md. Separate project pages and technical articles remain deferred.
Do not push or deploy new work until the user explicitly approves it.

In progress on redesign/blueprint (local, unpushed): optional dark theme with
a header toggle, themed Calendly embed, and small motion refinements.

## Release changes

- Next.js and eslint-config-next are pinned to 16.3.6. PostCSS is 8.5.28 and
  Tailwind is 3.4.19. Transitive dependencies were refreshed; a scoped YAML
  override prevents versions older than 2.8.3. The full dependency audit reports
  zero known advisories. CI now rejects high/critical audit findings.
- ESLint stays on 9.39.5 because the current React/accessibility plugins do not
  declare ESLint 10 support. It is EOL but has no current audit findings; migrate
  when compatible plugins are available rather than forcing peer overrides.
- CI, Docker and package engines use Node 22; pnpm is pinned to 10.24.0.
- Docker build arguments default to the real site URL and Formspree ID, so an
  ordinary build retains working metadata and contact configuration.
- Preserve public/resume.pdf exactly as supplied by Jayden (commit 91fb5f8,
  2026-09-23). SHA-256:
  460d0379610fedc010946aa969344e144501517f747b7f1c1bd1e9b29033a45f.
- Spotr screenshot: public/spotr-pipeline.webp, 1600 x 1000, full-size link present.
- Unknown public repository URLs for the KV store and chat app remain hidden.
- Person JSON-LD uses affiliation for the current university.

## Git history

At Jayden's explicit request, co-author and session trailers were removed from
all history, and the cleaned main was force-pushed. origin/main is the clean
history. Never merge pre-rewrite history back in, and add no co-author
trailers to new commits. The original history is recoverable from a local Git
bundle under the Windows temporary directory portfolio-release-20260923.

Local branch codex/main-history-clean is an ancestor of main and can be
deleted. Local main may lag origin/main; fast-forward it rather than merging.

## Umami on hp-envy

The public reference is deploy/umami/compose.example.yml, containing only the
portfolio, Umami and PostgreSQL services. Merge those definitions into the live
apps stack; it is not a replacement for the complete homelab Compose file.
The user's full updated apps-compose.yml is retained locally and ignored by Git.
It was removed from unpublished commit history so unrelated services and personal
configuration are not included in a future push. The old standalone Compose and
build-argument override were removed to avoid conflicting instructions.

- Umami joins apps_net and traefik_net; PostgreSQL joins apps_net only.
- Database storage is a bind mount at ${CONFIG_ROOT}/umami/db.
- No extra network, named Docker volume or Umami host ports are used.
- Traefik uses websecure, TLS, resolver cf and the existing TRAEFIK_NET.
- Add entries from deploy/umami/.env.example to the existing apps .env; do not
  replace that environment file. Follow deploy/umami/README.md for activation.
- If a named-volume database already exists, migrate it before changing mounts.

Umami is live on hp-envy and the user has confirmed visits are recorded.
The tracker only loads when both NEXT_PUBLIC_UMAMI_* build arguments are set,
and it only counts jmistry.com, so LAN/Tailscale previews are not tracked.

## Validation and preview

- Frozen-lockfile install, full lint, TypeScript and production build passed
  against Next.js 16.3.6. Full dependency audit: zero known advisories.
- The standalone server serves the homepage, real 404, robots, sitemap, icon,
  social image, new resume and screenshot. The PDF matches the supplied bytes.
- Responsive checks cover 320, 390, 768, 1024 and 1440px with no horizontal
  overflow, missing anchor targets or visible portfolio text below 14px.
- Calendly lives in components/Scheduling.tsx and loads near the viewport. It
  reserves embed space and keeps a direct link. No booking was submitted.
- Contact-form required-field validation passed; real delivery is untested.
  Do not send a test message without explicit authorization.
- Compose was checked against the official schema and compared with the supplied
  apps stack. Docker is unavailable here, so no container build/start is claimed.
- Lighthouse 13.5.0 on the ba4d696-era production preview (predates the
  theme work; rerun before the next release): mobile
  96/100/100/100; desktop 100/100/100/100 (performance/accessibility/best
  practices/SEO). CLS is zero in both reports. Reports completed without audit
  errors or warnings; the Windows CLI reported a temporary-profile cleanup
  permission error after saving the reports. This is not a page audit failure.
- Keyboard pass (same era): all 31 desktop and 27 mobile portfolio controls show
  visible focus. The five expanded mobile-menu links are keyboard reachable;
  Escape closes the menu and restores button focus. Calendly's meeting links
  are reachable, have a visible background highlight, and allow Tab to leave
  the iframe. Initial-load Lighthouse does not exercise the entire booking flow.

LAN: http://10.5.1.23:3100. Tailscale: http://100.100.22.25:3100.
Both preview paths were confirmed by the user. Rerun both Windows forwarding
setup modes after WSL's IP changes. The user-supplied resume remains unedited.
