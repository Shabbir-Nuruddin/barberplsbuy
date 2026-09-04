#!/usr/bin/env bash
# Auto-sync script for https://github.com/Shabbir-Nuruddin/barberplsbuy.git

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR" || exit 1

# Check if there are any git changes
if [[ -n $(git status --porcelain) ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Changes detected. Staging and committing..."
  git add .
  git commit -m "chore(auto-sync): update project [$(date '+%Y-%m-%d %H:%M:%S')]"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pushing to origin main..."
  git push origin main
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Successfully pushed to GitHub."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Working tree clean. Nothing to commit."
fi
