# Design system: works network

The site is a city metro map. Four fields are four lines, works are stations, and cross-field works are interchanges. Every page reuses the same signage: a dark bar, coloured line badges, white station circles, bilingual names.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#f7f6f2` | Page background, map paper, text halo behind map labels |
| `--ink` | `#1d1d1f` | Body text, signage bar, tooltips, direction signs, passenger panel, interchange rings, focus ring on paper |
| `--ink-2` | `#55575b` | Secondary text on paper (6.7:1) |
| `--rule` | `#d9d7cf` | Hairlines, table rules, placeholder border |
| `--rule-2` | `#a9a79f` | Scrollbar thumb, embed dashed border |
| `--ph` | `#ebe9e2` | Media placeholder fill, legend hover |
| `--white` | `#ffffff` | Station fill, notice board, audio/PDF cards |
| `--on-dark` | `#f7f6f2` | Text on ink |
| `--on-dark-2` | `#b4b5b9` | Secondary text on ink (8:1) |
| `--dark-2` | `#2e2e31` | Hover fill on the bar |
| `--l1` | `#d7332a` | Line 1, research. White text 4.8:1 |
| `--l2` | `#1561b8` | Line 2, design and engineering. White text 6.1:1 |
| `--l3` | `#13924a` | Line 3, art, music, photo: map strokes and station rings |
| `--l3-fill` | `#0f8443` | Line 3 surfaces that carry white text (badges, station board), 4.8:1 |
| `--l4` | `#ef8a12` | Line 4, writing. Carries black text (`--ink`, 6.7:1), never white |

Each line is applied through a class, `.ln-research` / `.ln-design` / `.ln-art` / `.ln-writing`, which sets three variables: `--lc` (stroke colour), `--lf` (fill behind text), `--li` (text on that fill). Components only read those variables.

No gradients, glass, glows or decorative shadows. The one shadow is the soft drop under the map tooltip (`0 8px 24px` at 22% ink).

## Type

- **Overpass** (Google Fonts, 400–900): Latin, numerals, the signage voice. Fallback `Helvetica Neue, Arial, sans-serif`.
- **Noto Sans SC** (400–900): all Chinese. Fallback `PingFang SC, Hiragino Sans GB, Microsoft YaHei, system-ui`.
- **Overpass Mono** (400): file paths in placeholders and the email address. Fallback `ui-monospace, Cascadia Mono, Consolas`.

The main stack is `Overpass, Noto Sans SC, …`, so Latin renders in Overpass and CJK falls through to Noto Sans SC.

| Role | Size / weight |
| --- | --- |
| Station board name | `clamp(44px, 7vw, 88px)` / 900, secondary language `clamp(20px, 2.6vw, 30px)` / 700 |
| Section heading | `clamp(40px, 6vw, 72px)` / 900 |
| Owner name on the map | 56px / 900 (44px narrow) |
| Map station label | 16 units / 700, secondary 12 units / 400 (SVG units; the map scales) |
| Prose | 17px, line-height 1.85 (zh) / 1.7 (en) |
| Essay prose | 19px, line-height 1.95 (zh) / 1.75 (en), 70ch column |
| Meta, captions | 13–14.5px |

Years, dates, line numerals and the timetable use `font-variant-numeric: tabular-nums`.

**Bilingual names.** Station names (map, line diagrams, boards, direction signs) always show both languages, primary first by the current language setting: Chinese bold over English small in 中 and 中/EN modes, English over Chinese in EN mode (`<Both>`). Other text follows the language switch (`<Bi>`): one language, or in 中/EN mode the English after or under the Chinese.

## Components

