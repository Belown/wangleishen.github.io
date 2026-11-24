# DESIGN: 林雅的小屋 / Ada Lin's little room (pixel)

The owner's room on the web, drawn as calm pixel art: a paper-coloured window on a dark desk, an isometric
room where furniture is navigation, today's mood, a visitor counter and a guestbook. Quiet rather than cute:
muted colours, no tilts, no bounces. Everything below is taken from `src/styles.css`, `src/room.tsx`, `src/icons.tsx`.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` / `--bg-dot` | `#2e2b33` / `#36323c` | Page background with a 3px pixel dot every 6px |
| `--paper` | `#ece6d8` | The window, the current tab |
| `--card` | `#f6f2ea` | Cards, rows, buttons at rest (ghost), inputs use `--hi` |
| `--ink` | `#2a2630` | All text and every pixel border |
| `--ink-soft` | `#5d5662` | Secondary text (≥5:1 on paper, card and note) |
| `--hi` / `--lo` | `#fbf9f4` / `#d2c9b6` | Bevel light and shade; resting hard drop inside the window |
| `--act-soft` / `--act` | `#ecd7a6` / `#d9a441` | **Action only**: resting button fill / hover, pressed language, furniture outline |
| `--focus` | `#b4532a` | Focus ring, caret |
| `--err` | `#a33a2a` | Form errors |
| `--note` | `#eadfbe` | Notes, mood, audio, email |
| `--slate` | `#d5dbdc` | Inactive tabs, visitor counter, placeholders |
| `--s-*` | research `#c9d1d6`, design `#ccd5c1`, art `#d8ced6`, writing `#e4d8b9` | Section stickers |

Room colours are muted woods, sage and stone walls, brick / slate / moss / ochre / plum books, a near-black piano.

## Type

| Role | Stack |
| --- | --- |
| Chrome and headings (`--f-pixel`) | Pixelify Sans, then Noto Sans SC for CJK |
| Reading (`--f-read`) | IBM Plex Sans, Noto Sans SC. Body 16px/1.65, post body 17px/1.85, 68ch measure |
| Dates, counts, paths (`--f-code`) | IBM Plex Mono, tabular numerals |

## Pixel rules

- **Pixel border** (`--pb`, 3px; `--pb-thin`, 2px): four offset box-shadows, so corners stay empty. Elements carry a
  matching margin so the border never collides with neighbours. No border-radius anywhere.
- **Window**: pixel border + 3px bevel + 6px hard drop onto the desk. Tabs have the border on three sides and sit on the window.
- **Motion**: `steps(2)` transitions only. Linked cards and polaroids shift up-left 3px and gain a hard 6px shadow.
- **Icons** (`icons.tsx`): 12×12 bitmaps (one character per pixel), drawn at whole multiples of 12px.

## The room

`room.tsx` draws the room as SVG in a 2:1 pixel-isometric projection, then rasterises it into a canvas at one pixel
per 2 units with `shape-rendering: crispEdges` and every stroke forced to one pixel. The canvas is shown with
`image-rendering: pixelated` at the largest whole device-pixel scale that fits (narrow screens below 2× just fit).
An invisible copy of the SVG sits on top for pointer and keyboard: each piece is `tabindex=0`, `role=link`.
Pointing at or focusing a piece re-renders it 3 pixels higher with a 1-pixel amber outline and shows its label box.
Section pages show the same piece, cropped and pixelated (`FurnitureArt`).

## Responsive

≤1020px one column; ≤760px the window goes edge to edge, tabs scroll in their strip, rows and the diary reflow;
≤420px the album is one column. No horizontal page overflow at 390px.
`prefers-reduced-motion` removes the shifts.
