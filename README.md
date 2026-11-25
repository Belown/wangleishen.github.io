# Personal site

A Vite + React app at the root of this repo.

```bash
npm install
npm run dev     # http://localhost:5187
```

- All text is in `src/content/`: `owner.ts` (bio, timeline, publications, honours), `sections.ts`, `works.ts` and `posts.ts` (photo captions, Random posts).
- Pages are in `src/pages/` (one file per page), styles in `src/styles/` (one file per area, imported in cascade order by `index.css`).
- Images, video and PDFs go in `src/assets/`. Photos for `/photos` go in `src/assets/photos/`.
- The design system is in `DESIGN.md`.
- Logo files are in `public/logo/`: `wordmark`, `wordmark-stacked` and `mark` ("w."), each in a light-on-dark version and a `-dark` version for light grounds, plus `app-icon.svg`. `public/favicon.svg` is the browser icon. The letters are outlined from Hanken Grotesk 600, so the files need no font.

## Records

The Records page shows the Discogs collection of `DISCOGS_USER`. Set it in `.env`, plus `DISCOGS_TOKEN` (a personal access token from discogs.com/settings/developers), which raises Discogs' rate limit and lets the collection stay private.

- **Server:** the `records` service in docker-compose.yml syncs every 6 hours. New records appear without a redeploy.
- **Locally:** `npm run records` fills `public/data/` for the dev server.
- **Full data is kept:** every Discogs response (the collection, each release, each master) is saved in full in `data/discogs/` locally, or in the `records-raw` volume on the server, and is never fetched twice. To show more fields, change `build()` in `scripts/discogs.mjs` and run `npm run records -- --offline`: it rebuilds the page data from the saved responses without touching the network.

- **Your own cover:** put it at `record-covers/<release id>.jpg` (the id is in the record's URL) and commit it. It replaces the Discogs cover on the next sync, locally and on the server.

None of the Discogs data is committed.

## Archive

`archive/` holds earlier explorations, kept for reference and no longer maintained: garden, room, sleeve, metro, bogujia, dial, studio (the previous main site) and `_core` (the starter template). See `archive/README.md`; each still runs on its own with `npm install && npm run dev`.

## Deploy

Same setup as coprompt-revibe: on the server, Docker builds the site and Caddy serves it on `127.0.0.1:${HTTP_PORT}`; Cloudflare Tunnel (or the host's reverse proxy) puts it on the domain and terminates TLS.

```bash
cp .env.example .env    # set HTTP_PORT and, while the site is private, SITE_PASSWORD
docker compose up -d --build
```

Update by hand: `git pull && docker compose up -d --build`.

**Auto-deploy on push:** after every push to `main`, `.github/workflows/deploy.yml` calls `https://<domain>/_deploy`. The `deploy` service checks the secret, then pulls `main` into the server's checkout and rebuilds `web` and `records`. One-time setup:

1. In the server's `.env`, set `DEPLOY_SECRET` (e.g. `openssl rand -hex 32`). The repo is public, so no GitHub token is needed; if it turns private, also set `GITHUB_TOKEN` (fine-grained, this repo only, Contents read-only).
2. On GitHub: Settings → Secrets and variables → Actions → add the secret `DEPLOY_SECRET` with the same value. If the domain is not wangleishen.com, add the variable `DEPLOY_URL`.
3. On the server: `docker compose --profile autodeploy up -d --build`.

Follow deploys with `docker compose logs -f deploy`; the Actions tab shows each call, and Run workflow there deploys again. The service never recreates itself, so after a change to the `deploy` service run step 3 again. If the server's checkout has changes of its own, the pull stops and the log says so.

While `SITE_PASSWORD` is set, the browser asks for a user name (`SITE_USER`, default `guest`) and that password before showing any page. Empty it and run `docker compose up -d` to make the site public. `.env` is never committed.
