# jmistry.com — Portfolio

Personal portfolio of **Jayden Mistry**, a software engineer who builds full-stack
products and runs the infrastructure they ship on.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. No animation
libraries: diagrams draw with CSS, triggered by a small IntersectionObserver hook,
and render fully drawn under `prefers-reduced-motion`. Visual rules live in
[`DESIGN.md`](DESIGN.md).

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## LAN preview (WSL)

Serve the production build to other computers on the local network. WSL runs
in NAT mode, so Windows has to forward the port; nothing is exposed beyond the
local subnet, and no router forwarding or tunnel is involved.

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

## Docker

The Dockerfile builds a self-contained image (Next.js `output: 'standalone'`,
multi-stage, runs as the non-root `node` user, listens on port 3000):

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 portfolio
```

The compose service definition lives in the homelab stack
(`~/docker/stacks/apps/compose.yml`), not in this repo.

## Editing content

Everything editable lives in [`lib/data.ts`](lib/data.ts): site identity and links,
hero copy, projects, the infrastructure topology (nodes, edges, descriptions),
skill groups, experience entries, and contact copy. Optional project fields
(role, timeline, status, repo) are simply omitted from the page when unset.
Components read from that file — you should rarely need to touch them for copy changes.

## Checklist before deploying

- [ ] Drop your resume PDF at `public/resume.pdf` (every Résumé link points there).
- [ ] Add the Spotr screenshot: save a 16:10 capture of the acquisition pipeline
      (1600 × 1000, WebP or PNG, ideally under 300 KB) as
      `public/images/spotr-pipeline.webp`, then set
      `src: '/images/spotr-pipeline.webp'` in the Spotr `figure` in `lib/data.ts`.
      Until then the page shows a labeled placeholder.
- [ ] Replace `public/resume.pdf` with a re-export that says December 2027. Its
      LaTeX source isn't in this repo.
- [ ] Add repo URLs (`repo`) for the key-value store and chat projects if public.
- [x] Contact form submits to Formspree (form `xwvgkeda`, default in `lib/data.ts`;
      `NEXT_PUBLIC_FORMSPREE_ID` overrides it at build time).
- [ ] If the site won't live at `https://jmistry.com`, update `metadataBase` and the
      Open Graph URL in `app/layout.tsx`.
