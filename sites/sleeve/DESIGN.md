# Design system: the record sleeve

The site is a 1960s French pop single. Every page is one flat, saturated ground that fills the viewport; the ground always belongs to the current track. No gradients, no glass, no shadows: flat colour, white relief, thin rules, and printed photographs.

## Palette

### Grounds (one per track)

| Track | Route | Ground `--g` | Display + rules `--fg` | Text `--fgt` |
|---|---|---|---|---|
| Cover (rest) | `/`, 404 | tangerine `#ee6c26` | white `#ffffff` | ink `#1c1410` |
| A1 研究 Research | `/research` | turquoise `#1aa0b0` | white | ink |
| A2 设计与工程 Design | `/design` | tangerine `#ee6c26` | white | ink |
| A3 艺术·音乐·摄影 Art | `/art` | rose `#e2507f` | white | ink |
| B1 写作 Writing | `/writing` | yolk `#e8b21c` | ink | ink |
| B2 关于 About | `/about` | cobalt `#2f58c8` | white | white |

Work pages take their home section's ground. The ground is set as `data-ground` on `<html>`; the tokens are registered with `@property` as `<color>` so they interpolate.

### Contrast rule

White is the relief colour, but on three grounds it only clears the large-text threshold, so it is reserved for display type (the logotype, page titles at 2.5rem and up) and for the hairline rules. All text below display size uses `--fgt`.

| Pair | Ratio | Used for |
|---|---|---|
| white on tangerine `#ee6c26` | 3.08 | display only |
| white on turquoise | 3.13 | display only |
| white on rose | 3.69 | display only |
| white on cobalt | 6.27 | everything |
| ink on tangerine | 5.88 | text |
| ink on turquoise | 5.79 | text |
| ink on rose | 4.92 | text |
| ink on yolk | 9.35 | everything (white fails at 1.94) |
| ink on paper | 16.85 | liner notes |
| ink-soft on paper | 7.80 | captions, English half of paired paragraphs |
| print-label on print | 11.99 | placeholder label |

### Neutrals

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#1c1410` | warm near-black text |
| `--ink-soft` | `#5c4a3c` | captions and secondary text on paper |
| `--paper` | `#fbf6ec` | liner-notes panel, lyric booklet |
| `--paper-deep` | `#ebe1cf` | media placeholders, inline code |
| `--print` | `#2b1d16` | portrait and cover placeholder ground |
| `--print-dot` | `#f0c9a0` | halftone dots |
| `--print-label` | `#f3d9bd` | placeholder label text |

`--rule` is `--fg` on a ground and `--ink` inside `.paper`.

## Type

| Role | Face | Setting |
|---|---|---|
| Chinese logotype | ZCOOL QingKe HuangYou 400 | home `clamp(5rem, 13vw, 11rem)`, chrome 1.9rem |
| Latin logotype | Fredoka 600, lowercase | home `clamp(2.5rem, 6vw, 5.25rem)`, chrome 1.5rem |
| Display (page titles) | `--logo`: Fredoka for Latin, falling through to ZCOOL QingKe HuangYou for CJK; `font-synthesis: none` | section `clamp(3.25rem, 9vw, 8rem)`, work/about/404 `clamp(2.5rem, 6.5vw, 5.75rem)`, line-height 0.92 |
| Second language under a display title | same face, 0.4em, `--fgt` | |
| Text | Work Sans + Noto Sans SC (400/500/600/700) | body 1rem/1.6, liner notes 1.0625rem/1.75, booklet 1.1875rem/1.8 |
| Catalogue and credit labels | Work Sans 600, 0.75rem, tracking 0.12–0.16em, uppercase | |
| File paths | system monospace (`ui-monospace`, Cascadia Mono, Consolas) | only for real paths |

All numerals in track numbers, years, dates and counts are tabular. The section-page display size passes the 6rem display ceiling deliberately: the sleeve's name is the cover.

Fonts load from Google Fonts in `index.html`, with Chinese system fallbacks (PingFang SC, Microsoft YaHei).

## Layout

