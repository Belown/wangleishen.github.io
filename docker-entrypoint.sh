#!/bin/sh
# Turns SITE_PASSWORD from .env into Caddy's password prompt (HTTP basic auth), then starts Caddy.
set -e
if [ -n "$SITE_PASSWORD" ]; then
  hash=$(caddy hash-password --plaintext "$SITE_PASSWORD")
  printf 'basic_auth {\n\t%s %s\n}\n' "${SITE_USER:-guest}" "$hash" > /etc/caddy/auth.caddy
else
  : > /etc/caddy/auth.caddy
fi
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
