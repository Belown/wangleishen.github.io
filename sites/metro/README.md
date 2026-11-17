# 林雅 · Ada Lin: works network

A personal portfolio drawn as a metro map. Each field is a line, each work is a station, and a work that belongs to two fields is an interchange.

## Run

```sh
npm install
npm run dev        # http://localhost:5183
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on port 5183
```

The site uses client-side routing (`BrowserRouter`). When you host `dist/`, rewrite unknown paths to `index.html` so `/work/softfold` and the other routes load on refresh.

## Where things live

| What | Where |
| --- | --- |
| All text, in Chinese and English: owner, bio, about, email, links, sections, works and their bodies | `src/content.ts` |
| Images, video, audio, PDFs | `src/assets/` at the path each placeholder shows (for example `src/assets/works/softfold/final.jpg`). Images can be any of jpg/png/webp/avif/gif whatever extension the placeholder shows. |
| Portrait on the About page | `src/assets/about/portrait.jpg` |
| Profile links (GitHub, photos, CV) | `OWNER.links[].href` in `src/content.ts`. Empty links show a note on the About page until filled. |
| Map layout (station and label positions, line paths) | `PATHS`, `TERMINI` and `STATIONS` at the top of `src/Home.tsx` |
| Colours, type, layout | `src/styles.css` (tokens at the top); documented in `DESIGN.md` |

## Adding a work

1. Add an entry to `WORKS` in `src/content.ts`. `sec[0]` is its line; a second entry makes it an interchange.
2. Section pages and work pages pick it up automatically, in date order (`date`, or `year` when there is no date).
3. The home map is hand-drawn: add a row to `STATIONS` in `src/Home.tsx` with the station position on its line and a clear spot for its label. Lines run on 0°, 45° and 90° segments; extend the line in `PATHS` if the station sits past its current end.

## Routes

`/` map · `/research` `/design` `/art` `/writing` line diagrams · `/work/:slug` station boards · `/about` passenger information · anything else shows the closed-station page.
