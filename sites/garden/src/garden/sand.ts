import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import type { GardenObject } from './layout'

// The gravel is a flat plane whose relief comes from a grayscale height canvas used as a bump map.
// Raking draws into that canvas.
export const PLANE_W = 64
export const PLANE_H = 42
const CW = 1536
const CH = 1008
const PERIOD = 12 // px between ridges
const PPU = CW / PLANE_W
type P = [number, number]

export function createSand(objects: GardenObject[]) {
  const canvas = document.createElement('canvas')
  canvas.width = CW
  canvas.height = CH
  const ctx = canvas.getContext('2d')!
  const texture = new CanvasTexture(canvas)
  texture.anisotropy = 8

  const stones = objects.map((o) => {
    const rc = o.r * PPU * 1.05
    return { cx: (o.x / PLANE_W + 0.5) * CW, cy: (o.z / PLANE_H + 0.5) * CH, rc }
  })

  /**
   * Straight raked lines, with concentric rings around every object.
   * Ring distance is a smooth minimum over all stones, so rings of neighbouring stones merge
   * into one flowing contour instead of meeting at a seam. Rings fade into the straight lines
   * over FADE px rather than switching abruptly, which used to show as a hard, aliased edge.
   */
  function rakeBase() {
    const BAND = PERIOD * 5, FADE = PERIOD * 1.5, K = PERIOD * 1.5
    const smin = (a: number, b: number) => {
      const h = Math.max(K - Math.abs(a - b), 0) / K
      return Math.min(a, b) - (h * h * K) / 4
    }
    const reach = BAND + K
    const img = ctx.createImageData(CW, CH)
    const d = img.data
    for (let y = 0; y < CH; y++) {
      const line = 0.5 + 0.5 * Math.cos((2 * Math.PI * y) / PERIOD)
      for (let x = 0; x < CW; x++) {
        let du = Infinity
        for (const s of stones) {
          const dx = x - s.cx, dy = y - s.cy, lim = s.rc + reach
          if (dx > lim || dx < -lim || dy > lim || dy < -lim) continue
          const ds = Math.sqrt(dx * dx + dy * dy) - s.rc
          du = du === Infinity ? ds : smin(du, ds)
        }
        let h = line
        if (du <= 0) h = 0 // under and right around a stone: level with the first groove, so no step shows
        else if (du < BAND) {
          const ring = 0.5 - 0.5 * Math.cos((2 * Math.PI * du) / PERIOD) // a groove right at the stone edge, not a bright crest
          const t = Math.min(1, Math.max(0, (du - (BAND - FADE)) / FADE))
          const w = t * t * (3 - 2 * t) // smoothstep
          h = ring + (line - ring) * w
        }
        const v = (h * 0.75 + 0.125 + (Math.random() - 0.5) * 0.07) * 255
        const i = (y * CW + x) * 4
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    texture.needsUpdate = true
  }

  const nearStone = (p: P) => stones.some((s) => Math.hypot(p[0] - s.cx, p[1] - s.cy) < s.rc + PERIOD)

  // ---- raking -------------------------------------------------------------
  // A stroke is one continuous path, resampled every STEP px from a smoothed pointer.
  // Each tine follows its own offset curve, built from per-point normals, so neighbouring
  // segments share edges exactly. A segment is drawn once the point after it is known
  // (its end normal depends on it), which is a lag of only STEP px.
  const TINES = 5
  const HALF = (TINES * PERIOD) / 2
  const STEP = 4
  let pts: P[] = []
  let drawn = 0
  let smooth: P = [0, 0]

  const normal = (i: number): P => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  }
  const off = (i: number, n: P, d: number): P => [pts[i][0] + n[0] * d, pts[i][1] + n[1] * d]

  /** Draws segments [from, to) in three batched passes: clear the band, cut grooves, raise ridges. */
  function drawSegments(from: number, to: number) {
    if (to <= from) return
    const segs: [number, P, P][] = []
    for (let i = from; i < to; i++) if (!nearStone(pts[i]) && !nearStone(pts[i + 1])) segs.push([i, normal(i), normal(i + 1)])
    if (!segs.length) return
    ctx.save()
    ctx.filter = 'blur(2.5px)' // feather the band edge into the untouched gravel
    ctx.fillStyle = 'rgb(128,128,128)'
    ctx.beginPath()
    for (const [i, n0, n1] of segs) {
      const a = off(i, n0, HALF), b = off(i + 1, n1, HALF), c = off(i + 1, n1, -HALF), d = off(i, n0, -HALF)
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath()
    }
    ctx.fill()
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.filter = 'blur(1.6px)'
    const pass = (offsets: number[], width: number, color: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      for (const [i, n0, n1] of segs)
        for (const o of offsets) {
          const a = off(i, n0, o), b = off(i + 1, n1, o)
          ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1])
        }
      ctx.stroke()
    }
    const tines = Array.from({ length: TINES }, (_, k) => (k - (TINES - 1) / 2) * PERIOD)
    // grooves under each tine, ridges between them and on both edges; values match the base pattern's range
    pass(tines, PERIOD * 0.45, 'rgb(40,40,40)')
    pass([...tines.map((t) => t - PERIOD / 2), tines[TINES - 1] + PERIOD / 2], PERIOD * 0.4, 'rgb(215,215,215)')
    ctx.restore()
    texture.needsUpdate = true
  }

  function rakeStart(p: P) {
    pts = [p]
    smooth = p
    drawn = 0
  }

  function rakeMove(p: P) {
    if (!pts.length) return
    smooth = [smooth[0] + (p[0] - smooth[0]) * 0.5, smooth[1] + (p[1] - smooth[1]) * 0.5] // damp hand jitter
    let last = pts[pts.length - 1]
    let d = Math.hypot(smooth[0] - last[0], smooth[1] - last[1])
    while (d >= STEP) {
      const t = STEP / d
      last = [last[0] + (smooth[0] - last[0]) * t, last[1] + (smooth[1] - last[1]) * t]
      pts.push(last)
      d -= STEP
    }
    drawSegments(drawn, pts.length - 2)
    drawn = Math.max(drawn, pts.length - 2)
  }

  function rakeEnd() {
    drawSegments(drawn, pts.length - 1)
    pts = []
  }

  /** UV on the plane → canvas pixel. */
  const uvToCanvas = (u: number, v: number): P => [u * CW, (1 - v) * CH]

  rakeBase()
  return { texture, rakeBase, rakeStart, rakeMove, rakeEnd, uvToCanvas }
}

