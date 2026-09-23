# Umami in the hp-envy apps stack

`apps-compose.yml` is the complete apps Compose file supplied by Jayden, with
Umami added and the portfolio build arguments included. It belongs at
`~/docker/stacks/apps/compose.yml` on hp-envy. No separate analytics stack or
Compose override is required. Review any newer host-side changes before replacing
the host file with this snapshot; all other supplied services are preserved.

The setup uses the existing Traefik entrypoint `websecure`, TLS resolver `cf`,
and network `${TRAEFIK_NET}`. Umami joins `apps_net` and `traefik_net`; its database
joins only `apps_net`. There is no `umami-internal` network or named Docker volume.
PostgreSQL data is bind-mounted at `${CONFIG_ROOT}/umami/db` on the host. Other
containers on `apps_net` can reach the database, which requires authentication.
Neither Umami service publishes a host port.

## 1. Configure the existing apps environment

Keep the existing apps `.env`, including `CONFIG_ROOT` and `TRAEFIK_NET`. Add or
update the entries in this directory's `.env.example`; do not replace the apps
environment file with that example. Generate two separate values on hp-envy:

```bash
openssl rand -hex 24  # UMAMI_DB_PASSWORD
openssl rand -hex 32  # UMAMI_APP_SECRET
```

Use the first output as the database password and the second as the app secret.
The hexadecimal password is safe inside the database connection URL. Keep both
values stable and out of Git. Leave `NEXT_PUBLIC_UMAMI_WEBSITE_ID` empty until the
website has been created in Umami. Keep the existing Formspree ID if it differs
from the example.

Route `analytics.jmistry.com` through the same Cloudflare/Traefik ingress as the
portfolio. The tracker script and event endpoint must be reachable by visitors;
an interactive SSO redirect on the entire analytics hostname prevents tracking.

If Umami already has data in a named volume, migrate that database before
switching to the bind mount. An empty host directory initializes a new database;
changing the mount does not copy existing accounts or analytics automatically.

## 2. Start Umami

After the updated Compose file and environment are on hp-envy, run each command
only after the previous one succeeds:

```bash
cd ~/docker/stacks/apps
docker compose config --quiet
docker compose up -d umami-db umami
docker compose ps umami-db umami
```

Open `https://analytics.jmistry.com`, sign in with the initial account
(`admin` / `umami`), and immediately change its password. Under Websites, add
`jmistry.com` and copy its website ID into `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in the
existing apps `.env`.

## 3. Rebuild only the portfolio

`NEXT_PUBLIC_*` values are embedded at build time. The combined Compose file
already passes them as build arguments, so no override file is needed. These
commands deploy the source currently checked out under `${CONFIG_ROOT}/portfolio`:

```bash
cd ~/docker/stacks/apps
docker compose config --quiet
docker compose build portfolio
docker compose up -d --no-deps portfolio
```

## 4. Verify and maintain

- Both Umami containers report healthy.
- `https://analytics.jmistry.com/script.js` returns JavaScript without an SSO redirect.
- The portfolio includes the script and the correct `data-website-id`.
- A visit to `https://jmistry.com` appears in Umami. LAN/Tailscale previews are
  excluded by the tracker's `data-domains="jmistry.com"` setting.

To disable tracking, clear both `NEXT_PUBLIC_UMAMI_*` entries and rebuild the
portfolio. Preserve `${CONFIG_ROOT}/umami/db` to retain accounts and analytics.
Use PostgreSQL backups (`pg_dump`) for a running database, or stop the database
before copying its data directory. This repository does not configure automatic
Umami backups or activate the services remotely.

Upstream references: [installation](https://docs.umami.is/docs/install),
[tracker configuration](https://docs.umami.is/docs/tracker-configuration).
