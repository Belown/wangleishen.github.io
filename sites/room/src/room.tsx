import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import { Bi, useLang } from './i18n'
import { tabLabel } from './lib'

/* ---------- pixel-isometric helpers (2:1): x runs along the right wall, y along the left wall, z up ---------- */
type P3 = [number, number, number]
const PLUM = '#2a2630'
const K = 0.8
const iso = (x: number, y: number, z: number): [number, number] => [350 + (x - y) * K, 210 + (x + y) * 0.5 * K - z * K]
const pts = (p: P3[]) => p.map((q) => iso(...q).map((n) => n.toFixed(1)).join(',')).join(' ')
const VB = { x: 94, y: 20, w: 512, h: 446 }

/** Darken (f < 1) or lighten towards white (f > 1). */
function shade(hex: string, f: number) {
  const h = hex.slice(1)
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return '#' + [n >> 16, (n >> 8) & 255, n & 255]
    .map((v) => Math.round(f <= 1 ? v * f : v + (255 - v) * (f - 1)).toString(16).padStart(2, '0'))
    .join('')
}

const poly = (p: P3[], fill: string, sw = 1.6, extra: { opacity?: number; dash?: string; stroke?: string } = {}) => (
  <polygon points={pts(p)} fill={fill} stroke={extra.stroke ?? (sw ? PLUM : 'none')} strokeWidth={sw}
    strokeLinejoin="round" opacity={extra.opacity} strokeDasharray={extra.dash} />
)
// flat rectangles on the three planes
const onX = (x: number, y0: number, y1: number, z0: number, z1: number): P3[] => [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]]
const onY = (y: number, x0: number, x1: number, z0: number, z1: number): P3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]
const onZ = (z: number, x0: number, x1: number, y0: number, y1: number): P3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]

/** A box: top, right face (+x) and left face (+y), shaded from one colour. */
const box = (x: number, y: number, z: number, w: number, d: number, h: number, c: string, sw = 1.6) => (
  <g>
    {poly(onZ(z + h, x, x + w, y, y + d), c, sw)}
    {poly(onX(x + w, y, y + d, z, z + h), shade(c, 0.84), sw)}
    {poly(onY(y + d, x, x + w, z, z + h), shade(c, 0.93), sw)}
  </g>
)
/** A circle lying on one of the planes. */
const circ = (plane: 'x' | 'y', c: P3, r: number, n = 22): P3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, u = Math.cos(a) * r, v = Math.sin(a) * r
    return plane === 'x' ? [c[0], c[1] + u, c[2] + v] : [c[0] + u, c[1], c[2] + v]
  })
/** An upright cylinder standing on (x, y, z). */
function cyl(x: number, y: number, z: number, r: number, h: number, c: string, sw = 1.6) {
  const [sx, sy] = iso(x, y, z), top = sy - h * K, rx = r * K * Math.SQRT2, ry = r * K * Math.SQRT1_2
  return (
    <g>
      <path d={`M${sx - rx},${top}V${sy}A${rx},${ry} 0 0 0 ${sx + rx},${sy}V${top}Z`} fill={shade(c, 0.88)} stroke={PLUM} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx={sx} cy={top} rx={rx} ry={ry} fill={c} stroke={PLUM} strokeWidth={sw} />
    </g>
  )
}
const seg = (a: P3, b: P3, stroke = PLUM, sw = 1.4) => {
  const [x1, y1] = iso(...a), [x2, y2] = iso(...b)
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
}
/** Text painted onto the pink wall (y = 0), starting at (x, z). */
const wallText = (x: number, z: number, size: number, text: string) => {
  const [ex, ey] = iso(x, 0, z)
  return (
    <text transform={`matrix(${K} ${0.5 * K} 0 ${K} ${ex} ${ey})`} fontSize={size} fill={PLUM}
      fontFamily="'Pixelify Sans', monospace" fontWeight="700" textAnchor="middle">{text}</text>
  )
}

const BOOKS = ['#a35d48', '#5b6f86', '#7d9468', '#c49a4a', '#6f5f78', '#b07a52', '#5f857d']
const LEAF = '#7d9468'

