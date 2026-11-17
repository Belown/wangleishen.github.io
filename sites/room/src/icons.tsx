import type { ReactNode } from 'react'

/* Pixel icons: 12×12 bitmaps, one character per pixel ('.' is empty). Drawn at whole multiples of 12px. */
const C: Record<string, string> = {
  k: '#2a2630', // ink outline
  w: '#f6f2ea', // paper white
  n: '#e3d3a8', // note paper
  y: '#d4b064', // warm yellow
  a: '#c8902f', // amber
  b: '#5b6f86', // slate blue
  l: '#a9bcc4', // pale blue
  r: '#a35d48', // brick
  p: '#6f5f78', // muted plum
  t: '#a98463', // wood
  s: '#c9c6bd', // stone
}

const ART = {
  sun: [
    '.....kk.....', '.k...kk...k.', '..k......k..', '....kkkk....', '...kyyyyk...', 'kk.kyyyyk.kk',
    'kk.kyyyyk.kk', '...kyyyyk...', '....kkkk....', '..k......k..', '.k...kk...k.', '.....kk.....',
  ],
  cloud: [
    '', '', '', '....kkkk....', '...kssssk...', '.kkssssssk..', 'ksssssssssk.', 'ksssssssssk.', '.kkkkkkkkk..',
  ],
  rain: [
    '', '....kkkk....', '...kssssk...', '.kkssssssk..', 'ksssssssssk.', 'ksssssssssk.', '.kkkkkkkkk..', '',
    '..b...b...b.', '.b...b...b..',
  ],
  note: [
    '', '....kkkkkkk.', '....kkkkkkk.', '....k.....k.', '....k.....k.', '....k.....k.', '....k.....k.',
    '..kkk...kkk.', '.kpppk.kpppk', '.kpppk.kpppk', '..kkk...kkk.',
  ],
  pencil: [
    '', '', '', '', '..kkkkkkkkk.', '.kwyyyyyysrk', 'kkwyyyyyysrk', '.kwyyyyyysrk', '..kkkkkkkkk.',
  ],
  house: [
    '', '.....kk.....', '....krrk....', '...krrrrk...', '..krrrrrrk..', '.krrrrrrrrk.', 'kkkkkkkkkkkk',
    '.kwwwwwwwwk.', '.kwwkkkwwwk.', '.kwwktkwwwk.', '.kwwktkwwwk.', '.kkkkkkkkkk.',
  ],
  envelope: [
    '', '', 'kkkkkkkkkkkk', 'kknnnnnnnnkk', 'knknnnnnnknk', 'knnknnnnknnk', 'knnnkkkknnnk', 'knnnnnnnnnnk',
    'knnnnnnnnnnk', 'kkkkkkkkkkkk',
  ],
  clock: [
    '....kkkk....', '..kkllllkk..', '.klllkllllk.', '.klllkllllk.', 'kllllklllllk', 'kllllklllllk',
    'kllllkkkkllk', 'kllllllllllk', '.kllllllllk.', '.kllllllllk.', '..kkllllkk..', '....kkkk....',
  ],
  cup: [
    '...k..k.....', '..k..k......', '...k..k.....', '', 'kkkkkkkkk...', 'krrrrrrrkkk.', 'krrrrrrrk.k.',
    'krrrrrrrk.k.', 'krrrrrrrkkk.', '.krrrrrk....', '..kkkkk.....',
  ],
  wave: [
    '', 'kkkkkkkkkkkk', 'kppppppppppk', 'kpppppwppppk', 'kpppwpwpwppk', 'kpwpwpwpwpwk', 'kpwpwpwpwpwk',
    'kpwpwpwpwpwk', 'kpppwpwpwppk', 'kpppppwppppk', 'kppppppppppk', 'kkkkkkkkkkkk',
  ],
  moon: [
    '', '....kkkk....', '..kkyyk.....', '.kyyyk......', '.kyyk.......', 'kyyyk.......', 'kyyyk.......',
    'kyyyyk......', '.kyyyykkkkk.', '..kyyyyyyk..', '...kkkkkk...',
  ],
  fold: [
    '', '', 'kk...kk...kk', 'krk.krrk.krk', 'krrkrrrrkrrk', 'krrkrrrrkrrk', 'krrkrrrrkrrk', 'krrkrrrrkrrk',
    'krrkrrrrkrrk', 'krk.krrk.krk', 'kk...kk...kk',
  ],
  book: [
    '', '.kkkkkkkkkk.', '.kbbbbbbbbk.', '.kbbbbbbbbk.', '.kbbkkkkbbk.', '.kbbbbbbbbk.', '.kbbbbbbbbk.',
    '.kbbbbbbbbk.', '.kbbbbbbbbk.', '.kkkkkkkkkk.', '.knnnnnnnnk.', '.kkkkkkkkkk.',
  ],
  camera: [
    '', '', '...kkkk.....', 'kkkkkkkkkkkk', 'kssssssssssk', 'kssskkkksssk', 'ksskbwbbkssk',
    'ksskbbbbkssk', 'kssskkkksssk', 'kssssssssssk', 'kkkkkkkkkkkk',
  ],
  copy: [
    'kkkkkkkk....', 'kwwwwwwk....', 'kwwwwwwk....', 'kwwkkkkkkkkk', 'kwwknnnnnnnk', 'kwwknnnnnnnk',
    'kwwknnnnnnnk', 'kkkknnnnnnnk', '...knnnnnnnk', '...knnnnnnnk', '...knnnnnnnk', '...kkkkkkkkk',
  ],
  trash: [
    '', '....kkkk....', 'kkkkkkkkkkkk', '', '.kkkkkkkkkk.', '.kssksskssk.', '.kssksskssk.', '.kssksskssk.',
    '.kssksskssk.', '.kssksskssk.', '.kssksskssk.', '..kkkkkkkk..',
  ],
  play: [
    '', '...k........', '...kk.......', '...kak......', '...kaak.....', '...kaaak....', '...kaaaak...',
    '...kaaak....', '...kaak.....', '...kak......', '...kk.......', '...k........',
  ],
  pause: [
    '', '..kkk..kkk..', '..kak..kak..', '..kak..kak..', '..kak..kak..', '..kak..kak..', '..kak..kak..',
    '..kak..kak..', '..kak..kak..', '..kak..kak..', '..kkk..kkk..',
  ],
  arrow: [
    '', '', '.......k....', '.......kk...', '.......kkk..', '.kkkkkkkkkk.', '.kkkkkkkkkk.', '.......kkk..',
    '.......kk...', '.......k....',
  ],
  box: [
    '', '', 'kkkkkkkkkkkk', 'kttttttttttk', 'kkkkkkkkkkkk', '.kttttttttk.', '.kttkkkkttk.', '.kttttttttk.',
    '.kttttttttk.', '.kttttttttk.', '.kkkkkkkkkk.',
  ],
  link: [
    '', '', '', '', '.kkkk..kkkk.', 'k....kk....k', 'k..kkkkkk..k', 'k....kk....k', '.kkkk..kkkk.',
  ],
}

export type IconName = keyof typeof ART

/** One path per colour, built from horizontal runs. */
const PATHS = Object.fromEntries(
  Object.entries(ART).map(([name, rows]) => {
    const d: Record<string, string> = {}
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        const c = row[x]
        let e = x
        while (row[e] === c) e++
        if (c !== '.') d[c] = (d[c] ?? '') + `M${x} ${y}h${e - x}v1h${x - e}z`
        x = e
      }
    })
    return [name, Object.entries(d).map(([c, p]) => <path key={c} d={p} fill={C[c]} />)]
  }),
) as unknown as Record<IconName, ReactNode>

/** Sizes snap to whole multiples of the 12px grid so every pixel is the same size. */
export function Icon({ name, size = 24, className = 'icon' }: { name: IconName; size?: number; className?: string }) {
  const s = Math.max(12, Math.round(size / 12) * 12)
  return (
    <svg className={className} viewBox="0 0 12 12" width={s} height={s} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  )
}
