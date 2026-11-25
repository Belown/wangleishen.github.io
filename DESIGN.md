---
name: Stage
description: A dark stage for one maker's work. One work stands in a single warm light, and below it the room is lit for reading.
colors:
  stage: "#0b0b0c"
  floor: "#1c1c1f"
  ink: "#f2f2f0"
  body: "#d8d8d6"
  dim: "#9a9aa0"
  hair: "rgb(242 242 240 / 0.1)"
  warm-light: "#ffecd4"
  matte-top: "#242327"
  matte-base: "#141416"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.9rem + 4.4vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 2.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.55vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  subhead:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  row-title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  reading:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 350
    lineHeight: 1.7
  small:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
rounded:
  none: "0"
  focus: "2px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 4rem)"
  rail: "4rem"
  side: "14rem"
  row: "1.75rem"
  item: "1.1rem"
  block: "2rem"
  page-max: "90rem"
  measure: "54rem"
components:
  rail-link:
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    padding: "0.6rem 0"
  rail-link-active:
    textColor: "{colors.ink}"
  profile-row:
    padding: "{spacing.row} 0"
  index-row:
    padding: "{spacing.item} 0"
    typography: "{typography.row-title}"
  tag:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.75rem"
  cv-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.2rem"
  cv-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stage}"
  media-panel:
    backgroundColor: "{colors.floor}"
    rounded: "{rounded.none}"
    padding: "1.1rem 1.3rem"
  placeholder:
    backgroundColor: "{colors.matte-top}"
    textColor: "{colors.dim}"
    rounded: "{rounded.none}"
---

# Design System: Stage

## Overview

**Creative North Star: "Night Stage"**

The site is a dark room with one warm light in it. The first screen puts the newest work under that light, with a catch-light on its top edge, a lit pool on the floor and a contact shadow. The owner's name stands beside it in large display type. Below the first screen the light falls away and the room is lit evenly for reading: a self-introduction set in two columns, then a dense index of every work. The light is the only accent. Type and hairlines do all the other work.

The site is restrained: two greys, warm white, and one warm light. Nothing on the page is saturated. Density is low on the first screen and high below it. The profile and the index use tight rows divided by hairlines, so a recruiter or advisor can scan them quickly.

**Key Characteristics:**
- Near-black stage, a slightly lighter floor, and warm white and grey text only.
- One soft radial warm light, with falloff and no cone. It belongs to the first screen and scrolls away with it.
- Objects stand in the light: catch-light, floor pool, contact shadow, and a drop shadow that falls downward.
- Large, tight display type with quiet captions in grey at 13px.
- A fixed bottom rail of sections, always within reach.
- Square media, pill-shaped chips and buttons, and hairline dividers. There are no cards.

## Colors

The palette is achromatic, plus one warm light that is used only as light and never as fill or text.

### Primary
- **Lamp Warm** (warm-light): the colour of the one light. It appears only at low alpha in radial gradients: the top light (0.2 falling to 0), the floor pool (0.26 at its centre), the 1px catch-light line (0.75 at its centre), the light falling down the face of an object (0.14), the inner top highlight on placeholders and panels (0.08 to 0.12), and the hover glow on index thumbnails. In CSS it is stored as the channel triple `--warm: 255 236 212` so it can be used at any alpha.