/* ---------- the room shell ---------- */
function Shell() {
  const { lang } = useLang()
  const now = new Date()
  const flags = Array.from({ length: 12 }, (_, i) => {
    const a = 16 + i * 23, sag = (u: number) => 210 - Math.sin((u / 300) * Math.PI) * 10
    return <g key={i}>{poly([[a, 0, sag(a)], [a + 13, 0, sag(a + 13)], [a + 6.5, 0, sag(a + 6.5) - 15]], ['#d4b064', '#5b6f86', '#6f5f78', '#7d9468'][i % 4], 1.2)}</g>
  })
  return (
    <g aria-hidden="true">
      {/* wall thickness and floor slab: a cut-away dollhouse */}
      {poly(onZ(220, -6, 0, -6, 300), '#ece6d8')}
      {poly(onZ(220, -6, 300, -6, 0), '#ece6d8')}
      {poly([[-6, 300, -10], [0, 300, -10], [0, 300, 220], [-6, 300, 220]], '#a5aba1')}
      {poly([[300, -6, -10], [300, 0, -10], [300, 0, 220], [300, -6, 220]], '#bfb39f')}
      {poly(onX(0, 0, 300, 0, 220), '#c3c8bf')}
      {poly(onY(0, 0, 300, 0, 220), '#d6cbb8')}
      {poly(onX(300, 0, 300, -10, 0), '#6f5440')}
      {poly(onY(300, 0, 300, -10, 0), '#7d5f47')}
      {Array.from({ length: 100 }, (_, k) => {
        const i = k % 10, j = Math.floor(k / 10)
        return <g key={k}>{poly(onZ(0, i * 30, i * 30 + 30, j * 30, j * 30 + 30), (i + j) % 2 ? '#a98463' : '#9e7a5a', 0.6, { stroke: '#8d6b4d' })}</g>
      })}
      {poly(onZ(0, 0, 300, 0, 300), 'none')}
      {/* skirting */}
      {poly(onY(0.2, 0, 300, 0, 7), '#ece6d8', 1.2)}
      {poly(onX(0.2, 0, 300, 0, 7), '#ece6d8', 1.2)}
      {/* bunting */}
      <polyline points={Array.from({ length: 16 }, (_, i) => iso(i * 20, 0, 210 - Math.sin((i * 20 / 300) * Math.PI) * 10).join(',')).join(' ')} fill="none" stroke={PLUM} strokeWidth="1.2" />
      {flags}
      {/* calendar showing today */}
      {seg([146, 0, 180], [146, 0, 184])}
      {poly(onY(0, 128, 164, 142, 180), '#ece6d8')}
      {poly(onY(0, 128, 164, 170, 180), '#5b6f86')}
      {wallText(146, 177.5, 7, lang === 'en' ? now.toLocaleString('en', { month: 'short' }).toUpperCase() : `${now.getMonth() + 1}月`)}
      {wallText(146, 152, 19, String(now.getDate()))}
      {/* window over the desk */}
      {seg([2, 160, 196], [2, 274, 196], PLUM, 2)}
      {poly(onX(0, 172, 262, 96, 190), '#ece6d8')}
      {poly(onX(0.2, 178, 256, 102, 184), '#9fb7c2', 1.2)}
      {poly(circ('x', [0.3, 236, 164], 9), '#d4b064', 1.2)}
      {[[0.3, 200, 128, 7], [0.3, 192, 131, 5.5], [0.3, 208, 131, 5.5]].map(([x, y, z, r], i) => <g key={i}>{poly(circ('x', [x, y, z], r), '#ece6d8', 0)}</g>)}
      {poly(onX(0.4, 216, 218, 102, 184), '#ece6d8', 1.2)}
      {poly(onX(0.4, 178, 256, 142, 144), '#ece6d8', 1.2)}
      {poly(onX(1, 164, 180, 88, 194), '#8a6d68', 1.4)}
      {poly(onX(1, 254, 270, 88, 194), '#8a6d68', 1.4)}
      {box(0, 170, 92, 8, 92, 4, '#ece6d8', 1.4)}
      {/* rug */}
      {poly(onZ(0.3, 84, 214, 92, 222), '#8a6d68')}
      {poly(onZ(0.4, 92, 206, 100, 214), 'none', 1.4, { stroke: '#ece6d8', dash: '5 4' })}
    </g>
  )
}

