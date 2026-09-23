# jmistry.com — Portfolio

Personal portfolio of **Jayden Mistry**, a software engineer who builds full-stack
products and runs the infrastructure they ship on.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. Light by
default, with an optional dark theme from the header toggle. No animation
libraries: diagrams draw with CSS, triggered by a small IntersectionObserver hook,
and render fully drawn under `prefers-reduced-motion`. Visual rules live in
[`DESIGN.md`](DESIGN.md).

## Develop

Use Node.js 22.13 or newer within the Node 22 release line, and pnpm 10.
CI and the Docker image also use Node 22.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

Smoke tests (Playwright, Chromium) run against the production build and in CI.
They cover section navigation, the mobile menu, critical links, theme
persistence and axe accessibility checks in both themes. Calendly and
Formspree requests are blocked so results never depend on those services.

```bash
pnpm exec playwright install chromium   # once
pnpm build && pnpm test:smoke
```

## LAN and Tailscale preview (WSL)

Serve the production build to other computers on the local network. WSL runs
in NAT mode, so Windows has to forward the port. The default setup restricts
access to the local subnet; optional Tailscale access is described below.
No router forwarding or public tunnel is involved.

1. In WSL: `pnpm preview:lan` (add `--build` to rebuild first). It listens on
   `0.0.0.0:3100`; set `PORT` to change it.
2. On Windows, in an **elevated** PowerShell from the repo folder:

   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\windows-lan-preview.ps1
   ```

   It adds a portproxy from the Windows LAN IP to the current WSL IP and one
   inbound firewall rule scoped to the Private profile, the LAN adapter and
   the local subnet, then prints the URL to open. Run it again after WSL
   restarts, because the WSL IP changes. Undo with `-Remove`.

For access from other devices on your Tailscale network, also run this in
elevated PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\windows-lan-preview.ps1 -Tailscale
```

This adds a separate listener on the Windows Tailscale IPv4 address and keeps
LAN access intact. The firewall rule allows TCP on the preview port only through
the Tailscale adapter, from `100.64.0.0/10` (Tailscale's peer IPv4 range).
Your tailnet access policy still applies. Open the printed URL from another
Tailscale-connected device; a host-side check cannot confirm peer access.
Run both setup commands after WSL restarts. Use `-Tailscale -Remove` to remove
only Tailscale access; plain `-Remove` removes only LAN access.

## Docker

The Dockerfile builds a self-contained image (Next.js `output: 'standalone'`,
multi-stage, runs as the non-root `node` user, listens on port 3000):

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 portfolio
```

The live Compose file is `~/docker/stacks/apps/compose.yml` on hp-envy. The
portfolio and Umami service definitions are in
[`deploy/umami/compose.example.yml`](deploy/umami/compose.example.yml). Merge
those definitions into the existing stack. The full homelab configuration is
kept locally in the ignored `deploy/umami/apps-compose.yml` file.

## Editing content

Everything editable lives in [`lib/data.ts`](lib/data.ts): site identity and links,
hero copy, projects, the infrastructure topology (nodes, edges, descriptions),
skill groups, experience entries, and contact copy. Optional project fields
(role, timeline, status, repo) are simply omitted from the page when unset.
Components read from that file — you should rarely need to touch them for copy changes.

The Contact section includes an inline Calendly scheduler. Set its link with
`contact.calendlyUrl`; the script loads as the section approaches the viewport.
A fixed-size loading placeholder prevents the scheduler from moving surrounding
content. The direct Calendly link remains available if the embed cannot load.

## Analytics setup

Umami runs in the existing hp-envy apps Compose stack using `apps_net` and
`traefik_net`. Its database uses `apps_net` and stores data in
`${CONFIG_ROOT}/umami/db` through a bind mount. See
[`deploy/umami/README.md`](deploy/umami/README.md) for environment variables and
activation steps. No separate stack, named volume, or override file is needed.
Analytics remain disabled until the tracker URL and website ID are supplied
at build time.

Click events (defined in [`lib/analytics.ts`](lib/analytics.ts)) appear under
Events in Umami:

- `resume-click`, with `location`: `nav`, `mobile-menu`, `hero` or `contact`.
- `project-repo-click`, with `project`: the project id. These appear once a
  project has a `repo` URL.

They count clicks, not who clicked.

## Tooling compatibility

ESLint remains pinned to 9.39.5 pending compatible React and accessibility
plugins. As of 2026-09-22, the registry releases `eslint-plugin-react@7.37.5`
and `eslint-plugin-jsx-a11y@6.10.2` do not declare ESLint 10 support. ESLint 9
is end-of-life; revisit the migration when the plugin stack supports 10,
rather than overriding its peer requirements or dropping checks.

CI runs `pnpm audit --audit-level=high` before lint and build. The lockfile was
refreshed with Next.js 16.3.6; the `yaml@<2.8.3` override keeps Tailwind's
configuration loader on a patched YAML release without changing Tailwind majors.

## Checklist before deploying

- [x] Spotr screenshot: `public/spotr-pipeline.webp` (1600 × 1000, 16:10), set as
      `figure.src` in `lib/data.ts`. Replace the file to update it; keep 16:10 or
      it is cropped from the top. Removing `src` brings back the placeholder.
- [x] Updated résumé at `public/resume.pdf`; every Résumé link points there.
      Its LaTeX source isn't in this repo.
- [ ] Add repo URLs (`repo`) for the key-value store and chat projects if public.
- [x] Contact form is configured for Formspree (`xwvgkeda`, default in `lib/data.ts`;
      `NEXT_PUBLIC_FORMSPREE_ID` overrides it at build time).
- [ ] Confirm real contact-form delivery; local validation does not send a message.
- [ ] If the site won't live at `https://jmistry.com`, update `metadataBase` and the
      Open Graph URL in `app/layout.tsx`.
