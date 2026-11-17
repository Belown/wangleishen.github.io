# Archive

Earlier design directions. Each folder is a standalone Vite + React app and still runs as is:

```bash
cd archive/metro
npm install
npm run dev
```

| Design | Folder |
| --- | --- |
| 3D zen garden | `garden` |
| Pixel room | `room` |
| Record sleeve | `sleeve` |
| Transit map | `metro` |
| Shared starting template for the 2D sites | `_core` |
| Static HTML previews A–E (open `previews/index.html`) | `previews` |

## Making one of these the main app again

The main app lives at the repo root (`index.html`, `src/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`). To swap:

1. Move those root files into a new folder here, e.g. `archive/studio/`.
2. Move the chosen design's files from `archive/<name>/` to the root.
3. Run `npm install`, then `npm run dev`.