### Neutral
- **Stage Black** (stage): the page ground, the rail's background, and the text colour of text set on ink (selection, the hovered CV button, the skip link).
- **Lit Floor** (floor): the floor under the light, used at the centre of the pool gradient. It is also the flat ground of the audio, PDF and embed panels.
- **Warm White** (ink): titles, names, active navigation, links, focus rings and the selection background.
- **Reading White** (body): long-form paragraphs (bio, case-study prose). It sits one step below ink so that body text reads quieter than headings.
- **Stage Grey** (dim): captions, metadata, dates, inactive navigation and placeholder labels.
- **Hairline** (hair): ink at 10%. It is the divider between profile rows, index rows, references and the pager.
- **Matte Panel** (matte-top to matte-base, through #18181a at 46%): the vertical gradient of a media placeholder. The panel is lit from above and falls off toward the floor.

Ink at higher alpha marks rising emphasis on a stroke: 16% for tag outlines, 35% for the CV button outline and link underlines in the facts list, and 82% for English titles in the publications list.

### Named Rules
**The Light Is the Accent Rule.** There is no accent colour. Emphasis comes from ink against dim, from weight, or from the warm light landing on something. Never add a hue for links, states or badges.

**The Light Only Falls Rule.** Warm light enters from above and falls off downward: top light, catch-light on top edges, gradients that run from warm at the top to shadow at the bottom. Nothing is lit from below or from the side.

## Typography

**Display and body font:** Hanken Grotesk (variable 100–900, self-hosted). The site is English only. The one exception is the owner's Chinese name 沈王磊 under the home display name: "Name SC", a three-character subset of Noto Sans SC 500 (`src/fonts/name-sc.woff2`), in dim with 0.14em tracking.
**Mono:** ui-monospace stack, used only for file paths and code.

**Character:** a single grotesque at every size. Hierarchy comes from size, weight (600 for headings, 500 for titles, 400 for UI, 350 for reading text) and the ink, body and dim steps. Display type is tracked tight.

### Hierarchy
- **Display** (600, clamp 3–6rem, 0.98): the owner's name on the home hero and the 404 heading. Work titles use a smaller step of the same style (clamp 2.6–5rem).
- **Headline** (600, clamp 2.25–3.75rem, 1.06): the self-introduction greeting. On the About page it is set larger (clamp 2.75–4.75rem).
- **Title** (600, clamp 1.75–2.5rem, 1.1): the heading of the works index.
- **Lead** (400, clamp 1.2–1.5rem, 1.45, max 18em): the one short line under a display heading.
- **Subhead** (600, 1.5rem, 1.3): section headings inside case-study prose. Quotes use 500 at clamp 1.4–1.85rem.
- **Row title** (500, 1.1875rem, 1.35): work titles in the index, and pager titles at 1.25rem.
- **Body / Reading** (400 or 350, 1.0625rem, 1.7): UI text at 400. Paragraphs (prose and the profile bio) are set at 350 in Reading White, 1.125rem/1.75, with a 54rem measure in prose and 60rem in profile rows.
- **Small** (0.9375rem, 1.6): profile row headings (600), publications, contact, summaries in the index.
- **Label** (0.8125rem, 1.5): captions, metadata, rail links (0.875rem on wide screens), tags, citation links and placeholder text.
- **Mono** (0.6875rem): placeholder file paths only.

Years and counts use tabular figures.

### Named Rules
**The Phrase-Break Rule.** Short display lines (names, titles, leads, captions, row titles, timeline entries, quotes, prose headings) use `word-break: keep-all; overflow-wrap: anywhere; text-wrap: balance`, so they never strand a single word. Long paragraphs use `text-wrap: pretty`. Do not put keep-all on running text.

## Layout

- **Page frame:** content is limited to 90rem and centred. The side gutter is clamp(1rem, 4vw, 4rem). The body has bottom padding equal to the rail height plus the safe-area inset.
- **Hero:** a two-column grid, 5fr text and 7fr stage, vertically centred. On the home page it fills the first viewport minus the rail. Work pages use a compact hero with the same grid and no minimum height. The piece is at most 34rem wide and shrinks with viewport height so it always fits on the first screen. Portraits are 22rem wide.
- **Two-column reading:** the profile and the works index share a 14rem heading column (`--side`) beside a content column (60rem for profile rows; the index fills the remaining width so its rules end on the same right edge as the profile rows). In the index the heading column is sticky, at top 2rem.
- **Rows, not cards:** profile sections are rows with a 1.75rem vertical padding and a hairline above each. Index rows are an 11rem thumbnail beside the title, summary and metadata, with 1.1rem padding. Timeline and honours entries use an 8.5rem date column.
- **Prose:** a 54rem measure. Figures break out to min(72rem, viewport minus gutters) and stay centred. Paragraphs are spaced 1.1rem apart and headings 2.75rem.
- **Narrow (≤ 50rem):** everything collapses to one column. The rail shrinks to 3.75rem and centres its wrapping section links. A sticky mast at the top carries the name. The light moves to the centre and widens. Index thumbnails shrink to 6.5rem and the pager stacks.

## Elevation & Depth

Depth is light and shadow on a dark floor. There are no surface tiers and no card shadows. An object is raised by being lit and casting a shadow, not by sitting on a lighter panel.

### Shadow Vocabulary
- **Stage drop** (`0 2.5rem 3rem -2rem rgb(0 0 0 / .95), 0 .75rem 1.5rem -.5rem rgb(0 0 0 / .6)`): the hero piece.
- **Contact shadow** (a blurred black radial ellipse 1.8rem tall, 0.9rem below the piece): where the object meets the floor.
- **Prose drop** (`0 1.75rem 2.5rem -1.5rem rgb(0 0 0 / .9)`): figures inside a case study.
- **Thumb drop** (`0 .9rem 1rem -.7rem rgb(0 0 0 / .95)`): index thumbnails.
- **Top-light inset** (`inset 0 1px 0` warm at 0.08–0.12): the top edge of placeholders and media panels.

### Named Rules
**The Shadow Falls Down Rule.** Every shadow has a negative spread and a positive y offset. Shadows sit under objects, never around them as a halo.

**The One Light Rule.** There is one light, and it is on the first screen only (130svh, absolutely positioned, scrolling away). The reading room below the first screen gets no additional light sources and no glows.

## Shapes

Media, placeholders and panels have square corners. Pills (999px) are used only for small interactive or tag-like objects: research-interest tags and the CV button. Focus rings use a 2px radius. Dividers are 1px hairlines. Disabled affordances use a dashed outline. The catch-light is a 1px line that fades out at both ends.

## Components

### Rail (section navigation)
Fixed to the bottom, on a Stage Black ground, with a 2.5rem gradient fade above it so content dissolves before reaching the rail. Left: the wordmark, the owner's name in lower case (600, -0.03em) whose full stop is a small dot of the warm light; the favicon (`public/favicon.svg`) is its "w" and dot on Stage Floor. Centre: the sections that have works, plus About. Links are dim at rest and ink on hover. The current section, which a work page inherits from its home section, is ink with an underline offset 0.55em. Colour changes over 0.2s. On narrow screens the name moves to the sticky top mast.

### Piece in the light (hero object)
Layers from back to front: the floor pool (a warm radial over a floor radial, 168% of the piece's width), the contact shadow, the media with the stage drop, a warm-to-shadow gradient down its face, and the catch-light line with a soft bloom on the top edge. The caption sits below it: title in ink, then year and section in dim, separated by spaced middle dots.

### Profile row
A heading in the 14rem column (small, 600) and content in the second column, with a hairline above. The rows are: bio paragraphs in Reading White with pill tags, an education and experience timeline (date in dim with tabular figures; title at 500; place; note in dim), and the contact block as a definition grid (labels in dim).

### Citation (publication entry)
A decimal list with dim tabular-figure markers. Authors are listed with the owner's name in bold ink. The citation text is set at 82% ink. The title is at 500 in ink and links to its work page when one exists. The venue is italic. An award line sits in ink at label size. Below that is a row of bracketed citation links (`[PDF] [DOI] [Video]`). A link without a target is shown in dim with a "not added yet" tooltip, never removed.

### Index row (works)
An 11rem 4:3 thumbnail, then the title (row title, underlined on hover), a one-line summary in dim, and metadata (year · sections) in dim at label size. On hover the thumbnail's warm top glow rises from 0.6 to full opacity over 0.3s. The section filter sits in the sticky heading column as a vertical list of text buttons with counts, and becomes a wrapping row on narrow screens.

### Placeholder
A square-cornered matte panel with the matte gradient and the top-light inset, at the aspect ratio of the asset it stands in for. In the bottom-left corner it shows the kind ("Image placeholder") in ink at 500 and the exact path `src/assets/…` in mono. Video placeholders add a centred inline SVG play mark and the duration. In thumbnails the path is hidden. Placeholders are honest stand-ins that tell the owner where to put the file. They are not decoration.

### Media panels (audio, PDF, embed)
Flat Lit Floor panels with the top-light inset and 1.1rem × 1.3rem padding. The PDF panel draws a small sheet (3:4, #2a2a2e, with ink-alpha text lines) beside the title, page count and link.

### CV button
A pill with a 35% ink outline, label size 0.875rem. On hover it fills with ink and the text turns Stage Black (0.2s). When the file is missing it shows a dashed outline in dim, with the expected path in ink code.

### Pager
A two-column Newer/Older pair at 54rem, with a hairline above. Each side has a dim label and a 1.25rem title at 500. Below them, centred, is a dim link back to the section. The pager stacks on narrow screens.

### Motion
Scroll-driven and linear, active only when `prefers-reduced-motion: no-preference` and `animation-timeline` is supported. Otherwise the page is static and still lit.
- The light swells once (scale 1.14 × 1.1, opacity to 1) over the first 100vh of root scroll, then settles to 0.6.
- The pool and catch-light swell (1.22 × 1.12) as the hero exits (exit 0–70%).
- The piece dims to 0.3 opacity and brightness 0.5 while lifting 4vh (exit 5–70%). The hero text and caption fade to 0.25 (exit 5–65%).
- The profile heading rises 2.5rem into place (entry 0–80%). Only the heading animates: animating body text would cost it subpixel antialiasing.
- On narrow screens the mast gains its Stage Black ground over the first 5rem of scroll.
- State changes are colour-only transitions of 0.2s (0.3s for the thumbnail glow).

### Adding content
Photos (`/photos`) are every image in `src/assets/photos/`, newest file name first, in a three-column masonry wall (CSS columns, no cropping); optional captions in `PHOTO_CAPTIONS`. Random (`/random`) is a single 54rem column of dated short posts from `RANDOM`, hairline between posts. Both stay in the navigation even when empty and show a quiet dim line instead. A work with `paper` filled in opens in paper mode: under the work title, the paper title as the lead, the authors (owner in bold) with superscript affiliations, the affiliations and venue in dim, and a row of bracketed paper links ([Paper] [DOI] then the work's own links; a missing one sits in dim). The page then ends with a Publication block: the citation, [DOI] [PDF], the abstract and a BibTeX box with a Copy button, each shown only when given. The contact card (`/card`) is a ticket standing in the light: matte card body with the name, role and contact rows, a dashed perforation with punched notches, and a stub carrying a QR code of the card's own URL (light tile, dark modules, so any camera reads it). On narrow screens the stub moves below the body. "Add to Contacts" builds a vCard from `OWNER` on click, with the site's own URL and, when present, the portrait. All text and structure lives in `src/content/`, in English: owner, timeline, publications, honours, sections and works. Each work's body is a list of blocks (p, h, img, gallery, video, audio, quote, pdf, embed, refs). Media files go in `src/assets/` at the exact path each placeholder shows. A file dropped there replaces its placeholder automatically, and any image extension works. A new work needs a `works/<slug>/cover.jpg` for its index thumbnail and hero. A section with no works stays out of the navigation until it gets one; an empty list (publications, honours) hides its block.

## Do's and Don'ts

### Do:
- **Do** keep text to ink, body and dim. Use the warm light only as low-alpha radial light.
- **Do** stand featured media in the light (pool, catch-light, contact shadow, downward drop), and keep everything below the first screen evenly lit.
- **Do** divide lists with 1px hairlines (ink at 10%) and rows. Do not use cards.
- **Do** use the phrase-break rule on every short display line.
- **Do** show missing files as labelled placeholders with their asset path, and missing links in dim. Never hide them.
- **Do** gate scroll-driven motion behind both reduced-motion and `@supports (animation-timeline)`.

### Don't:
- **Don't** add an accent hue, a coloured link state or a coloured badge.
- **Don't** light anything from below or the side, or use a hard-edged spotlight cone.
- **Don't** round media or panel corners. Pills are reserved for tags and the CV button.
- **Don't** use a thumbnail grid for the works. The index is rows.
- **Don't** apply keep-all to long paragraphs.
- **Don't** animate body text layers.
