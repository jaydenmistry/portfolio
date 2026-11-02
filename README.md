# jmistry.com

My personal portfolio, live at [jmistry.com](https://jmistry.com). I'm a
computer science student at the University of Georgia, and the site covers the
products I've built and the infrastructure I run. I built it with Next.js and
host it myself on my homelab.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshot-dark.jpg">
  <img alt="The jmistry.com home page, with the hero heading “I build full-stack products, and I run the infrastructure they ship on.”" src="docs/screenshot-light.jpg">
</picture>

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling and motion:** Tailwind CSS, Motion for gestures and springs, CSS
  scroll-driven animations for scroll reveals
- **Testing:** Playwright smoke tests with axe accessibility checks, run in
  GitHub Actions
- **Hosting:** Docker on my homelab, behind Traefik and Cloudflare
- **Services:** Calendly for scheduling, Formspree for the contact form, and
  Umami (self-hosted) for analytics

## Design decisions

I based the design on Apple's Human Interface Guidelines. Their sites put the
content first and apply a small set of rules everywhere, which is what I wanted
for a portfolio. Every rule I settled on is written down in
[`DESIGN.md`](DESIGN.md), so the site stays consistent as I change it. These
are the bigger decisions.

**Color.** The palette is neutral surfaces with one purple accent. Every color
is a token with a light and a dark value, and components only use the tokens,
never raw hex values. I checked each text and background pair against WCAG
contrast requirements and recorded the ratios in `DESIGN.md`. The accent is a
lighter shade in dark mode so it still passes there.

**Type.** On Apple devices the site uses SF Pro from the system. Apple's
license doesn't allow serving SF Pro from a website, so everywhere else it uses
Inter, the closest open font, which I self-host. Apple devices pick the system
font first, so they never download Inter.

**Theme.** The site follows the operating system's light or dark setting by
default, and visitors can pin Light or Dark. The saved choice is applied before
the page first paints, so it never flashes the wrong theme.

**Motion.** Animations use springs described by damping and response, the same
two parameters Apple uses, so they settle naturally and can be grabbed and
reversed mid-animation. The mobile menu sheet and the screenshot viewer follow
your finger, and whether they close depends on how fast you flick them. Scroll
reveals are tied to scroll position instead of timers, so jumping to a section
from a link shows it already in place. Text never fades in, so it's readable
from the first frame, and with reduced motion turned on everything just shows
in its final state.

**Content.** All of the copy lives in one file,
[`lib/data.ts`](lib/data.ts). I don't put any metric or date on the site that
isn't real, so if a fact is missing the page leaves that field out instead of
showing a placeholder.

**Privacy.** The site sets no cookies, and the analytics run on Umami, which I
self-host and which doesn't use cookies either. So there's no cookie banner,
and the [privacy page](https://jmistry.com/privacy) only states practices I've
verified.

## How it ships

Every push to `main` runs CI in GitHub Actions. Specifically, it audits the
dependencies for known vulnerabilities, lints, builds, and runs the Playwright
smoke tests. The tests cover navigation, the mobile menu, the theme control,
the screenshot viewer, contact form validation, and axe accessibility checks in
both themes.

Nothing deploys until that passes. A systemd timer on my homelab checks GitHub
every two minutes, and once CI is green on a new commit it pulls the commit,
rebuilds the Docker image and waits for the container's health check. If the
new version isn't healthy it rolls back to the previous image by itself, and
either way it sends me a Discord message. The image is a multi-stage build that
runs Next.js in standalone mode as a non-root user. The deploy script and its
systemd units are in [`deploy/homelab`](deploy/homelab).

## How I use AI

I use AI coding tools to save time on the tedious parts of a project. I don't
use them to generate the project for me, the design, structure and decisions
are mine. Specifically, I use them for things like:

- writing boilerplate and repetitive markup once I've decided what a component
  should do
- drafting Playwright tests, and scripts that measure the layout, like checking
  that every dot on a timeline sits on its line at each screen width
- checking contrast ratios across the color tokens
- reading through changelogs and security advisories when I upgrade
  dependencies
- first drafts of shell scripts and documentation

I read every line it writes before it gets committed, and I change or throw out
anything I don't understand or don't agree with. AI can be confidently wrong,
so I review its output the same way I'd review a pull request from someone
else. For example, during one upgrade it pinned Next.js to a version that still
had a known security vulnerability. I caught it when I checked the advisories,
and moved it to a patched release. I also keep commits small so each one is
easy to review, and nothing reaches the live site without passing CI.

## Running it locally

You'll need Node.js 22.13 or newer and pnpm 10.

```bash
pnpm install
pnpm dev                                # http://localhost:3000

pnpm exec playwright install chromium   # once
pnpm build && pnpm test:smoke           # production build and smoke tests
```

## Repository layout

```
app/         routes, root layout, global styles and color tokens, fonts
components/  page sections and interactive pieces (menu sheet, viewer, diagrams)
lib/         site content (data.ts), motion presets, theme and analytics
tests/       Playwright smoke and accessibility tests
deploy/      homelab deploy script, systemd units, Umami setup
docs/        development and operations guide
```

## More detail

- [`DESIGN.md`](DESIGN.md) has every visual rule: tokens, type scale, layout,
  materials and motion.
- [`docs/development.md`](docs/development.md) covers previewing on a LAN or
  Tailscale, Docker, analytics, editing content and the pre-deploy checklist.
- [`deploy/homelab/README.md`](deploy/homelab/README.md) explains the automatic
  deploys.
