import {
  BoxGeometry, BufferAttribute, BufferGeometry, CircleGeometry, Color, CylinderGeometry, DoubleSide, Group, LatheGeometry,
  Mesh, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, TorusGeometry, Vector2, Vector3, type MeshStandardMaterialParameters,
} from 'three'
import { CELLS, SHELF } from './layout'
import { fbm, noise3 } from './noise'

export type ItemKey = 'books' | 'ding' | 'seal' | 'vase' | 'bowl' | 'qin' | 'rock' | 'scroll' | 'plate' | 'gourd'

const std = (color: string, roughness = 0.6, extra: MeshStandardMaterialParameters = {}) => new MeshStandardMaterial({ color, roughness, ...extra })
const mesh = (geo: BufferGeometry, mat: MeshStandardMaterial | MeshStandardMaterial[], x = 0, y = 0, z = 0) => {
  const m = new Mesh(geo, mat)
  m.position.set(x, y, z)
  return m
}
const lathe = (pts: [number, number][], mat: MeshStandardMaterial) => new Mesh(new LatheGeometry(pts.map(([x, y]) => new Vector2(x, y)), 64), mat)

/** Eroded limestone: noise pushes the surface in and out along its normals and paints it. */
function weather(geo: BufferGeometry, seed: number, amp: number, pits: number) {
  const p = geo.attributes.position, n = geo.attributes.normal
  const v = new Vector3(), nn = new Vector3(), c = new Color(), col = new Float32Array(p.count * 3)
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    nn.fromBufferAttribute(n, i)
    const big = fbm(v.x * 3 + seed, v.y * 3, v.z * 3 - seed, 3), fine = fbm(v.x * 9 + seed, v.y * 9 - seed, v.z * 9, 2)
    const dent = Math.max(0, noise3(v.x * 5 - seed, v.y * 5 + seed, v.z * 5) - 0.58) * 2.4
    v.addScaledVector(nn, (big - 0.5) * amp + (fine - 0.5) * amp * 0.3 - dent * pits)
    p.setXYZ(i, v.x, v.y, v.z)
    const t = 0.62 + (fine - 0.5) * 0.16 - dent * 0.3
    c.setRGB(t, t * 0.99, t * 0.94, SRGBColorSpace)
    col.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new BufferAttribute(col, 3))
  geo.computeVertexNormals()
  return geo
}

