import type { Time } from '../store'

/** Every object in the garden. Objects with a route are clickable and get a label. */
export type GardenObject = {
  route?: string
  label?: string
  kind: 'stone' | 'lantern' | 'basin'
  x: number
  z: number
  r: number
  moss?: boolean
  labelY?: number
}

export const OBJECTS: GardenObject[] = [
  { route: '/research', label: 'research/', kind: 'stone', x: -11, z: -3, r: 2.3, moss: true },
  { route: '/design', label: 'design/', kind: 'stone', x: -2.5, z: -6.8, r: 1.6 },
  { route: '/art', label: 'art/', kind: 'stone', x: 7, z: -2.6, r: 2, moss: true },
  { route: '/music', label: 'music/', kind: 'stone', x: 13, z: -7.2, r: 1.25 },
  { route: '/experiments', label: 'experiments/', kind: 'stone', x: -6.5, z: 5.2, r: 1.4 },
  { kind: 'stone', x: -8.3, z: -0.7, r: 0.8 },
  { kind: 'stone', x: 9, z: -0.2, r: 0.7 },
  { route: '/journal', label: 'journal', kind: 'lantern', x: 16.5, z: 1.8, r: 1.3, labelY: 4.6 },
  { route: '/about', label: 'about', kind: 'basin', x: 3.5, z: 6.6, r: 1.2, labelY: 1.9 },
]

type V3 = [number, number, number]
/**
 * Camera framing: look at `center` from direction `dir` (unit vector), at least `base` units away,
 * and far enough that ±`halfW` around the center fits the part of the screen the sheet leaves free.
 */
export type Frame = { center: V3; dir: V3; base: number; halfW: number }

const unit = (x: number, y: number, z: number): V3 => {
  const l = Math.hypot(x, y, z)
  return [x / l, y / l, z / l]
}

// Bounds of everything in the garden, so overviews are centred on the content, not on x = 0.
const minX = Math.min(...OBJECTS.map((o) => o.x - o.r)), maxX = Math.max(...OBJECTS.map((o) => o.x + o.r))
const minZ = Math.min(...OBJECTS.map((o) => o.z - o.r)), maxZ = Math.max(...OBJECTS.map((o) => o.z + o.r))
const CX = (minX + maxX) / 2, CZ = (minZ + maxZ) / 2, HALF_W = (maxX - minX) / 2 + 2.5

export const VIEWS: Record<'home' | 'works' | 'lost', Frame> = {
  home: { center: [CX, 0, CZ], dir: unit(0, 23, 24), base: 33, halfW: HALF_W },
  works: { center: [CX, 0, CZ], dir: unit(0, 30, 16), base: 34, halfW: HALF_W }, // ~60° overview, not straight down
  lost: { center: [0, 1.2, -4], dir: unit(0, 4.3, 25), base: 25.4, halfW: 6 },
}

/** Framing for a focus key: a garden object's route, or one of VIEWS. */
export function frameFor(focus: string): Frame {
  const o = OBJECTS.find((x) => x.route === focus)
  if (!o) return VIEWS[focus as keyof typeof VIEWS] ?? VIEWS.home
  const off: V3 = [1, 9 + o.r * 2, 11 + o.r * 2]
  return { center: [o.x, o.kind === 'lantern' ? 2 : 0, o.z], dir: unit(...off), base: Math.hypot(...off), halfW: o.r * 3.5 }
}

type Light = { bg: string; sun: string; sunI: number; sunPos: [number, number, number]; sky: string; ground: string; hemiI: number; lamp: number; exposure: number }

// Intensities are in three's physical units (roughly π × the old "legacy" values).
export const LIGHT: Record<Time, Light> = {
  dawn: { bg: '#dcd5cf', sun: '#ffcfae', sunI: 3.0, sunPos: [-24, 7, -6], sky: '#cbd3e4', ground: '#b9a78e', hemiI: 1.5, lamp: 8, exposure: 1 },
  noon: { bg: '#e4e2dc', sun: '#fff6ea', sunI: 3.6, sunPos: [-16, 26, -8], sky: '#d8dde6', ground: '#b8ad98', hemiI: 1.4, lamp: 0, exposure: 0.85 },
  dusk: { bg: '#a59c98', sun: '#ffb47e', sunI: 2.6, sunPos: [24, 6, 6], sky: '#9ba2c4', ground: '#8a7d6c', hemiI: 1.25, lamp: 22, exposure: 1.05 },
  night: { bg: '#171b22', sun: '#9fb6dc', sunI: 1.5, sunPos: [12, 20, -12], sky: '#2b3548', ground: '#0f1012', hemiI: 0.85, lamp: 40, exposure: 1.15 },
}
