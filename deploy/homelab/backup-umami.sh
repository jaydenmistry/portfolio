#!/usr/bin/env bash
# Dumps the Umami database to a dated, compressed file and deletes dumps older
# than KEEP_DAYS. Run by a systemd timer (umami-backup.timer).
set -euo pipefail

DEST="${UMAMI_BACKUP_DIR:-$HOME/docker/backups/umami}"
CONTAINER="${UMAMI_DB_CONTAINER:-umami-db}"
KEEP_DAYS=30
ENV_FILE="$HOME/docker/.env"

notify() {
  local hook
  hook=$(grep -E '^TRACKER_DISCORD_WEBHOOK_URL=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  [ -n "$hook" ] && curl -fsS -m 10 -H 'content-type: application/json' \
    -d "{\"content\":\"[umami backup] $1\"}" "$hook" >/dev/null || true
}

mkdir -p "$DEST"
file="$DEST/umami-$(date +%Y%m%d-%H%M%S).sql.gz"

# Dump to a temporary name, so a failed or empty dump never looks like a good one.
if docker exec "$CONTAINER" pg_dump -U umami -d umami --no-owner | gzip > "$file.partial" \
   && [ "$(gzip -dc "$file.partial" | head -c 1 | wc -c)" -eq 1 ]; then
  mv "$file.partial" "$file"
else
  rm -f "$file.partial"
  echo "backup failed"
  notify "FAILED. See: journalctl -u umami-backup"
  exit 1
fi

find "$DEST" -name 'umami-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
echo "saved $file ($(du -h "$file" | cut -f1))"