const FACTORIES: Record<ItemKey, () => Group> = {
  /** 线装书: a small stack of thread-bound books. */
  books() {
    const g = new Group(), cover = std('#2c3a5a', 0.8), page = std('#e6dfcc', 0.9), mats = [page, page, cover, cover, page, page]
    ;[[0, 0.06, 0, 0.06], [0.04, 0.18, 0.02, -0.08], [-0.03, 0.3, -0.01, 0.12], [0.02, 0.42, 0, -0.03]].forEach(([x, y, z, r], i) => {
      const b = mesh(new BoxGeometry(1.05 - i * 0.06, 0.11, 0.7 - i * 0.04), mats, x, y, z)
      b.rotation.y = r
      g.add(b)
    })
    return g
  },
  /** 鼎: a bronze tripod cauldron with green patina. */
  ding() {
    const g = new Group(), bz = std('#55654c', 0.45, { metalness: 0.55 })
    g.add(mesh(new CylinderGeometry(0.44, 0.36, 0.52, 40), bz, 0, 0.62))
    const rim = mesh(new TorusGeometry(0.44, 0.04, 10, 40), bz, 0, 0.88)
    rim.rotation.x = Math.PI / 2
    g.add(rim)
    for (let k = 0; k < 3; k++) {
      const a = (k * Math.PI * 2) / 3 + 0.5
      g.add(mesh(new CylinderGeometry(0.05, 0.035, 0.4, 10), bz, Math.cos(a) * 0.28, 0.2, Math.sin(a) * 0.28))
    }
    ;[-1, 1].forEach((sx) => g.add(mesh(new TorusGeometry(0.1, 0.03, 8, 20, Math.PI), bz, sx * 0.3, 0.88)))
    return g
  },
  /** 印章: a stone seal with a lion knob on a red silk pad. */
  seal() {
    const g = new Group(), st = std('#b59766', 0.5)
    g.add(mesh(new BoxGeometry(0.75, 0.08, 0.62), std('#9d2f27', 0.85), 0, 0.04))
    g.add(mesh(new BoxGeometry(0.4, 0.42, 0.4), st, 0, 0.29))
    const knob = mesh(new SphereGeometry(0.17, 20, 16), st, 0, 0.58)
    knob.scale.set(1, 0.85, 1.2)
    g.add(knob, mesh(new SphereGeometry(0.1, 16, 12), st, 0, 0.66, 0.14))
    return g
  },
  /** 梅瓶: a celadon prunus vase. */
  vase() {
    const g = new Group(), v = lathe([[0, 0], [0.2, 0], [0.23, 0.08], [0.3, 0.45], [0.42, 1.0], [0.39, 1.3], [0.2, 1.52], [0.12, 1.6], [0.14, 1.68], [0.13, 1.72], [0, 1.72]], std('#86ad93', 0.16))
    v.scale.setScalar(1.1)
    g.add(v)
    return g
  },
  /** White porcelain bowl with a blue band, on a small rosewood stand. */
  bowl() {
    const g = new Group()
    g.add(lathe([[0, 0.04], [0.16, 0.04], [0.18, 0], [0.22, 0.06], [0.46, 0.32], [0.55, 0.44]], std('#f1f0ea', 0.22, { side: DoubleSide })))
    const band = mesh(new TorusGeometry(0.53, 0.012, 6, 48), std('#2b4a8a', 0.4), 0, 0.42)
    band.rotation.x = Math.PI / 2
    g.add(band, mesh(new CylinderGeometry(0.28, 0.32, 0.1, 32), std('#3b2116', 0.5), 0, -0.03))
    g.position.y = 0.08
    return g
  },
  /** 古琴: a small lacquered qin with seven strings and thirteen hui markers. */
  qin() {
    const g = new Group(), lac = std('#1c1614', 0.32)
    g.add(mesh(new BoxGeometry(2.25, 0.1, 0.44), lac, 0, 0.24))
    ;[-0.8, 0.8].forEach((x) => g.add(mesh(new BoxGeometry(0.12, 0.18, 0.36), std('#3b2116', 0.6), x, 0.09)))
    for (let i = 0; i < 7; i++) g.add(mesh(new BoxGeometry(2.05, 0.008, 0.008), std('#d8cfb8', 0.5), 0, 0.3, -0.15 + i * 0.05))
    ;[1 / 8, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 2 / 5, 1 / 2, 3 / 5, 2 / 3, 3 / 4, 4 / 5, 5 / 6, 7 / 8].forEach((f) =>
      g.add(mesh(new SphereGeometry(0.018, 8, 6), std('#f3f0ea', 0.3), 1.0 - f * 2, 0.29, 0.2)))
    g.rotation.y = -0.08
    return g
  },
  /** 太湖石: a scholar's rock, eroded lumps with two loops for holes, on a carved stand. */
  rock() {
    const g = new Group(), m = std('#ffffff', 0.9, { vertexColors: true })
    ;[[0, 0.42, 0.36], [0.1, 0.33, 0.85], [-0.08, 0.28, 1.28], [0.06, 0.2, 1.62]].forEach(([x, r, y], k) => {
      const b = mesh(weather(new SphereGeometry(r, 40, 30), k * 3.1 + 1, r * 0.7, r * 0.45), m, x, y)
      b.scale.set(1, 1.3, 0.8)
      b.rotation.y = k
      g.add(b)
    })
    ;[[0.22, 0.07, 0.65, 0.2], [0.17, 0.06, 1.15, -0.18]].forEach(([R, t, y, x], k) => {
      const l = mesh(weather(new TorusGeometry(R, t, 14, 36), k + 7, t * 0.9, t * 0.5), m, x, y)
      l.rotation.set(0.2, k + 0.5, 0.3)
      g.add(l)
    })
    g.add(mesh(new CylinderGeometry(0.62, 0.68, 0.14, 6), std('#3b2116', 0.5), 0, 0.07))
    return g
  },
  /** 卷轴: two rolled hanging scrolls tied with red cord. */
  scroll() {
    const g = new Group(), paper = std('#e8ddc4', 0.85), rod = std('#2a1a12', 0.5)
    ;[[0, 0.13, 0, 0], [0.05, 0.36, -0.05, 0.18]].forEach(([x, y, z, r], i) => {
      const s = new Group(), len = 1.7 - i * 0.3
      const body = mesh(new CylinderGeometry(0.12, 0.12, len, 24), paper)
      body.rotation.z = Math.PI / 2
      s.add(body)
      ;[-1, 1].forEach((sx) => {
        const end = mesh(new CylinderGeometry(0.14, 0.14, 0.12, 20), rod, sx * (len / 2 + 0.05))
        end.rotation.z = Math.PI / 2
        s.add(end)
      })
      const tie = mesh(new TorusGeometry(0.125, 0.012, 6, 24), std('#8a2d25', 0.6))
      tie.rotation.y = Math.PI / 2
      s.add(tie)
      s.position.set(x, y, z)
      s.rotation.y = r
      g.add(s)
    })
    return g
  },
  /** Blue-and-white dish standing on a little stand. */
  plate() {
    const g = new Group(), tilt = -0.18, blue = std('#2b4a8a', 0.35), wood = std('#3b2116', 0.5)
    const dish = mesh(new CylinderGeometry(0.55, 0.55, 0.04, 48), std('#f0f1ec', 0.25), 0, 0.68)
    dish.rotation.x = Math.PI / 2 + tilt
    g.add(dish)
    ;[0.46, 0.3].forEach((r) => {
      const t = mesh(new TorusGeometry(r, 0.016, 6, 48), blue, 0, 0.68, 0.025)
      t.rotation.x = tilt
      g.add(t)
    })
    const c = mesh(new CircleGeometry(0.12, 24), blue, 0, 0.68, 0.03)
    c.rotation.x = tilt
    g.add(c, mesh(new BoxGeometry(0.5, 0.08, 0.24), wood, 0, 0.12))
    ;[-0.15, 0.15].forEach((x) => {
      const leg = mesh(new BoxGeometry(0.04, 0.42, 0.04), wood, x, 0.3, -0.06)
      leg.rotation.x = tilt
      g.add(leg)
    })
    return g
  },
  /** 葫芦: a dried gourd with a red cord at its waist. */
  gourd() {
    const g = new Group()
    g.add(lathe([[0, 0], [0.16, 0], [0.36, 0.18], [0.42, 0.42], [0.36, 0.66], [0.18, 0.82], [0.16, 0.9], [0.26, 1.06], [0.28, 1.22], [0.2, 1.38], [0.07, 1.46], [0, 1.48]], std('#b8894b', 0.45)))
    g.add(mesh(new CylinderGeometry(0.025, 0.035, 0.18, 8), std('#5a3b22', 0.7), 0, 1.55))
    const cord = mesh(new TorusGeometry(0.19, 0.018, 6, 24), std('#8a2d25', 0.6), 0, 0.87)
    cord.rotation.x = Math.PI / 2
    g.add(cord)
    g.position.y = 0.02
    return g
  },
}

