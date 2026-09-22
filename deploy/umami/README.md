# Umami on hp-envy

Prepared against the apps Compose file supplied on 2026-09-22:
Traefik entrypoint `websecure`, TLS enabled, resolver `cf`, and the external
network named by `TRAEFIK_NET`. This configuration has not been activated.

## 1. Prepare the separate analytics stack

After the approved portfolio changes have reached the host, copy this directory
to `~/docker/stacks/umami` (or keep a stable absolute path to it). In that folder:

```bash
cp .env.example .env
chmod 600 .env
openssl rand -hex 24  # UMAMI_DB_PASSWORD
openssl rand -hex 32  # UMAMI_APP_SECRET
```

Edit `.env`: copy `TRAEFIK_NET` from the apps stack's `.env` and set the two generated
secrets. Do not paste the entire apps `.env` or commit secrets. Set `UMAMI_HOST`
to the analytics hostname, and arrange DNS/Cloudflare routing to the existing
Traefik ingress, as for the portfolio. No database or application host ports
are published by this stack.

Validate and start when ready:

```bash
docker compose config --quiet
docker compose up -d
docker compose ps
```

Open `https://analytics.jmistry.com`, sign in using the documented initial account
(`admin` / `umami`), and immediately replace its password. Add a website for
`jmistry.com` and copy its website ID. Complete these account steps yourself.
The tracker path and event endpoint must remain reachable by site visitors;
putting the entire analytics hostname behind an interactive SSO redirect would
prevent tracking from working.

## 2. Pass the tracker configuration into the portfolio build

The current apps stack uses the short `build: ${CONFIG_ROOT}/portfolio/.` form.
Runtime environment variables cannot supply `NEXT_PUBLIC_*` values to a completed
Next.js build. The included `portfolio-build-args.yml` is an override for that
existing service, preserving its ports, healthcheck, labels and networks.

Add to `~/docker/stacks/apps/.env`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://jmistry.com
NEXT_PUBLIC_FORMSPREE_ID=xwvgkeda
NEXT_PUBLIC_UMAMI_SRC=https://analytics.jmistry.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<copy from Umami>
```

Copy `portfolio-build-args.yml` into `~/docker/stacks/apps/portfolio-build-args.yml`.
From that directory, after approving the portfolio deployment:

```bash
docker compose -f compose.yml -f portfolio-build-args.yml config --quiet
docker compose -f compose.yml -f portfolio-build-args.yml build portfolio
docker compose -f compose.yml -f portfolio-build-args.yml up -d --no-deps portfolio
```

Use both `-f` arguments for subsequent portfolio rebuilds, or fold the override's
`build` mapping into the portfolio service in `compose.yml`. Do not replace the
whole apps file with the override.

## 3. Verify

- The analytics application and database report healthy.
- `https://analytics.jmistry.com/script.js` returns JavaScript without a sign-in redirect.
- The deployed portfolio includes the script and the correct `data-website-id`.
- A visit to `https://jmistry.com` appears in Umami. Local LAN/Tailscale previews
  are excluded by the portfolio tracker's `data-domains="jmistry.com"` setting.

To disable tracking, clear both Umami build arguments and rebuild only the
portfolio service. Keep the Umami database volume if retaining collected data.

Upstream references: [installation](https://docs.umami.is/docs/install),
[tracker configuration](https://docs.umami.is/docs/tracker-configuration).
