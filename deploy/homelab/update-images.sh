#!/usr/bin/env bash
# Pulls newer registry images for the apps stack and recreates the running
# containers that use them. Services built from source (portfolio,
# internship-tracker, openclaw) are left to their own deploys. Run by a
# systemd timer (apps-image-update.timer).
set -euo pipefail

STACK="$HOME/docker/stacks/apps"
ENV_FILE="$HOME/docker/.env"
STATE="$HOME/.local/state/apps-image-update"
COMPOSE=(docker compose --project-directory "$STACK" --env-file "$ENV_FILE" -f "$STACK/compose.yml")

mkdir -p "$STATE"
exec 9>"$STATE/lock"
flock -n 9 || { echo "an update is already running"; exit 0; }

notify() {
  local hook
  hook=$(grep -E '^TRACKER_DISCORD_WEBHOOK_URL=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  [ -n "$hook" ] && curl -fsS -m 10 -H 'content-type: application/json' \
    -d "{\"content\":\"[image update] $1\"}" "$hook" >/dev/null || true
}

wait_ready() {  # container id, timeout in seconds; containers without a healthcheck only need to be running
  local id=$1 deadline=$(( $(date +%s) + $2 )) s
  while [ "$(date +%s)" -lt "$deadline" ]; do
    s=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$id" 2>/dev/null || echo missing)
    case "$s" in
      healthy) return 0 ;;
      running) sleep 15; [ "$(docker inspect -f '{{.State.Status}}' "$id" 2>/dev/null)" = running ] && return 0 ;;
      unhealthy | exited | dead | missing) return 1 ;;
    esac
    sleep 10
  done
  return 1
}

# Services that run a registry image: no build section, and not pull_policy: never.
mapfile -t pullable < <("${COMPOSE[@]}" config --format json | python3 -c '
import json, sys
for name, svc in json.load(sys.stdin)["services"].items():
    if "build" not in svc and svc.get("pull_policy") != "never":
        print(name)')

# Only touch what is already running; a stopped service stays stopped.
mapfile -t running < <("${COMPOSE[@]}" ps --services --status running)
targets=()
for s in "${pullable[@]}"; do
  [[ " ${running[*]} " == *" $s "* ]] && targets+=("$s")
done
[ "${#targets[@]}" -eq 0 ] && { echo "nothing to update"; exit 0; }

"${COMPOSE[@]}" pull --quiet "${targets[@]}"

declare -A before
for s in "${targets[@]}"; do before[$s]=$("${COMPOSE[@]}" ps -q "$s"); done

# Recreates only the containers whose image (or compose definition) changed.
"${COMPOSE[@]}" up -d --no-build --no-deps "${targets[@]}"

updated=() failed=()
for s in "${targets[@]}"; do
  id=$("${COMPOSE[@]}" ps -q "$s")
  [ "$id" = "${before[$s]}" ] && continue
  if wait_ready "$id" 600; then updated+=("$s"); else failed+=("$s"); fi
done

if [ "${#failed[@]}" -gt 0 ]; then
  # Keep the old images around for a manual rollback.
  echo "unhealthy after update: ${failed[*]}"
  notify "FAILED: ${failed[*]} unhealthy after update${updated:+; updated ${updated[*]}}. See: journalctl -u apps-image-update"
  exit 1
fi

docker image prune -f >/dev/null
if [ "${#updated[@]}" -gt 0 ]; then
  echo "updated: ${updated[*]}"
  notify "updated ${updated[*]}"
else
  echo "all images current"
fi
