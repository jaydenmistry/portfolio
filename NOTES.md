# Working notes

## Current scope - 2026-10-29

Branch ui-redesign (from redesign/blueprint at b109df7, so it carries the
unpushed privacy commits) replaces the blueprint look with an Apple-style
redesign. Jayden's calls: replace the blueprint entirely, use the system font,
follow the OS theme with a System / Light / Dark control, add Motion
(pinned 14.2.0) for spring and gesture animations, and use translucent
materials. DESIGN.md holds the new rules. Pushed to origin/ui-redesign at
Jayden's request; not merged to main or deployed.

The privacy notice questions below are still open and also apply to this
branch. The theme section of the privacy page was updated for the System
option.

Earlier (2026-09-23): the blueprint redesign, Calendly and Umami are on main
and deployed at https://jmistry.com.

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

## Privacy notice - 2026-09-24

app/privacy/page.tsx describes only practices verified in code or by
observation; its facts live in lib/privacy.ts. Before release, confirm with
Jayden and update the page if any answer changes it:

- Location/jurisdiction, and whether the site is solely a job-search
  portfolio or also offers paid services.
- Retention: how long contact emails, Formspree submissions (plan-dependent),
  Calendly bookings and Umami data (self-hosted default: kept until deleted)
  are kept, and whether Jayden deletes them on a schedule.
- Whether Traefik or other homelab services log visitor IP addresses, and for
  how long.
- The live Umami environment matches the defaults assumed on the page: no
  SALT_ROTATION override (monthly visitor-identifier rotation) and no stored
  IP address.
- jayden@jmistry.com as the privacy contact; set effectiveDate on release.

Verified 2026-09-24: analytics.jmistry.com has no public DNS record
(NXDOMAIN on 1.1.1.1, 8.8.8.8 and 9.9.9.9), so only tailnet devices can load
the tracker. Calendly's banner and Cookie settings appear once
hide_gdpr_banner is removed; a local DNS blocklist here blocks
cdn.cookielaw.org, which hides them during local testing.

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
- Lighthouse 13.5.0, 2026-09-23, production preview with the theme work,
  three runs each, cold cache: mobile light 96/100/100/100 (all runs);
  mobile dark 99, 99, 96 performance, otherwise 100; desktop 100 across all
  categories in both themes. CLS 0 everywhere. The mobile LCP element is the
  hero paragraph in every run; its 2.2s/2.7s split is simulated-throttling
  variance, not theme related. Dark runs were confirmed dark by screenshot.
- Calendly: selecting event type, date and time, then switching theme twice,
  kept the details page and the selected slot. No booking was submitted.
- `pnpm test:smoke` covers navigation, the mobile menu, links, theme
  persistence and axe checks in both themes; it also runs in CI. (Blueprint
  era; see the redesign section for the current suite.)
- Keyboard pass (same era): all 31 desktop and 27 mobile portfolio controls show
  visible focus. The five expanded mobile-menu links are keyboard reachable;
  Escape closes the menu and restores button focus. Calendly's meeting links
  are reachable, have a visible background highlight, and allow Tab to leave
  the iframe. Initial-load Lighthouse does not exercise the entire booking flow.

LAN: http://10.5.1.23:3100. Tailscale: http://100.100.22.25:3100.
Both preview paths were confirmed by the user. Rerun both Windows forwarding
setup modes after WSL's IP changes. The user-supplied resume remains unedited.