/**
 * Tileable gravel colour: fine noise plus thousands of individual grains in slightly different
 * stones (warm, cool, dark, bright), each with a lit top and a shadowed underside.
 * Tiled across the plane, it breaks up the flat, plastic look of a single colour.
 */
export function createGrain() {
  const S = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = S
  const x = canvas.getContext('2d')!
  const img = x.createImageData(S, S)
  for (let i = 0; i < S * S; i++) {
    const v = 206 + (Math.random() - 0.5) * 26
    img.data.set([v + 5, v + 1, v - 9, 255], i * 4)
  }
  x.putImageData(img, 0, 0)
  for (let k = 0; k < 14000; k++) {
    const px = Math.random() * S, py = Math.random() * S
    const r = 0.6 + Math.random() ** 2 * 2.2
    const kind = Math.random()
    const t = kind < 0.12 ? 120 + Math.random() * 40 : kind < 0.3 ? 236 + Math.random() * 19 : 185 + Math.random() * 45
    const warm = (Math.random() - 0.4) * 14
    for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) { // draw wrapped copies so the tile is seamless
      const cx = px + ox, cy = py + oy
      if (cx < -4 || cx > S + 4 || cy < -4 || cy > S + 4) continue
      x.fillStyle = 'rgba(40,36,30,.35)' // underside shadow
      x.beginPath(); x.arc(cx + r * 0.35, cy + r * 0.45, r, 0, 7); x.fill()
      x.fillStyle = `rgb(${t + warm | 0},${t | 0},${t - warm - 8 | 0})`
      x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill()
    }
  }
  const tex = new CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = RepeatWrapping
  tex.repeat.set(PLANE_W / 1.4, PLANE_H / 1.4)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}