/* ---------- furniture: each piece is a section ---------- */
function Frame() {
  return (
    <>
      {seg([30, 0, 168], [53, 0, 186])}{seg([53, 0, 186], [76, 0, 168])}
      {poly(circ('y', [53, 0, 186], 1.6, 8), PLUM, 0)}
      {poly(onY(0, 22, 84, 110, 170), '#8a6448')}
      {poly(onY(0, 28, 78, 116, 164), '#ece6d8', 1.2)}
      {poly(onY(0, 33, 73, 121, 159), '#c3c8bf', 1.2)}
      {poly([[41, 0, 121], [65, 0, 121], [61, 0, 133], [45, 0, 133]], '#6f5f78', 1.2)}
      {poly(circ('y', [53, 0, 143], 8), PLUM, 0)}
      {poly(circ('y', [53, 0, 141], 6), '#d9c2a5', 1.2)}
    </>
  )
}

function Shelf() {
  // neat rows: [width, height] per book, standing on each shelf board
  const rows: [number, number][][] = [
    [[10, 30], [8, 27], [11, 30], [9, 25], [12, 29], [8, 30], [10, 26], [9, 28], [11, 30]],
    [[9, 28], [11, 30], [8, 26], [10, 29], [12, 27], [9, 30]],
    [[11, 29], [9, 30], [10, 27], [8, 25], [12, 30], [9, 28], [10, 30], [11, 26]],
    [[10, 28], [9, 30], [12, 26], [8, 29]],
  ]
  return (
    <>
      {box(0, 18, 0, 34, 104, 172, '#9b7b5a')}
      {rows.map((row, r) => {
        const zb = 8 + r * 40
        let y = 24
        return (
          <g key={r}>
            {poly(onX(34, 24, 116, zb, zb + 34), '#6e5440', 1.4)}
            {row.map(([w, h], b) => {
              const c = BOOKS[(b * 3 + r * 2) % BOOKS.length], y0 = y
              y += w
              return (
                <g key={b}>
                  {poly(onZ(zb + h, 30, 34, y0, y0 + w), shade(c, 1.35), 1.1)}
                  {poly(onX(34, y0, y0 + w, zb, zb + h), c, 1.1)}
                  {poly(onX(34.1, y0 + 2, y0 + w - 2, zb + h - 8, zb + h - 5), '#ece6d8', 0, { opacity: 0.75 })}
                </g>
              )
            })}
          </g>
        )
      })}
      {/* a lying stack and a little plant */}
      {box(18, 84, 48, 15, 16, 5, '#5b6f86', 1.1)}
      {box(19, 85, 53, 13, 14, 5, '#c49a4a', 1.1)}
      {cyl(27, 88, 128, 6.5, 11, '#b07a52', 1.3)}
      {[[27, 93, 146, 6.5], [27, 83, 144, 5.5], [27, 88, 151, 6]].map(([x, y, z, r], i) => <g key={i}>{poly(circ('x', [x, y, z], r), LEAF, 1.2)}</g>)}
      {box(6, 34, 172, 22, 26, 10, '#6f5f78', 1.3)}
    </>
  )
}

function Piano() {
  const kw = 102 / 21
  return (
    <>
      {box(104, 0, 0, 106, 34, 8, '#332c36')}
      {box(102, 0, 8, 110, 30, 38, '#3d3540')}
      {box(102, 0, 46, 110, 26, 61, '#3d3540')}
      {poly(onY(26, 140, 176, 66, 92), '#ece6d8', 1.2)}
      {[72, 77, 82, 87].map((z) => <g key={z}>{seg([143, 26, z], [173, 26, z], PLUM, 0.8)}</g>)}
      {box(106, 40, 0, 6, 8, 46, '#332c36')}{box(202, 40, 0, 6, 8, 46, '#332c36')}
      {box(104, 26, 46, 106, 24, 9, '#3d3540')}
      {poly(onZ(55, 106, 208, 33, 48), '#ece6d8', 1.2)}
      {Array.from({ length: 20 }, (_, i) => <g key={i}>{seg([106 + (i + 1) * kw, 33, 55], [106 + (i + 1) * kw, 48, 55], PLUM, 0.6)}</g>)}
      {Array.from({ length: 21 }, (_, i) => i).filter((i) => [0, 1, 3, 4, 5].includes(i % 7) && i < 20).map((i) => {
        const xk = 106 + (i + 1) * kw
        return <g key={i}>{poly(onZ(55.3, xk - 1.4, xk + 1.4, 33, 41), PLUM, 0.6)}</g>
      })}
      {box(100, 0, 107, 114, 29, 5, '#332c36')}
      {/* camera on top */}
      {box(170, 6, 112, 26, 16, 14, '#c9c6bd', 1.4)}
      {box(176, 9, 126, 9, 10, 4, '#8e8f94', 1.2)}
      {poly(circ('y', [183, 22, 119], 5.4), PLUM, 0)}
      {poly(circ('y', [183, 22.2, 119], 3.2), '#5b6f86', 0.8)}
      {/* a small vase */}
      {cyl(115, 14, 112, 4, 11, '#5b6f86', 1.3)}
      {seg([115, 14, 123], [115, 14, 131], '#5d7550', 1.4)}
      {poly(circ('y', [115, 14, 133], 3.4, 10), '#d4b064', 1.1)}
      {/* bench */}
      {box(126, 64, 0, 62, 18, 20, '#3d3540')}
      {box(124, 62, 20, 66, 22, 6, '#8a6d68', 1.4)}
    </>
  )
}

