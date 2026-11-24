import { useEffect, useRef } from 'react'
import { TRACKS } from '../content/tracks'
import { asset } from '../lib/assets'
import { toggleAudio } from '../lib/audio'
import { fmt, rng } from '../lib/util'
import { useStore } from '../store'

/** Inline player. Exposed to MDX as <Track id="…" />. */
export function Track({ id }: { id: string }) {
  const tr = TRACKS[id]
  const playing = useStore((s) => s.audio.id === id)
  const elapsed = useStore((s) => (s.audio.id === id ? s.audio.elapsed : 0))
  const length = useStore((s) => (s.audio.id === id ? s.audio.length : 0)) || tr?.len || 0
  const time = useStore((s) => s.time)
  const canvas = useRef<HTMLCanvasElement>(null)
  const real = tr && asset(tr.file)

  useEffect(() => {
    const c = canvas.current
    if (!c || !tr) return
    const d = Math.min(2, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight
    if (!w) return
    c.width = w * d
    c.height = h * d
    const x = c.getContext('2d')!
    const r = rng(tr.seed)
    const cs = getComputedStyle(c)
    const ink = cs.getPropertyValue('--ink'), line = cs.getPropertyValue('--line')
    const p = length ? elapsed / length : 0
    x.scale(d, d)
    for (let i = 0; i < w; i += 4) {
      const v = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.05 + r() * 2)) * r()
      x.fillStyle = i / w < p ? ink : line
      x.fillRect(i, h / 2 - (v * h) / 2, 2.2, v * h)
    }
  }, [elapsed, length, tr, time])

  if (!tr) return <p className="muted">Unknown track “{id}”. Add it to src/content/tracks.ts.</p>
  return (
    <div className="ap">
      <button type="button" className="pb" onClick={() => toggleAudio(id)} aria-label={`${playing ? 'Stop' : 'Play'} ${tr.title}`}>{playing ? '■' : '▶'}</button>
      <div className="ap-body">
        <b>{tr.title}</b>
        <div className="meta">{tr.sub} · {real ? tr.file : `AUDIO · src/assets/${tr.file} · placeholder sketch`}</div>
        <canvas ref={canvas} />
      </div>
      <span className="tm">{playing ? `${fmt(elapsed)} / ${fmt(length)}` : fmt(length)}</span>
    </div>
  )
}
