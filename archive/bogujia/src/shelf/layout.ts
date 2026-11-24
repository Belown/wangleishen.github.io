import type { Time } from '../store'
import type { ItemKey } from './items'

/** Cabinet size in world units, board thickness and depth. */
export const SHELF = { W: 8, H: 5.2, T: 0.13, DEP: 1 }

/**
 * Compartments, measured from the cabinet's bottom-left corner. Cells with a route are
 * sections of the site; the rest hold decoration (清玩) and are not clickable.
 * Replace any object with your own model at src/assets/shelf/<item>.glb.
 */
export type Cell = { x: number; y: number; w: number; h: number; item: ItemKey; route?: string; label?: [string, string] }

export const CELLS: Cell[] = [
  { x: 0, y: 0, w: 2.2, h: 1.6, item: 'books', route: '/research', label: ['研究', 'Research'] },
  { x: 0, y: 1.6, w: 2.2, h: 2, item: 'ding', route: '/experiments', label: ['实验', 'Experiments'] },
  { x: 0, y: 3.6, w: 2.2, h: 1.6, item: 'seal', route: '/about', label: ['关于', 'About'] },
  { x: 2.2, y: 0, w: 1.6, h: 2.6, item: 'vase', route: '/design', label: ['设计', 'Design'] },
  { x: 2.2, y: 2.6, w: 1.6, h: 2.6, item: 'bowl' },
  { x: 3.8, y: 0, w: 2.6, h: 1.2, item: 'qin', route: '/music', label: ['音乐', 'Music'] },
  { x: 3.8, y: 1.2, w: 2.6, h: 2.4, item: 'rock', route: '/art', label: ['艺术', 'Art'] },
  { x: 3.8, y: 3.6, w: 2.6, h: 1.6, item: 'scroll', route: '/journal', label: ['札记', 'Journal'] },
  { x: 6.4, y: 0, w: 1.6, h: 1.8, item: 'plate' },
  { x: 6.4, y: 1.8, w: 1.6, h: 3.4, item: 'gourd' },
]

/** World position helpers for a cell. */
export const cellCenter = (c: Cell): [number, number] => [-SHELF.W / 2 + c.x + c.w / 2, -SHELF.H / 2 + c.y + c.h / 2]
export const cellFloor = (c: Cell) => -SHELF.H / 2 + c.y + SHELF.T / 2

type Light = { key: string; keyI: number; keyPos: [number, number, number]; sky: string; ground: string; hemiI: number; lamp: number; exposure: number }

// The room's light through the day. At night a warm lamp in the room lights the shelf.
// Intensities are in three's physical units.
export const LIGHT: Record<Time, Light> = {
  dawn: { key: '#ffd9b8', keyI: 2.6, keyPos: [-7, 5, 10], sky: '#f4ece0', ground: '#8c7b66', hemiI: 1.5, lamp: 0, exposure: 1 },
  noon: { key: '#fff3e2', keyI: 3.0, keyPos: [-6, 8, 10], sky: '#f4efe6', ground: '#8c7b66', hemiI: 1.8, lamp: 0, exposure: 1 },
  dusk: { key: '#ffb784', keyI: 2.2, keyPos: [8, 3, 9], sky: '#c9c3cf', ground: '#6f5d4f', hemiI: 1.1, lamp: 10, exposure: 1.05 },
  night: { key: '#9fb2d0', keyI: 0.5, keyPos: [6, 8, 8], sky: '#3a3f4a', ground: '#120f0c', hemiI: 0.4, lamp: 26, exposure: 1.15 },
}
