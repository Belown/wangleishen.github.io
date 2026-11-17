# Garden Portfolio

A personal site built around a rakeable 3D Zen garden. Each stone is a section, the lantern is the journal, the water basin is About. Pages slide in over the garden.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Stack

Vite · React 19 · TypeScript · react-router · three.js via @react-three/fiber (+ drei for the model viewer) · MDX for posts · zustand for shared state.

## Where things live

| What | Where |
|---|---|
| Name, bio, links, news, teaching, friends | `src/content/site.ts` |
| Works (all sections) and default case-study text | `src/content/works.ts` |
| Audio tracks | `src/content/tracks.ts` |
| Journal posts (one `.mdx` file each, name = URL) | `src/content/posts/` |
| Your images, video, audio, PDFs, 3D models | `src/assets/` |
| Garden layout, lighting per time of day | `src/garden/layout.ts` |
| Pages | `src/pages/` |
| Styles and color tokens | `src/styles.css` |

## Adding assets

Every placeholder shows the path it is waiting for, e.g. `src/assets/works/softfold/cover.jpg`.
Put a file there and the placeholder becomes the real thing on the next reload. Images may be jpg, png, webp, avif or gif whatever the label says.
Audio tracks fall back to a synthesized sketch until their file exists. 3D models (`model.glb`) replace the inflating placeholder.

Links left empty in `src/content` show a short "add your link" note when clicked.

## Writing a post

Create `src/content/posts/my-post.mdx`:

```mdx
export const meta = { title: 'My post', date: '2026-11-17', read: 3, tags: ['notes'], lede: 'One sentence.' }

Text in Markdown.

<Img file="journal/my-post/photo.jpg" caption="A caption." />
<Gallery folder="journal/my-post" name="detail" count={3} />
<Video file="journal/my-post/clip.mp4" duration="0:30" />
<Track id="gymnopedie" />
<Quote cite="Someone">A quote.</Quote>
<Pdf file="journal/my-post/slides.pdf" title="Slides" pages={12} />
<Embed service="YouTube" abbr="YT" title="Talk" href="https://…" />
<Model file="journal/my-post/model.glb" />
```

## Deploying

`dist/` is a static single-page app. Configure the host to serve `index.html` for unknown paths (Netlify `_redirects`, Vercel rewrites, or a 404 fallback on GitHub Pages).
