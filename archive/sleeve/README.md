# 林雅 · Ada Lin — the record sleeve

A personal portfolio built like a 1960s pop single. The home page is the front of the sleeve; Research, Design, Art and Writing are tracks A1–B1, About is B2.

## Run

```sh
npm install
npm run dev      # http://localhost:5182
npm run build    # type-check + production build into dist/
npm run preview  # serve dist/ on port 5182
```

The site uses client-side routing (`/research`, `/work/softfold`, …). When you host `dist/`, send unknown paths to `index.html`.

## Where things live

| What | Where |
|---|---|
| All text, in Chinese and English: your name, bio, about paragraphs, email, links, sections, works | `src/content.ts` |
| Photos, video, audio, PDFs | `src/assets/` at the path each placeholder shows |
| Your portrait | `src/assets/about/portrait.jpg` |
| A work's square cover on its section page | `src/assets/works/<slug>/cover.jpg` |
| Colours, type, layout | `src/styles.css` (documented in `DESIGN.md`) |

Every placeholder names the exact file it is waiting for. Drop the file in and it replaces the placeholder; images may be `.jpg`, `.png`, `.webp`, `.avif` or `.gif` whatever extension the placeholder shows.

Links in `OWNER.links` with an empty `href` show a note asking you to fill them in.

## Code

- `src/App.tsx`: routes, page chrome, page titles
- `src/pages.tsx`: home, section, work (liner notes / lyric booklet), about, 404
- `src/record.tsx`: tracks, the ground colour, portrait and cover placeholders, icons
- `src/media.tsx`, `src/i18n.tsx`, `src/assets.ts`: media blocks, language switch, asset lookup
