import { TRACKS } from '../content/tracks'
import { toast, useStore } from '../store'
import { asset } from './assets'
import { rng } from './util'

// One global player. A track with a real file in src/assets/audio/ plays that file;
// otherwise a short synthesized sketch stands in so the UI can be tried end to end.
let ac: AudioContext | null = null
let master: GainNode | null = null
let el: HTMLAudioElement | null = null
let raf = 0

const set = (audio: { id: string | null; elapsed: number; length: number }) => useStore.setState({ audio })

export function stopAudio() {
  master?.disconnect()
  master = null
  el?.pause()
  el = null
  cancelAnimationFrame(raf)
  set({ id: null, elapsed: 0, length: 0 })
}

export function toggleAudio(id: string) {
  if (useStore.getState().audio.id === id) return stopAudio()
  stopAudio()
  const tr = TRACKS[id]
  if (!tr) return
  const url = asset(tr.file)
  let now: () => number
  let length = tr.len
  if (url) {
    const a = (el = new Audio(url))
    a.play().catch(() => {
      toast(`Could not play ${tr.file}`)
      stopAudio()
    })
    a.onended = stopAudio
    now = () => a.currentTime
  } else {
    try {
      ac ??= new AudioContext()
      void ac.resume()
    } catch {
      return toast('Audio is unavailable in this browser.')
    }
    const ctx = ac
    master = ctx.createGain()
    master.connect(ctx.destination)
    const t0 = ctx.currentTime + 0.05
    for (const n of melody(tr.seed, tr.len, tr.base, tr.step)) {
      for (const [mul, type, vol] of [[1, 'sine', n.v], [2, 'triangle', n.v * 0.18]] as const) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = type
        o.frequency.value = n.f * mul
        g.gain.setValueAtTime(0, t0 + n.t)
        g.gain.linearRampToValueAtTime(vol, t0 + n.t + 0.012)
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + 1.8)
        o.connect(g).connect(master)
        o.start(t0 + n.t)
        o.stop(t0 + n.t + 1.9)
      }
    }
    now = () => ctx.currentTime - t0
  }
  const loop = () => {
    if (el && el.duration) length = el.duration
    const elapsed = Math.max(0, now())
    if (!el && elapsed >= length) return stopAudio()
    set({ id, elapsed, length })
    raf = requestAnimationFrame(loop)
  }
  loop()
}

/** Pentatonic random walk with a slow bass line. */
function melody(seed: number, len: number, base: number, step: number) {
  const r = rng(seed)
  const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21]
  const out: { t: number; f: number; v: number }[] = []
  let d = 4
  for (let t = 0, i = 0; t < len - 1.6; i++) {
    d = Math.max(0, Math.min(scale.length - 1, d + Math.round((r() - 0.5) * 4)))
    out.push({ t, f: base * 2 * 2 ** (scale[d] / 12), v: 0.12 })
    if (i % 4 === 0) out.push({ t, f: (base / 2) * 2 ** ([0, 5, 7, 3][(i / 4) % 4 | 0] / 12), v: 0.09 })
    t += step * (r() < 0.18 ? 2 : 1)
  }
  return out
}
