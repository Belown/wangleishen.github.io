# 林雅的小屋 · Ada Lin's little room

A personal portfolio built as a little room on the web: polka-dot wallpaper, a tabbed window,
and an isometric room where each piece of furniture opens a section.

## Run it

```bash
npm install
npm run dev      # http://localhost:5181
npm run build    # type-check + production build into dist/
npm run preview  # serve the build on port 5181
```

## Where things live

| What | Where |
| --- | --- |
| All text, in Chinese and English: name, bio, mood, about, links, sections, works | `src/content.ts` |
| Photos, video, audio, PDFs | `src/assets/` at the path each placeholder shows, e.g. `src/assets/works/softfold/cover.jpg` |
| Your portrait | `src/assets/about/portrait.jpg` |
| Background music for the profile card | `src/assets/audio/bgm.mp3` (never autoplays) |
| The room drawing | `src/room.tsx` |
| Pages | `src/pages.tsx`, routes in `src/App.tsx` |
| Styles | `src/styles.css` (tokens at the top) |

Placeholders turn into the real file as soon as it exists; images may be jpg, png, webp, avif or gif,
whatever extension the placeholder shows. Empty link `href`s in `content.ts` show a "fill this in" note
on the About page. Today's mood is `OWNER.mood` in `content.ts`; each diary entry can set its own `mood`
(`sun`, `cloud`, `rain`, `note`, `pencil`).

## Guestbook, comments and the visitor counter

These are stored **only in the visitor's own browser** (`localStorage`) until a backend is added.
Notes someone writes are visible to them alone, and you, the owner, cannot read them yet. The visitor counter goes
up once per browser session and only counts that browser's visits. The four guestbook notes marked
示例 / sample are fixed samples in `src/lib.tsx` (`SAMPLE_NOTES`), so delete or replace them before going live.

To make them real, swap `useNotes` and `getVisits` in `src/lib.tsx` for calls to your own API.

## Deploying

It is a single-page app using `BrowserRouter`, so the host must serve `index.html` for unknown paths
(e.g. Netlify `_redirects` with `/* /index.html 200`, or Vercel rewrites).
