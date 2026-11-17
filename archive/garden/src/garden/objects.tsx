import type { ThreeEvent } from '@react-three/fiber'
import { useMemo, type RefObject } from 'react'
import { BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, Color, ConeGeometry, CylinderGeometry, IcosahedronGeometry, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, Vector3, type PointLight } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { GardenObject } from './layout'
import { fbm, noise3 } from './noise'
import { PLANE_H, PLANE_W } from './sand'

type Palette = 'stone' | 'moss'

/** Base lightness (sRGB) of the granite every stone object is made of. */
const GRANITE = 0.46
const tmpColor = new Color()

/**
 * Weathered granite, shared by the stones, the basin and the lantern so they read as one material:
 * soft broad mottling, and darker low down where the stone meets the damp gravel.
 * x/y/z are in world units, so the mottling has the same scale on every object.
 */
function granite(x: number, y: number, z: number, worldY: number, seed: number, base = GRANITE, shade = 1) {
  const m = fbm(x * 1.6 + seed, y * 1.6 - seed, z * 1.6, 2)
  const damp = 0.82 + 0.18 * Math.min(1, Math.max(0, worldY / 1.4))
  const t = (base + (m - 0.5) * 0.12) * damp * shade
  tmpColor.setRGB(t * 1.03, t, t * 0.95, SRGBColorSpace)
  return tmpColor
}

/** Adds granite vertex colours to a geometry whose positions are already where they sit in the object. */
function paintGranite<G extends BufferGeometry>(g: G, seed: number): G {
  const p = g.attributes.position
  const colors = new Float32Array(p.count * 3)
  for (let i = 0; i < p.count; i++) {
    const c = granite(p.getX(i), p.getY(i), p.getZ(i), p.getY(i), seed)
    colors.set([c.r, c.g, c.b], i * 3)
  }
  g.setAttribute('color', new BufferAttribute(colors, 3))
  return g
}

/** One material for every granite object; the lantern keeps crisp carved faces. */
const graniteMaterial = (carved: boolean) => new MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: carved })

/**
 * Organic rock: a subdivided sphere pushed out by noise into a few broad lumps, smooth-shaded,
 * coloured as granite. `lift` is how high the object sits, so the damp darkening lines up with the gravel.
 * Moss uses the same shape, flattened, with its own colours.
 */
export function rockGeometry(r: number, seed: number, squash = 0.62, palette: Palette = 'stone', tint = 0, lift = r * 0.2) {
  let g: BufferGeometry = new IcosahedronGeometry(1, 16)
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  g = mergeVertices(g) // shared vertices → smooth normals and no cracks
  const p = g.attributes.position
  const colors = new Float32Array(p.count * 3)
  const v = new Vector3()
  const s = seed * 1.7
  const moss = palette === 'moss'
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const big = fbm(v.x * 1.1 + s, v.y * 1.1 + s * 0.5, v.z * 1.1 - s, 3) // a few broad lumps
    const fine = fbm(v.x * 5 + s, v.y * 5, v.z * 5 - s, 2)
    const k = 1 + (big - 0.5) * (moss ? 0.9 : 0.55) + (fine - 0.5) * (moss ? 0.25 : 0.05)
    // Below the equator, push the surface out to a vertical wall so the stone goes straight into
    // the gravel. A curled-in underside left a lit sliver of sand visible under every stone.
    const wall = !moss && v.y < 0 ? Math.min(3, 1 / (Math.hypot(v.x, v.z) || 1)) : 1
    const x = v.x * wall * k * r, y = v.y * k * r * squash, z = v.z * wall * k * r * 0.86
    p.setXYZ(i, x, y, z)

    if (moss) {
      const m = noise3(v.x * 6 + s, v.y * 6, v.z * 6)
      const dry = Math.max(0, noise3(v.x * 2.5 - s, v.z * 2.5, s) - 0.55) * 1.6 // a few drier, browner patches
      tmpColor.setRGB(0.29 + m * 0.06 + dry * 0.06, 0.34 + m * 0.07 - dry * 0.02, 0.2 + m * 0.03, SRGBColorSpace)
    } else {
      const hollow = Math.min(1, Math.max(0, (k - 0.85) / 0.3)) // 0 in hollows, 1 on bulges
      granite(x, y, z, y + lift, seed, GRANITE + tint * 0.03, 0.88 + 0.12 * hollow)
    }
    colors.set([tmpColor.r, tmpColor.g, tmpColor.b], i * 3)
  }
  g.setAttribute('color', new BufferAttribute(colors, 3))
  g.computeVertexNormals()
  return g
}

/** Soft dark halo under objects: the ambient occlusion where stone meets gravel. */
let aoTexture: CanvasTexture | null = null
function contactTexture() {
  if (aoTexture) return aoTexture
  const S = 128
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const x = cv.getContext('2d')!
  const grd = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  grd.addColorStop(0, 'rgba(0,0,0,1)')
  grd.addColorStop(0.45, 'rgba(0,0,0,.75)')
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = grd
  x.fillRect(0, 0, S, S)
  return (aoTexture = new CanvasTexture(cv))
}