function Workbench() {
  return (
    <>
      {poly(onY(0, 224, 296, 86, 156), '#c9b896')}
      {Array.from({ length: 30 }, (_, k) => {
        const x = 232 + (k % 6) * 11.5, z = 94 + Math.floor(k / 6) * 14
        return <g key={k}>{poly(circ('y', [x, 0, z], 1, 6), PLUM, 0, { opacity: 0.35 })}</g>
      })}
      {poly(onY(0.2, 230, 235, 98, 150), '#c49a4a', 1.2)}
      {poly(onY(0.2, 249, 252, 98, 132), '#b07a52', 1.2)}
      {poly(onY(0.3, 243, 258, 131, 138), '#8e8f94', 1.2)}
      {poly(circ('y', [276, 0.2, 124], 9), 'none', 2.4, { stroke: '#5f857d' })}
      {poly(circ('y', [276, 0.2, 124], 5.5), 'none', 2.4, { stroke: '#5f857d' })}
      {box(224, 2, 0, 6, 6, 58, '#56705f')}{box(288, 2, 0, 6, 6, 58, '#56705f')}
      {box(226, 4, 14, 66, 44, 4, '#a98463', 1.3)}
      {box(232, 14, 18, 22, 18, 10, '#6f5f78', 1.2)}
      {box(224, 44, 0, 6, 6, 58, '#56705f')}{box(288, 44, 0, 6, 6, 58, '#56705f')}
      {box(220, 0, 58, 78, 52, 8, '#6f8c78')}
      {/* on the bench: a warm cup, a motor, a paper synth, a tidal glass */}
      {poly(onZ(66.3, 260, 290, 26, 46), '#ece6d8', 1.2)}
      {[0, 1, 2, 3].map((i) => <g key={i}>{poly(onZ(66.5, 264 + i * 6.5, 268 + i * 6.5, 32, 36), '#a35d48', 0.8)}</g>)}
      {box(244, 10, 66, 14, 12, 9, '#c49a4a', 1.3)}
      {cyl(232, 36, 66, 6, 10, '#d8cdb8', 1.4)}
      {cyl(284, 12, 66, 5.5, 15, '#9fb7c2', 1.3)}
    </>
  )
}

