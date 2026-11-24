# Wanglei Shen: personal site

Vite + React + TypeScript. A full-screen video hero, about, a filterable gallery of work and news, plus a page for each work and an About / CV page. Bilingual (中 / EN / both).

```bash
npm install
npm run dev      # http://localhost:5185
npm run build    # output in dist/
```

## Adding your things

- **Text:** everything is in `src/content.ts`, in Chinese and English. Anything in `[square brackets]` is a blank, and the site underlines it until you fill it in.
- **Files:** drop them into `src/assets/` at the path the placeholder shows:
  - `hero/loop.mp4`: the background video. A short muted loop works best. `hero/loop.jpg` is used as its poster, or on its own as a still.
  - `about/portrait.jpg`
  - `works/<slug>/cover.jpg`: the gallery tile and the top of the work page.
  - Any other image, video, audio or PDF a work's body names.
- **New work:** add an entry to `WORKS`. Its first `sec` is the gallery filter it lives under, and the order in `WORKS` is the order in the grid.
- **Publications** on the About page are the works that have a `venue`, with their `authors`.
- **News:** `NEWS`. **Education:** `CV`. **Collaborators:** `PEOPLE`.

## Earlier designs

Other directions are kept in [`archive/`](archive/README.md), each still runnable on its own.