- Gutter `--gut: clamp(1rem, 4vw, 3.5rem)`.
- **Home (front of the sleeve):** full-viewport grid. Logotype top-left, catalogue block (`LY-001 · STEREO`, year span, `A 面 / B 面`) and the language switch top-right, square portrait bottom-left (`min(100%, 52svh, 34rem)`), tracklist bottom-right (27rem).
- **Section (45-rpm single):** huge section name; blurb and catalogue line (`LY-001-A1 · 45 RPM · 4 首`) beside it; works as a tracklist split into side A and side B, newest first.
- **Work (back of the sleeve):** title and summary; a 17rem credits column (sticky) beside a paper panel of liner notes (text held to 68ch, figures full panel width); previous / all tracks / next.
- **Writing work (lyric booklet):** the title sits in a band of the section colour; below it the page turns to paper, one centred 70ch column.
- **About:** portrait (26rem, sticky) beside title, bio, paragraphs and a credits list for email and links.
- **404:** a blank record (grooves, empty label) centred over the title.

## Components

- **Chrome** (every page except home): small two-script logotype linking home, compact track nav `A1 研究 … B2 关于`, language switch. A hairline rule beneath.
- **Track** (home): grid `number · title · count`, 1.125rem, white rules above and below each, a 1.25rem gap with doubled rule between side A and side B. Under the list a line shows the bio, or the first four titles on the side being hovered.
- **Track row** (section): `cover 4rem · number · title + summary + feat. credit · year`. The title link stretches over the whole row; the `feat.` credit sits above it and links to the other section.
- **Credits** (`dl`): uppercase label over value, hairline between rows. Track, Recorded (date or year), Venue, Role, Tools, Featuring; empty fields are left out.
- **Language switch:** a 1px pill holding 中 / EN / 中/EN; the pressed option is filled with `--fgt` and set in the ground colour.
- **Button** (`.btn`): 1.5px outlined pill, fills with `--fgt` on hover.
- **Portrait placeholder:** a warm dark square with a halftone head-and-shoulders drawn as an SVG dot grid (30×30, dot size from a lit silhouette field), a dashed inset frame, and the label `这里放你的照片 / Your portrait goes here` with its file path. A real portrait is printed warm (`sepia .22, saturate 1.12`) and cropped square from the upper third.
- **Cover placeholder:** the same print stock with an 11×11 halftone disc whose position comes from the work's slug; the file path is in its tooltip.
- **Played mark:** a small drawn ring after the track name plus a screen-reader note; played tracks also drop to regular weight.
- **Media on paper:** placeholders are paper-deep with a dot screen and a paper label chip; audio is a rounded pill outline; PDF shows a drawn page; embeds are a dashed box; quotes are set in the logotype face.
- **Icons:** authored SVG only (arrow, copy, played ring, play triangle, disc), stroke 1.5–1.6.

## Interaction

- **Ground cross-fade:** hovering or focusing any track link (home tracklist, chrome nav, credits, `feat.` credits) floods the page with that track's colour; leaving restores the page's own. Clicking navigates and keeps the colour, so moving between pages is a 0.7s cross-fade (`cubic-bezier(0.16, 1, 0.3, 1)`) on `--g`, `--fg` and `--fgt`, never a flash. The first paint lands on the correct colour without animating.
- **Played:** tracks you have opened are remembered in `localStorage` and render lighter with a ring.
- **Copy email:** `navigator.clipboard`, then a hidden-textarea `execCommand` fallback, then selecting the address with an instruction. Status is announced in a live region. The address itself is `user-select: all`.
- **Navigation:** every route change scrolls to top and sets `document.title` (`<page> — 林雅 · Ada Lin`). A skip link jumps to `#main`.
- **Focus:** 2px outline in `--fgt` (ink inside paper), 3px offset; stretched-link rows outline the whole row.
- **Reduced motion:** the colour transitions are removed; colours switch instantly.
- **Browser surfaces:** selection is `--fgt` on `--g` (ink on paper inside paper), scrollbar thumb `--fgt` on track `--g`, underline offset 0.22em.

## Responsive

- **≤960px:** chrome becomes two rows (logotype + language switch, then the nav, which wraps); liner credits stack above the notes and stop being sticky; About stacks with the portrait first.
- **≤760px:** home stacks catalogue + language switch, logotype, full-width square portrait, tracklist, and no longer locks to the viewport height. Section rows tighten to `3rem · 2rem · 1fr · auto`; prev/next puts "All tracks" on its own row. Language-switch buttons grow to 40px tall and nav links get extra vertical padding.
- `overflow-x: clip` on the body; at 390px nothing scrolls sideways.
