# Automatic deploys on hp-envy

Two systemd timers keep the apps stack (`~/docker/stacks/apps/compose.yml`)
current. Both post to the Discord webhook in `TRACKER_DISCORD_WEBHOOK_URL`.

| Timer | Script | What it does |
|---|---|---|
| `portfolio-deploy.timer` (every 2 min) | `deploy-portfolio.sh` | When `origin/main` moves and CI passed on the new commit, fast-forwards `~/docker/data/portfolio`, rebuilds `portfolio`, waits for it to be healthy, and rolls back to the previous image and commit if it is not. A commit whose CI failed, or that failed to deploy, is never retried; the next push replaces it. |
| `apps-image-update.timer` (nightly, 04:30) | `update-images.sh` | Pulls newer images for every running service that uses a registry image and recreates only the containers whose image changed, then waits for them to be healthy. Services built from source (portfolio, internship-tracker, openclaw) and stopped services are left alone. Old images are pruned only when everything came back healthy. |

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
sudo systemctl enable --now portfolio-deploy.timer apps-image-update.timer
```

## Operate

```sh
systemctl list-timers 'portfolio-deploy*' 'apps-image-update*'
journalctl -u portfolio-deploy -f              # follow portfolio deploys
sudo systemctl start apps-image-update         # update images now
rm ~/.local/state/portfolio-deploy/failed      # retry a failed commit
```

Manual portfolio rollback: `docker image tag portfolio:previous portfolio:local`,
then `docker compose ... up -d --no-build portfolio`.
