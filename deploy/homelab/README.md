# Automatic deploys on hp-envy

Two systemd timers look after the portfolio in the apps stack
(`~/docker/stacks/apps/compose.yml`). Both post to the Discord webhook in
`TRACKER_DISCORD_WEBHOOK_URL`. Registry images are updated separately with
dockcheck.

| Timer | Script | What it does |
|---|---|---|
| `portfolio-deploy.timer` (every 2 min) | `deploy-portfolio.sh` | When `origin/main` moves and CI passed on the new commit, fast-forwards `~/docker/data/portfolio`, rebuilds `portfolio`, waits for it to be healthy, and rolls back to the previous image and commit if it is not. A commit whose CI failed, or that failed to deploy, is never retried; the next push replaces it. |
| `umami-backup.timer` (nightly, 03:30) | `backup-umami.sh` | Dumps the Umami database with `pg_dump` to `~/docker/backups/umami/umami-<date>.sql.gz` and deletes dumps older than 30 days. A failed dump leaves no file behind and posts to Discord. |

The internship tracker keeps its own `deploy-internship-tracker.sh`.

## Requirements

- `~/docker/data/portfolio` is a clean clone of
  `https://github.com/jaydenmistry/portfolio.git` on `main`.
- The `portfolio` service in compose.yml names its image, so a release can be
  rolled back:

  ```yaml
  portfolio:
    image: portfolio:local
    build:
      ...
  ```

- `git`, `curl`, `flock` and `python3` on the host, and `jay_` in the `docker`
  group.

## Install

```sh
install -m 755 ~/docker/data/portfolio/deploy/homelab/*.sh ~/docker/bin/
sudo cp ~/docker/data/portfolio/deploy/homelab/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-deploy.timer umami-backup.timer
```

The timers run the copies in `~/docker/bin`, so run the `install` line again
whenever a script here changes.

## Operate

```sh
systemctl list-timers 'portfolio-deploy*' 'umami-backup*'
journalctl -u portfolio-deploy -f              # follow portfolio deploys
sudo systemctl start umami-backup              # back up Umami now
rm ~/.local/state/portfolio-deploy/failed      # retry a failed commit
```

Manual portfolio rollback: `docker image tag portfolio:previous portfolio:local`,
then `docker compose ... up -d --no-build portfolio`.

Restore an Umami dump into an empty database (stop `umami` first):

```sh
gunzip -c ~/docker/backups/umami/umami-<date>.sql.gz | docker exec -i umami-db psql -U umami -d umami
```

The dumps sit on the same disk as the database. Copy them somewhere else too
(another machine or cloud storage) if losing the disk shouldn't lose the data.

## Optional: only accept traffic through Cloudflare

Public DNS points jmistry.com at Cloudflare, but anyone who finds the home IP
can reach Traefik directly and skip Cloudflare. An IP allow list on the
portfolio router closes that. It has to include the tailnet range
(`100.64.0.0/10`), because Tailscale split DNS sends your own devices straight
to Traefik. On Traefik v2 the middleware is `ipwhitelist` instead of
`ipallowlist`.

```yaml
labels:
  - "traefik.http.middlewares.cloudflare-only.ipallowlist.sourcerange=173.245.48.0/20,103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,141.101.64.0/18,108.162.192.0/18,190.93.240.0/20,188.114.96.0/20,197.234.240.0/22,198.41.128.0/17,162.158.0.0/15,104.16.0.0/13,104.24.0.0/14,172.64.0.0/13,131.0.72.0/22,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32,100.64.0.0/10"
  - "traefik.http.routers.portfolio.middlewares=cloudflare-only"
```

The ranges are Cloudflare's published list (cloudflare.com/ips) as of
2026-11-03; check it now and then. The `ports:` mapping on the portfolio
service also publishes the container on the host's network directly. Traefik
reaches it over `traefik_net`, so remove that mapping if nothing else uses it.