export function ContactShadow({ r, scale = 1.55, opacity = 0.55 }: { r: number; scale?: number; opacity?: number }) {
  const map = useMemo(contactTexture, [])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.03} renderOrder={1}>
      <planeGeometry args={[r * 2 * scale, r * 2 * scale * 0.9]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

export type PickHandlers = {
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
}

export function Stone({ o, i, pick }: { o: GardenObject; i: number; pick: PickHandlers }) {
  const geo = useMemo(() => rockGeometry(o.r, i * 2.7 + 1, 0.62, 'stone', ((i * 37) % 5) / 4 - 0.5), [o.r, i])
  const moss = useMemo(() => (o.moss ? rockGeometry(o.r * 1.38, i + 5, 0.13, 'moss') : null), [o.moss, o.r, i])
  const mat = useMemo(() => graniteMaterial(false), [])
  return (
    <group position={[o.x, 0, o.z]} {...pick}>
      <ContactShadow r={o.moss ? o.r * 1.25 : o.r} />
      <mesh geometry={geo} material={mat} position-y={o.r * 0.2} rotation-y={i * 1.9} castShadow receiveShadow />
      {moss && (
        <mesh geometry={moss} position-y={0.02} receiveShadow>
          <meshStandardMaterial vertexColors roughness={1} />
        </mesh>
      )}
    </group>
  )
}

/** Stone lantern (tōrō): the same granite as the stones, with crisp carved faces. Windows glow at dusk. */
export function Lantern({ o, pick, glow, lamp }: { o: GardenObject; pick: PickHandlers; glow: MeshStandardMaterial; lamp: RefObject<PointLight | null> }) {
  const mat = useMemo(() => graniteMaterial(true), [])
  // extra segments only so the granite colour can vary across each face
  const parts = useMemo(() => [
    new CylinderGeometry(1, 1.2, 0.35, 6, 2).translate(0, 0.17, 0),
    new CylinderGeometry(0.34, 0.4, 1.9, 6, 8).translate(0, 1.3, 0),
    new CylinderGeometry(0.95, 0.8, 0.3, 6, 2).translate(0, 2.38, 0),
    new BoxGeometry(1.05, 0.95, 1.05, 4, 4, 4).translate(0, 3, 0),
    new ConeGeometry(1.4, 0.8, 4, 4).rotateY(Math.PI / 4).translate(0, 3.86, 0),
    new SphereGeometry(0.22, 16, 12).translate(0, 4.38, 0),
  ].map((g) => paintGranite(g, 7)), [])
  return (
    <group position={[o.x, 0, o.z]} {...pick}>
      <ContactShadow r={1.2} />
      {parts.map((g, i) => <mesh key={i} geometry={g} material={mat} castShadow receiveShadow />)}
      <mesh position-y={3} material={glow}><boxGeometry args={[0.52, 0.44, 1.1]} /></mesh>
      <mesh position-y={3} material={glow}><boxGeometry args={[1.1, 0.44, 0.52]} /></mesh>
      <pointLight ref={lamp} position-y={3} intensity={0} distance={16} decay={2} color="#ffb36b" />
    </group>
  )
}

/** Water basin (tsukubai) with a bamboo spout. */
export function Basin({ o, pick }: { o: GardenObject; pick: PickHandlers }) {
  const geo = useMemo(() => rockGeometry(o.r, 9, 0.75, 'stone', 0.5, 0.4), [o.r])
  const mat = useMemo(() => graniteMaterial(false), [])
  return (
    <group position={[o.x, 0, o.z]}>
      <ContactShadow r={o.r} />
      <group {...pick}>
        <mesh geometry={geo} material={mat} position-y={0.4} castShadow receiveShadow />
        <mesh position-y={1.12} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color="#1b2b2e" roughness={0.05} metalness={0.4} />
        </mesh>
      </group>
      <mesh position={[1.15, 1.55, -0.1]} rotation-z={1.25} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.7, 12]} />
        <meshStandardMaterial color="#9a9466" roughness={0.55} />
      </mesh>
      <mesh position={[1.85, 0.9, -0.1]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 1.8, 12]} />
        <meshStandardMaterial color="#9a9466" roughness={0.55} />
      </mesh>
    </group>
  )
}

/** Granite curb around the raked area, and a moss lawn beyond it, so the gravel has an edge. */
export function Border() {
  const curb = useMemo(() => new MeshStandardMaterial({ color: '#6d6961', roughness: 0.9 }), [])
  const w = 0.6, h = 0.32
  return (
    <group>
      {[-1, 1].map((sz) => (
        <mesh key={'z' + sz} material={curb} position={[0, h / 2 - 0.08, (sz * (PLANE_H + w)) / 2]} castShadow receiveShadow>
          <boxGeometry args={[PLANE_W + w * 2, h, w]} />
        </mesh>
      ))}
      {[-1, 1].map((sx) => (
        <mesh key={'x' + sx} material={curb} position={[(sx * (PLANE_W + w)) / 2, h / 2 - 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, PLANE_H]} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.05} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#4c5434" roughness={1} />
      </mesh>
    </group>
  )
}
