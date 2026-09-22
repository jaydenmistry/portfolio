#!/usr/bin/env bash
# Serve the production build on all WSL interfaces for LAN preview.
# Usage: pnpm preview:lan            (serves the existing .next build)
#        pnpm preview:lan --build    (builds first)
# Other computers reach it through Windows: run
# scripts/windows-lan-preview.ps1 as administrator (see README).
set -euo pipefail
PORT="${PORT:-3100}"
cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--build" || ! -f .next/BUILD_ID ]]; then
  pnpm build
fi

WSL_IP="$(ip -4 -o addr show eth0 | awk '{print $4}' | cut -d/ -f1)"
echo "Preview: http://localhost:${PORT} (this machine), WSL address ${WSL_IP}:${PORT}"
echo "LAN: run scripts/windows-lan-preview.ps1 in an elevated PowerShell after each WSL restart."
exec pnpm exec next start --hostname 0.0.0.0 --port "${PORT}"
