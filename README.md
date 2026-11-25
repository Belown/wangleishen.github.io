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
git clone https://github.com/Belown/wangleishen.github.io.git   # https, not git@: the deploy service has no SSH key
cp .env.example .env    # HTTP_PORT, SITE_PASSWORD while the site is private, DISCOGS_USER and DISCOGS_TOKEN
docker compose up -d
```

That starts everything: `web` (the site), `records` (the Discogs sync) and `deploy`. Images are built on the first start.

**Auto-deploy on push:** after every push to `main`, `.github/workflows/deploy.yml` calls `https://<domain>/_deploy`, and the `deploy` service pulls `main` into the server's checkout and rebuilds `web` and `records`. The call needs no secret: it only makes the server look at GitHub, and only GitHub's `main` is ever deployed. It acts only when called, and GitHub calls the domain, so on any other machine it stays idle. Follow deploys with `docker compose logs -f deploy`; Run workflow in the Actions tab deploys again. If the domain is not wangleishen.com, set the Actions variable `DEPLOY_URL`. The service never recreates itself: after a change to the `deploy` service, run `docker compose up -d` by hand. If the server's checkout has changes of its own, the pull stops and the log says so.

Moving to another server: the steps above, plus Cloudflare Tunnel pointed at `http://127.0.0.1:<HTTP_PORT>`. `.env` is the only thing to carry over; Records fills itself from Discogs within minutes.

While `SITE_PASSWORD` is set, the browser asks for a user name (`SITE_USER`, default `guest`) and that password before showing any page. Empty it and run `docker compose up -d` to make the site public. `.env` is never committed.