export function makeItem(key: ItemKey) {
  const g = FACTORIES[key]()
  g.traverse((o) => {
    if ((o as Mesh).isMesh) o.castShadow = o.receiveShadow = true
  })
  return g
}

/** The rosewood cabinet: dividers merged from the cell edges, a frame, crown, base and back panel. */
export function makeCabinet() {
  const { W, H, T, DEP } = SHELF
  const ox = -W / 2, oy = -H / 2
  const wood = std('#2a160d', 0.38), back = std('#3a2316', 0.75)
  const g = new Group()
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, m = wood) => {
    const b = mesh(new BoxGeometry(w, h, d), m, x, y, z)
    b.castShadow = b.receiveShadow = true
    g.add(b)
  }
  // collect cell edges per line, then merge them so no two boards overlap
  const hz: Record<string, [number, number][]> = {}, vt: Record<string, [number, number][]> = {}
  const add = (m: typeof hz, k: number, a: number, b: number) => (m[k] ??= []).push([a, b])
  for (const c of CELLS) {
    add(hz, c.y, c.x, c.x + c.w); add(hz, c.y + c.h, c.x, c.x + c.w)
    add(vt, c.x, c.y, c.y + c.h); add(vt, c.x + c.w, c.y, c.y + c.h)
  }
  const merge = (a: [number, number][]) => {
    a.sort((p, q) => p[0] - q[0])
    const out: [number, number][] = []
    for (const s of a) {
      const last = out[out.length - 1]
      if (last && s[0] <= last[1] + 1e-6) last[1] = Math.max(last[1], s[1])
      else out.push([...s])
    }
    return out
  }
  for (const k in hz) {
    const y = +k
    if (y === 0 || y === H) continue
    for (const [a, b] of merge(hz[k])) box(b - a - T, T, DEP, ox + (a + b) / 2, oy + y, 0)
  }
  for (const k in vt) {
    const x = +k
    if (x === 0 || x === W) continue
    for (const [a, b] of merge(vt[k])) box(T, b - a + T, DEP, ox + x, oy + (a + b) / 2, 0)
  }
  const F = 0.26
  box(W + F * 2, F, DEP + 0.06, 0, oy - F / 2, 0)
  box(W + F * 2, F, DEP + 0.06, 0, -oy + F / 2, 0)
  box(F, H, DEP + 0.06, ox - F / 2, 0, 0)
  box(F, H, DEP + 0.06, -ox + F / 2, 0, 0)
  box(W + 1, 0.2, DEP + 0.3, 0, -oy + F + 0.1, 0) // crown
  box(W + 0.7, 0.22, DEP + 0.2, 0, oy - F - 0.11, 0) // base
  ;[-1, 1].forEach((sx) => box(0.32, 0.32, DEP + 0.1, sx * (W / 2 + 0.05), oy - F - 0.38, 0)) // feet
  box(W, H, 0.05, 0, 0, -DEP / 2 + 0.02, back)
  return g
}

/** Where the cabinet's feet touch the floor. */
export const FLOOR_Y = -SHELF.H / 2 - 0.26 - 0.38 - 0.16 // frame, foot offset, half foot height