- **Line badge** (`.badge`): rounded rectangle in `--lf` with the line numeral in `--li`, Overpass 800. Sizes: 26px (nav, legend), 20px `.sm` (chips, transfers), 88px `.lg` (section header; 64px on phones). On a station board the badge gets a 2px outline in the board's text colour so a badge on its own colour stays visible.
- **Signage bar** (`.bar`): ink, sticky, 56px. Owner name (home link), line badges with names as nav, then 关于/About after a 1px divider, then the language toggle. The current line is white with a 3px white underline; on a work page its home line is marked. Below 1240px the nav takes its own 48px row and scrolls horizontally inside itself; below 760px the bar stops being sticky.
- **Language toggle** (`.lang`): three joined signage buttons (中 / EN / 中/EN), outlined in `#5d5d61`; the pressed one is white with ink text. `aria-pressed` marks state.
- **Network map** (`Home.tsx`): SVG, viewBox 1200×760. Lines are 10-unit round-capped strokes on 0/45/90° segments. Stations are white circles r7 with a 4-unit line-colour ring; interchanges are r10 with a 4.5-unit ink ring. Labels carry a 5-unit paper halo. Each line's first station has a line badge beside it. Along each line, stations are in date order.
- **Title block**: top-right, 6px ink rule on top, owner name, "作品线网 2026 / Works network 2026" (year = newest work), one-line bio.
- **Legend**: bottom-left; badge + 30×8 line swatch + line name per line, then the interchange key (drawn circle).
- **Passenger panel**: bottom-right, ink, drawn info icon, "乘客须知 / Passenger information", drawn arrow; links to About.
- **Tooltip** (`.tip`): ink, 7px radius, title, year, line chips; pointer aims at the station even when the box is clamped to the map edge; flips below stations near the top.
- **Line strip** (`.strip`): the in-carriage diagram. A 12px bar in the line colour, 24px white stations with 5px rings, 32px interchanges with ink rings. Each station: year (22px tabular), name in both languages, one-line summary, and for interchanges a 换乘/Transfer tag plus a link to the other line. Horizontal when its container is wider than 860px, vertical (rail on the left) otherwise, via a container query.
- **Towards sign** (`.toward`): ink plate with a drawn arrow, "开往 / Towards" the line's newest station.
- **Station board** (`.board`): full-width panel in `--lf` with `--li` text; line badge + name, transfer badges, station name in both languages, summary. Under it an ink strip with two direction signs: 上一站 / Previous on the left with a left arrow, 下一站 / Next on the right with a right arrow (previous/next on the work's home line). At a terminus the sign reads 本线起点站 / 本线终点站 and is not a link.
- **Timetable** (`.timetable`): label column in both languages, values bold and tabular. Year, date (`2026.03.12`), venue, role, tools; empty rows are left out. Sits in a sticky 250px column beside case-study bodies under a 6px line-colour rule; for essays it becomes a horizontal strip above the text.
- **Drawn icons**: signage arrow (filled, one path, rotated for direction), info icon, copy icon, play icon, interchange key, closed-station mark. No glyph or emoji icons.
- **Media blocks**: placeholders are `--ph` fills with a 1px rule, an ink "kind" chip and the drop-in path in Overpass Mono. Audio and PDF are white cards with a 1px rule; PDF has a drawn page; embed is a dashed box; the pull quote is 1.35em bold with a 44×8 line-colour bar above it.
- **Notice board** (About): white panel with a 2px ink frame, ink header with the info icon, portrait (4:5), name, bio, about paragraphs, then a contact list: email in mono (`user-select: all`) with a copy button (Clipboard API, falls back to selecting the text and `execCommand('copy')`, status announced in a live region), and links. Empty links show "在 content.ts 里填上链接 / Add the link in content.ts".
- **Closed station** (404): ink sign, red closed-station mark, "本站暂停服务 / This station is closed", white button back to the map.

## Interaction

- Hover or focus a station: its lines and their stations stay at full strength, every other line drops to 13% and every other station to 20%, the station circle scales to 1.3, the label underlines, and the tooltip appears. Click or Enter opens the work page (stations are real links, so modifier-clicks open new tabs).
- Hover or focus a legend line: that line isolates. Click: its line diagram.
- Line strip: hovering a station name grows its circle and underlines it.
- Direction signs and the passenger panel nudge their arrow 4px on hover.
- Motion uses `cubic-bezier(0.16, 1, 0.3, 1)` at 180–250ms, on opacity and transform only. `prefers-reduced-motion: reduce` turns all transitions and animations off.
- Focus: 3px outline in `--focus` (ink on paper, white on ink and on line-colour panels except orange, where it is ink), offset 3px; inset inside the bar and toggles so scroll containers do not clip it. Map stations draw their own ring circle on `:focus-visible`.
- Browser surfaces: ink selection on paper, red caret, themed scrollbars (`scrollbar-color` plus WebKit), underline offset 0.22em at 1px.
- Navigation scrolls to the top and sets `document.title` to "page · 林雅 · Ada Lin".

## Responsive rules

- **≥1000px**: the map fills the viewport under the bar; title, legend and passenger panel sit in the corners, which the network geometry keeps clear.
- **<1000px**: the home page stacks: title, a 线网图 / 线路列表 (Map / Line list) toggle, then either the map at a fixed 960px width inside its own horizontal scroller, followed by the legend, or the four lines as vertical strips; the passenger panel comes last.
- **<1240px**: the bar's nav moves to a second row and scrolls inside itself.
- **≤860px**: work pages drop to one column; the timetable moves above the body and the direction signs stack.
- Line strips switch to vertical when their own container is narrower than 860px.
- **≤760px / ≤640px**: About becomes one column; section header stacks the badge above the heading; tighter page padding (16px gutter).
- Nothing scrolls the page sideways at 390px; only the map and the nav scroll inside their own containers.
