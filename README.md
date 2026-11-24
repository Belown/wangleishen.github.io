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

`archive/` holds earlier explorations, kept for reference and no longer maintained: garden (3D zen garden), room (pixel room), sleeve (record sleeve), metro (transit map), bogujia (3D curio shelf), dial (dial finishing) and `_core` (the shared starter template they were copied from). Each still runs on its own with `npm install && npm run dev`.
