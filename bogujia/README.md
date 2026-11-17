# 博古架 Portfolio

The portfolio as a Chinese curio cabinet (博古架 / 多宝格). Each compartment holds one object, and each object is a section of the site. Pages slide in over the cabinet, and the camera moves to the object you opened.

This is a separate project from the garden site in the parent folder. It has its own dependencies and a copy of the content, so changes here do not affect the garden site.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # static site in dist/
```

## Where things live

| What | Where |
|---|---|
| Compartments, which object is in each, which section it opens | `src/shelf/layout.ts` (`CELLS`) |
| Lighting through the day (dawn, noon, dusk, night lamp) | `src/shelf/layout.ts` (`LIGHT`) |
| The objects and the cabinet | `src/shelf/items.ts` |
| Scene, camera, hover and click | `src/shelf/Shelf.tsx` |
| Your text, works, posts, tracks | `src/content/` (same format as the garden site) |
| Your files | `src/assets/` |

## Replacing an object with your own model

Put a `.glb` file at `src/assets/shelf/<item>.glb`, where `<item>` is one of
`books, ding, seal, vase, bowl, qin, rock, scroll, plate, gourd`.
It replaces the built-in object, scaled to fit the compartment and stood on its floor.

Every other placeholder works the same way as in the garden site: put a file at the path the placeholder shows.
