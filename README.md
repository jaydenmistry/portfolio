# jmistry.com — Portfolio

Personal portfolio of **Jayden Mistry** — software engineer focused on full-stack
products, backend systems, and production-minded infrastructure.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. No animation
libraries — motion is CSS-driven, triggered by a small IntersectionObserver helper,
and fully disabled under `prefers-reduced-motion`.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

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
hero copy, the hero system panel, projects, the infrastructure topology (nodes,
edges, descriptions), skill groups, metrics, experience entries, and contact copy.
Components read from that file — you should rarely need to touch them for copy changes.

## Checklist before deploying

- [ ] Drop your resume PDF at `public/resume.pdf` (all "Download Resume" buttons point there).
- [ ] Set the real GitHub repo URL for the key-value store project in `lib/data.ts`.
- [x] Contact form submits to Formspree (form `xwvgkeda`, default in `lib/data.ts`;
      `NEXT_PUBLIC_FORMSPREE_ID` overrides it at build time).
- [ ] If the site won't live at `https://jmistry.com`, update `metadataBase` and the
      Open Graph URL in `app/layout.tsx`.