function Desk() {
  return (
    <>
      {box(2, 162, 0, 5, 5, 56, '#6f4f39')}
      {box(4, 226, 0, 50, 44, 56, '#8a6448')}
      {[[4, 18], [22, 36], [40, 52]].map(([z0, z1]) => (
        <g key={z0}>
          {poly(onX(54.2, 230, 266, z0, z1), '#9c7556', 1.2)}
          {poly(onX(54.4, 244, 252, (z0 + z1) / 2 - 1, (z0 + z1) / 2 + 1), PLUM, 0)}
        </g>
      ))}
      {box(50, 162, 0, 5, 5, 56, '#6f4f39')}
      {box(0, 158, 56, 60, 116, 6, '#8a6448')}
      {/* laptop facing the room */}
      {box(14, 180, 62, 30, 44, 3, '#b8b6ae', 1.3)}
      {poly(onZ(65.2, 20, 38, 185, 219), '#9d9b94', 1)}
      {box(10, 180, 65, 3, 44, 30, '#2f3238', 1.4)}
      {poly(onX(13.2, 183, 221, 68, 92), '#7f9fb0', 1)}
      {[[86, 188, 204, '#ece6d8'], [81, 188, 212, '#c49a4a'], [76, 192, 208, '#ece6d8'], [71, 192, 200, '#a35d48']].map(([z, a, b, c]) => (
        <g key={z as number}>{seg([13.4, a as number, z as number], [13.4, b as number, z as number], c as string, 1.6)}</g>
      ))}
      {/* papers and a mug */}
      {poly(onZ(62.4, 18, 46, 236, 262), '#ece6d8', 1.2)}
      {[244, 250, 256].map((y) => <g key={y}>{seg([22, y, 62.6], [42, y, 62.6], '#5b6f86', 1)}</g>)}
      {cyl(44, 244, 62, 4.5, 9, '#5b6f86', 1.3)}
      {/* a stool */}
      {cyl(84, 214, 0, 7, 2, '#c49a4a', 1.3)}
      {cyl(84, 214, 2, 2, 30, '#8e8f94', 1.2)}
      {cyl(84, 214, 32, 11, 5, '#c49a4a', 1.4)}
    </>
  )
}

/** A tea table on the rug, for whoever drops by. */
function TeaCorner() {
  return (
    <g aria-hidden="true">
      {box(124, 134, 0, 6, 6, 16, '#8a6448', 1.2)}{box(160, 134, 0, 6, 6, 16, '#8a6448', 1.2)}
      {box(124, 168, 0, 6, 6, 16, '#8a6448', 1.2)}{box(160, 168, 0, 6, 6, 16, '#8a6448', 1.2)}
      {box(120, 130, 16, 50, 46, 5, '#a07a58')}
      {cyl(140, 148, 21, 6.5, 8, '#5b6f86', 1.3)}
      {cyl(140, 148, 29, 2, 2, '#5b6f86', 1.1)}
      {cyl(157, 164, 21, 3.5, 4, '#ece6d8', 1.2)}
      {box(178, 150, 0, 26, 26, 6, '#d4b064', 1.4)}
    </g>
  )
}

function Plant() {
  const [sx, sy] = iso(18, 284, 14)
  return (
    <g aria-hidden="true">
      {cyl(18, 284, 0, 9, 14, '#b07a52')}
      {[[-9, -10, 7, 12, -20], [8, -12, 7, 13, 18], [0, -20, 6.5, 14, 0]].map(([dx, dy, rx, ry, rot], i) => (
        <ellipse key={i} cx={sx + dx} cy={sy + dy} rx={rx} ry={ry} transform={`rotate(${rot} ${sx + dx} ${sy + dy})`} fill={LEAF} stroke={PLUM} strokeWidth="1.4" />
      ))}
    </g>
  )
}

type Piece = { to: string; anchor: P3; art: ReactNode }
const PIECES: Piece[] = [
  { to: '/about', anchor: [53, 0, 190], art: <Frame /> },
  { to: '/writing', anchor: [17, 70, 190], art: <Shelf /> },
  { to: '/art', anchor: [183, 14, 140], art: <Piano /> },
  { to: '/design', anchor: [260, 0, 166], art: <Workbench /> },
  { to: '/research', anchor: [30, 216, 108], art: <Desk /> },
]

/* ---------- pixels: the SVG is drawn into a small canvas, one canvas pixel per PX units, then shown scaled up ---------- */
const PX = 2
const SEL = '#d9a441' // outline around the piece you are pointing at
const PIXEL_CSS = `*{shape-rendering:crispEdges}[stroke-width]{stroke-width:${PX}px}`

/** Rasterise an SVG element into a canvas with hard edges and one-pixel outlines. `prep` may edit the copy first. */
function rasterise(svg: SVGSVGElement, canvas: HTMLCanvasElement, prep?: (copy: SVGSVGElement) => void) {
  const vb = svg.viewBox.baseVal
  const w = Math.round(vb.width / PX), h = Math.round(vb.height / PX)
  const copy = svg.cloneNode(true) as SVGSVGElement
  copy.setAttribute('width', String(w))
  copy.setAttribute('height', String(h))
  copy.removeAttribute('class')
  copy.removeAttribute('style')
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = PIXEL_CSS
  copy.prepend(style)
  prep?.(copy)
  const img = new Image()
  let live = true
  img.onload = () => {
    if (!live) return
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')!.drawImage(img, 0, 0)
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(copy))
  return () => { live = false }
}

