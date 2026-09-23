# Working notes

## Current scope - 2026-09-23

The blueprint redesign is approved. Keep its layout and follow DESIGN.md.
Calendly, Umami setup and maintenance are complete locally. Separate project
pages and technical articles remain deferred. Do not push or deploy until the
user explicitly requests it.

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
- Preserve public/resume.pdf exactly as supplied by Jayden on 2026-09-23.
  SHA-256: 552f89b3ab70bda3e142e065ba91db05bac5c86374b6b3e615080dad19fcc1db.
  This newest copy takes precedence over both earlier branch and remote PDFs.
- Spotr screenshot: public/spotr-pipeline.webp, 1600 x 1000, full-size link present.
- Unknown public repository URLs for the KV store and chat app remain hidden.
- Person JSON-LD uses affiliation for the current university.

## Git history

At Jayden's explicit request, co-author and session trailers were removed from
all local release ancestry, including counterparts of commits already published.
Original authors, commit contents and project history were retained. Commit IDs
changed. The original history is recoverable from a local Git bundle under the
Windows temporary directory portfolio-release-20260923.

The clean counterpart of origin/main is codex/main-history-clean. It has been
merged into redesign/blueprint, resolving the binary resume conflict in favor
of the newest supplied PDF. The local main branch remains on its cleaned notes
commit; the release work is on redesign/blueprint.

GitHub and origin tracking refs remain unchanged and accurately show the old
published history. Publishing the sanitized history will require an explicitly
authorized force-with-lease push after checking for any newer remote work.
Do not merge the old, unsanitized origin/main back into this branch, as that
would reintroduce the removed trailers. No push has been performed.

## Umami on hp-envy

The canonical configuration is deploy/umami/apps-compose.yml: the user's complete
apps stack with Umami added and portfolio NEXT_PUBLIC_* build arguments included.
All unrelated supplied services are preserved. The old standalone Compose and
build-argument override were removed to avoid conflicting instructions.

- Umami joins apps_net and traefik_net; PostgreSQL joins apps_net only.
- Database storage is a bind mount at ${CONFIG_ROOT}/umami/db.
- No extra network, named Docker volume or Umami host ports are used.
- Traefik uses websecure, TLS, resolver cf and the existing TRAEFIK_NET.
- Add entries from deploy/umami/.env.example to the existing apps .env; do not
  replace that environment file. Follow deploy/umami/README.md for activation.
- If a named-volume database already exists, migrate it before changing mounts.

No remote homelab access was supplied, and no services were activated remotely.
Host activation still requires DNS, secrets, an Umami account/website ID and an
approved portfolio deployment. Umami build inclusion was verified both enabled
and disabled, using a test ID only during validation; it is absent from the final
preview build. LAN/Tailscale hosts are excluded from tracking.

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
- No fresh Lighthouse score is claimed. Earlier scores predate Calendly.

LAN: http://10.5.1.23:3100. Tailscale: http://100.100.22.25:3100.
Both preview paths were confirmed by the user. Rerun both Windows forwarding
setup modes after WSL's IP changes. The user-supplied resume remains unedited.
