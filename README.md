# Personal site

A Vite + React app at the root of this repo.

```bash
npm install
npm run dev     # http://localhost:5187
```

- All text is in `src/content.ts`.
- Images, video and PDFs go in `src/assets/`. Photos for `/photos` go in `src/assets/photos/`.
- The design system is in `DESIGN.md`.
- Logo files are in `public/logo/`: `wordmark`, `wordmark-stacked` and `mark` ("w."), each in a light-on-dark version and a `-dark` version for light grounds, plus `app-icon.svg`. `public/favicon.svg` is the browser icon. The letters are outlined from Hanken Grotesk 600, so the files need no font.

## Archive

`archive/` holds earlier explorations, kept for reference and no longer maintained: garden, room, sleeve, metro, bogujia, dial, studio (the previous main site) and `_core` (the starter template). See `archive/README.md`; each still runs on its own with `npm install && npm run dev`.

## Deploy

Same setup as coprompt-revibe: on the server, Docker builds the site and Caddy serves it on `127.0.0.1:${HTTP_PORT}`; Cloudflare Tunnel (or the host's reverse proxy) puts it on the domain and terminates TLS.

```bash
cp .env.example .env    # set HTTP_PORT and, while the site is private, SITE_PASSWORD
docker compose up -d --build
```

Update: `git pull && docker compose up -d --build`. There is no automatic deploy on push.

While `SITE_PASSWORD` is set, the browser asks for a user name (`SITE_USER`, default `guest`) and that password before showing any page. Empty it and run `docker compose up -d` to make the site public. `.env` is never committed.