/** Largest whole-device-pixel scale of the art that fits the stage's width, so every art pixel is the same size (narrow screens just fit). */
function usePixelScale(ref: RefObject<HTMLElement | null>, artW: number) {
  const [scale, setScale] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      const dpr = window.devicePixelRatio || 1
      const n = (el.clientWidth * dpr) / artW
      setScale((n >= 2 ? Math.floor(n) : n) / dpr) // below 2× a whole step would shrink it too much; accept uneven pixels
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, artW])
  return scale
}

/* ---------- the room on the home page ---------- */
export function Room() {
  const nav = useNavigate()
  const { lang, t, tr } = useLang()
  const [on, setOn] = useState<number | null>(null)
  const off = (i: number) => setOn((c) => (c === i ? null : c))
  const stage = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const artW = Math.round(VB.w / PX), artH = Math.round(VB.h / PX)
  const scale = usePixelScale(stage, artW)

  // the piece you point at rises a few pixels and gets an outline; the visible picture is the canvas
  useLayoutEffect(() => rasterise(svg.current!, canvas.current!, (copy) => {
    const g = on === null ? null : copy.querySelector(`[data-piece="${on}"]`)
    g?.setAttribute('transform', `translate(0 ${-3 * PX})`)
    g?.setAttribute('filter', 'url(#sel)')
  }), [on, lang])

  const piece = (i: number) => {
    const p = PIECES[i]
    return (
      <g key={p.to} data-piece={i} className="furn" tabIndex={0} role="link" aria-label={t(tabLabel(p.to))}
        onClick={() => nav(p.to)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav(p.to) } }}
        onPointerEnter={() => setOn(i)} onPointerLeave={() => off(i)} onFocus={() => setOn(i)} onBlur={() => off(i)}>
        {p.art}
      </g>
    )
  }

  return (
    <div className="room-stage" ref={stage} style={scale ? undefined : { aspectRatio: `${VB.w} / ${VB.h}` }}>
      <div className="room-art" style={scale ? { width: artW * scale, height: artH * scale } : undefined}>
        <canvas ref={canvas} aria-hidden="true" />
        <svg ref={svg} className="room-hit" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="group"
          aria-label={tr('我的房间：每件家具通向一个栏目', 'My room: each piece of furniture opens a section')}>
          <defs>
            <filter id="sel" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feMorphology in="SourceAlpha" operator="dilate" radius={PX} result="d" />
              <feFlood floodColor={SEL} />
              <feComposite in2="d" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <Shell />
          {piece(0)}{piece(1)}{piece(2)}{piece(3)}
          <TeaCorner />
          {piece(4)}
          <Plant />
        </svg>
        {PIECES.map((p, i) => {
          const [sx, sy] = iso(...p.anchor)
          const left = (sx - VB.x) / VB.w
          return (
            <span key={p.to} className={'bubble' + (left > 0.75 ? ' r' : '') + (on === i ? ' on' : '')} aria-hidden="true"
              style={{ left: `${left * 100}%`, top: `${((sy - 3 * PX - VB.y) / VB.h) * 100}%` }}>
              <Bi text={tabLabel(p.to)} />
            </span>
          )
        })}
      </div>
    </div>
  )
}

/** One piece of furniture on its own, cropped to fit and pixelated: the heading picture of a section page. */
export function FurnitureArt({ to }: { to: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const g = useRef<SVGGElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [vb, setVb] = useState<string | null>(null)
  useLayoutEffect(() => {
    const b = g.current?.getBBox()
    if (b && b.width) setVb(`${b.x - PX} ${b.y - PX} ${b.width + 2 * PX} ${b.height + 2 * PX}`)
  }, [to])
  useLayoutEffect(() => (vb ? rasterise(svg.current!, canvas.current!) : undefined), [vb])
  const p = PIECES.find((q) => q.to === to)
  if (!p) return null
  return (
    <span className="furn-art" aria-hidden="true">
      <canvas ref={canvas} />
      <svg ref={svg} className="measure" viewBox={vb ?? `${VB.x} ${VB.y} ${VB.w} ${VB.h}`}><g ref={g}>{p.art}</g></svg>
    </span>
  )
}
