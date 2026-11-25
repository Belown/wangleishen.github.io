# syntax=docker/dockerfile:1
# Builds the site and serves dist/ with Caddy. See README (Deploy).
FROM node:22-alpine AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# The records service (docker-compose.yml): the Discogs sync and the covers chosen by hand, every 6 hours.
FROM node:22-alpine AS records
WORKDIR /app
COPY scripts/discogs.mjs ./
COPY record-covers ./record-covers
CMD ["sh", "-c", "while true; do node discogs.mjs; sleep 21600; done"]

# The site (the default target).
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY --from=build /build/dist /srv
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
CMD ["/docker-entrypoint.sh"]
