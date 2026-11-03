#!/usr/bin/env bash
# Deploys the portfolio when origin/main moves and CI has passed on the new
# commit. Run by a systemd timer (portfolio-deploy.timer).
set -euo pipefail

REPO="$HOME/docker/data/portfolio"
STACK="$HOME/docker/stacks/apps"
ENV_FILE="$HOME/docker/.env"
BRANCH=main
GITHUB_REPO=jaydenmistry/portfolio
CI_JOB=build  # the job in .github/workflows/ci.yml
SERVICE=portfolio
CONTAINER=portfolio
IMAGE=portfolio:local
STATE="$HOME/.local/state/portfolio-deploy"
COMPOSE=(docker compose --project-directory "$STACK" --env-file "$ENV_FILE" -f "$STACK/compose.yml")

mkdir -p "$STATE"
exec 9>"$STATE/lock"
flock -n 9 || { echo "a deploy is already running"; exit 0; }

notify() {
  local hook
  hook=$(grep -E '^TRACKER_DISCORD_WEBHOOK_URL=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  [ -n "$hook" ] && curl -fsS -m 10 -H 'content-type: application/json' \
    -d "{\"content\":\"[portfolio deploy] $1\"}" "$hook" >/dev/null || true
}

wait_healthy() {  # container name, timeout in seconds
  local name=$1 deadline=$(( $(date +%s) + $2 )) s
  while [ "$(date +%s)" -lt "$deadline" ]; do
    s=$(docker inspect -f '{{.State.Health.Status}}' "$name" 2>/dev/null || echo missing)
    [ "$s" = healthy ] && return 0
    [ "$s" = unhealthy ] && return 1
    sleep 10
  done
  return 1
}

# Prints success, failure or pending for CI's build job on a commit. Other
# checks on main (Dependabot's update runs) don't gate deploys. The repository
# is public, so this needs no token.
ci_status() {
  curl -fsS -m 15 -H 'accept: application/vnd.github+json' \
    "https://api.github.com/repos/$GITHUB_REPO/commits/$1/check-runs?check_name=$CI_JOB" |
    python3 -c '
import json, sys
runs = json.load(sys.stdin).get("check_runs", [])
if not runs or any(r["status"] != "completed" for r in runs):
    print("pending")
elif all(r["conclusion"] in ("success", "skipped", "neutral") for r in runs):
    print("success")
else:
    print("failure")'
}

cd "$REPO"
git fetch --quiet origin "$BRANCH"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
[ "$LOCAL" = "$REMOTE" ] && exit 0

# A commit that already failed is never retried. A new push replaces it.
if [ "$(cat "$STATE/failed" 2>/dev/null)" = "$REMOTE" ]; then exit 0; fi

# Only plain fast-forwards into a clean checkout.
git merge-base --is-ancestor "$LOCAL" "$REMOTE" \
  || { echo "origin/$BRANCH is not a fast-forward of $LOCAL; refusing"; notify "refused: history rewritten on $BRANCH"; exit 1; }
[ -z "$(git status --porcelain)" ] \
  || { echo "local changes in $REPO; refusing"; notify "refused: local changes in the checkout"; exit 1; }

# Wait for CI (lint, audit, build, smoke tests) on the new commit.
CI=$(ci_status "$REMOTE" || echo pending)
case "$CI" in
  pending) echo "waiting for CI on ${REMOTE:0:7}"; exit 0 ;;
  failure)
    echo "$REMOTE" > "$STATE/failed"
    notify "skipped ${REMOTE:0:7}: CI failed"
    exit 1 ;;
esac

echo "deploying ${LOCAL:0:7} -> ${REMOTE:0:7}"
docker image tag "$IMAGE" portfolio:previous 2>/dev/null || true
git merge --ff-only --quiet "origin/$BRANCH"

if "${COMPOSE[@]}" build "$SERVICE" \
   && "${COMPOSE[@]}" up -d --no-deps "$SERVICE" \
   && wait_healthy "$CONTAINER" 300; then
  rm -f "$STATE/failed"
  echo "deployed ${REMOTE:0:7}"
  notify "deployed $(git log -1 --format='%h %s' | tr -d '"\\')"
  exit 0
fi

echo "deploy of ${REMOTE:0:7} failed; rolling back to ${LOCAL:0:7}"
echo "$REMOTE" > "$STATE/failed"
git reset --hard --quiet "$LOCAL"
docker image tag portfolio:previous "$IMAGE" 2>/dev/null || true
"${COMPOSE[@]}" up -d --no-build --no-deps "$SERVICE" || true
notify "FAILED ${REMOTE:0:7}, rolled back to ${LOCAL:0:7}. See: journalctl -u portfolio-deploy"
exit 1
