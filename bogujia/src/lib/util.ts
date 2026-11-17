import { toast } from '../store'

/** Small seeded PRNG (mulberry32) so waveforms and melodies are stable per track. */
export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export const fdate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function copyText(text: string, label: string) {
  const blocked = () => toast('Copy was blocked. Select the text instead.')
  try {
    navigator.clipboard.writeText(text).then(() => toast(`${label} copied`), blocked)
  } catch {
    blocked()
  }
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
