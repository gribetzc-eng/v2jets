#!/usr/bin/env bash
# set-domain.sh — point every production URL (canonical, Open Graph, Twitter,
# sitemap, robots) at your real deployed domain, in one command.
#
#   Usage:  ./set-domain.sh https://your-domain.com
#   e.g.    ./set-domain.sh https://v2jets-site.vercel.app
#           ./set-domain.sh https://v2jets.com
#
# Re-runnable: it reads the CURRENT base from index.html's canonical tag and
# rewrites it everywhere, so you can change domains as many times as you like.
set -euo pipefail

NEW="${1:-}"
if [ -z "$NEW" ]; then
  echo "Usage: ./set-domain.sh https://your-domain.com" >&2
  exit 1
fi
NEW="${NEW%/}"   # strip any trailing slash

cd "$(dirname "$0")"

OLD="$(grep -oE '<link rel="canonical" href="https?://[^/"]+' index.html | head -1 | grep -oE 'https?://[^/"]+' || true)"
if [ -z "$OLD" ]; then
  echo "Could not find the current base URL in index.html (canonical tag)." >&2
  exit 1
fi

if [ "$OLD" = "$NEW" ]; then
  echo "Already set to $NEW — nothing to do."
  exit 0
fi

echo "Rewriting base URL:  $OLD  ->  $NEW"

# portable in-place sed (BSD/macOS vs GNU)
sed_inplace() {
  if sed --version >/dev/null 2>&1; then sed -i "$@"; else sed -i '' "$@"; fi
}

for f in *.html sitemap.xml robots.txt; do
  [ -f "$f" ] || continue
  sed_inplace "s|${OLD}|${NEW}|g" "$f"
done

echo "Done. New base URL: $NEW"
echo "Verify:"
grep -h 'og:url' index.html | head -1
