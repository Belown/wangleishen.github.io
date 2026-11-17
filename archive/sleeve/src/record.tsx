import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { asset } from './assets'
import { ABOUT_NAME, OWNER, SECTIONS, WORKS, worksIn, type SectionKey, type T, type Work } from './content'
import { LANGS, useLang } from './i18n'

/* The record: tracks, grounds, and the pieces every page shares. */

export type TrackKey = SectionKey | 'about'
export type Ground = TrackKey | 'home'

export const TRACKS: { n: string; k: TrackKey; name: T; path: string }[] = [
  { n: 'A1', k: 'research', name: SECTIONS.research.name, path: '/research' },
  { n: 'A2', k: 'design', name: SECTIONS.design.name, path: '/design' },
  { n: 'A3', k: 'art', name: SECTIONS.art.name, path: '/art' },
  { n: 'B1', k: 'writing', name: SECTIONS.writing.name, path: '/writing' },
  { n: 'B2', k: 'about', name: ABOUT_NAME, path: '/about' },
]
export const trackOf = (k: TrackKey) => TRACKS.find((t) => t.k === k)!

const years = WORKS.map((w) => w.year)
export const CATALOGUE = { no: 'LY-001', years: `${Math.min(...years)} — ${Math.max(...years)}` }

/** A section's works as a single: newest first, split into side A and side B. */
export function singleOf(k: SectionKey) {
  const list = [...worksIn(k)].sort((a, b) => (b.date ?? String(b.year)).localeCompare(a.date ?? String(a.year)))
  const half = Math.ceil(list.length / 2)
  return list.map((w, i) => ({ w, n: i < half ? `A${i + 1}` : `B${i - half + 1}`, sideB: i === half }))
}

/** The other section a cross-field work belongs to, seen from section k. */
export const featOf = (w: Work, k: SectionKey) => w.sec.find((s) => s !== k)

/* ---------- ground ---------- */

const PLAYED_KEY = 'sleeve-played'
function loadPlayed(): Set<TrackKey> {
  try { return new Set(JSON.parse(localStorage.getItem(PLAYED_KEY) ?? '[]')) } catch { return new Set() }
}

const GroundCtx = createContext<{ hot: Ground | null; hover: (k: Ground | null) => void; played: ReadonlySet<TrackKey>; base: Ground }>({
  hot: null, hover: () => {}, played: new Set(), base: 'home',
})
export const useGround = () => useContext(GroundCtx)

/** Owns the ground colour: the current page's, or a hovered track's while it is hovered. */
export function GroundProvider({ base, path, children }: { base: Ground; path: string; children: ReactNode }) {
  const [pv, setPv] = useState<{ at: string; k: Ground } | null>(null)
  const [played, setPlayed] = useState(loadPlayed)
  const hot = pv?.at === path ? pv.k : null

  useLayoutEffect(() => { document.documentElement.dataset.ground = hot ?? base }, [hot, base])
  useEffect(() => {
    // first paint lands on the right colour; cross-fades start after it
    const id = requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.removeAttribute('data-still')))
    return () => cancelAnimationFrame(id)
  }, [])
  useEffect(() => {
    if (base === 'home' || played.has(base)) return
    const next = new Set(played).add(base)
    setPlayed(next)
    try { localStorage.setItem(PLAYED_KEY, JSON.stringify([...next])) } catch { /* storage blocked */ }
  }, [base, played])

  const hover = (k: Ground | null) => setPv(k ? { at: path, k } : null)
  return <GroundCtx.Provider value={{ hot, hover, played, base }}>{children}</GroundCtx.Provider>
}

/** A link to a track. Hovering or focusing it floods the page with that track's colour. */
export function TrackLink({ k, className, children }: { k: TrackKey; className?: string; children: ReactNode }) {
  const { hover, played, base } = useGround()
  const on = () => hover(k)
  const off = () => hover(null)
  const { pathname } = useLocation()
  const t = trackOf(k)
  return (
    <Link
      to={t.path}
      className={className}
      data-played={played.has(k) && base !== k ? '' : undefined}
      aria-current={base === k ? (pathname === t.path ? 'page' : 'true') : undefined}
      onPointerEnter={on}
      onPointerLeave={off}
      onFocus={on}
      onBlur={off}
    >
      {children}
    </Link>
  )
}

/* ---------- shared pieces ---------- */

export function LangSwitch() {
  const { lang, setLang, tr } = useLang()
  return (
    <div className="lang" role="group" aria-label={tr('语言', 'Language')}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
      ))}
    </div>
  )
}

/** Dots on a grid, sized by field(x, y) in 0…1 over a 100×100 square. */
function Halftone({ n, field }: { n: number; field: (x: number, y: number) => number }) {
  const dots = useMemo(() => {
    const s = 100 / n
    const out: ReactNode[] = []
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = (i + 0.5) * s, y = (j + 0.5) * s
      const r = Math.min(s * 0.49, (s / 2) * Math.sqrt(Math.max(0, field(x, y))) * 1.12)
      if (r > 0.15) out.push(<circle key={i * n + j} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r.toFixed(2)} />)
    }
    return out
  }, [n, field])
  return <svg className="halftone" viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor">{dots}</g></svg>
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const oval = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => 1 - ((x - cx) / rx) ** 2 - ((y - cy) / ry) ** 2

/** Head and shoulders, lit from the upper left. */
function bust(x: number, y: number) {
  const neck = Math.abs(x - 50) < 7.5 && y > 50 && y < 76 ? 0.3 : -1
  const m = clamp01(Math.max(oval(x, y, 50, 39, 15, 18.5), oval(x, y, 50, 108, 41, 38), neck) * 4)
  const light = 1 - clamp01((x - 28) / 70) * 0.4
  return 0.06 + m * 0.74 * light
}

export function Portrait({ className = '' }: { className?: string }) {
  const { t, tr } = useLang()
  const url = asset(OWNER.portrait)
  if (url) return <img className={`portrait ${className}`} src={url} alt={t(OWNER.name)} />
  return (
    <div className={`portrait portrait-ph ${className}`} role="img" aria-label={tr('照片占位：src/assets/', 'Portrait placeholder: src/assets/') + OWNER.portrait}>
      <Halftone n={30} field={bust} />
      <span className="portrait-label">
        <span>{tr('这里放你的照片', 'Your portrait goes here')}</span>
        <code>src/assets/{OWNER.portrait}</code>
      </span>
    </div>
  )
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** A work's square cover crop: works/<slug>/cover.jpg, or a halftone disc until it exists. */
export function Cover({ slug }: { slug: string }) {
  const file = `works/${slug}/cover.jpg`
  const url = asset(file)
  const field = useMemo(() => {
    const h = hash(slug), cx = 30 + (h % 40), cy = 30 + ((h >> 5) % 40)
    return (x: number, y: number) => {
      const d = Math.hypot(x - cx, y - cy)
      return d < 34 ? 0.82 - (d / 34) * 0.35 : 0.05
    }
  }, [slug])
  if (url) return <img className="cover" src={url} alt="" loading="lazy" />
  return <span className="cover cover-ph" title={`src/assets/${file}`}><Halftone n={11} field={field} /></span>
}

/* ---------- icons ---------- */

export function PlayedMark() {
  const { tr } = useLang()
  return (
    <>
      <svg className="icon played" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      <span className="sr-only">{tr('（已听过）', ' (played)')}</span>
    </>
  )
}

export function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true" style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CopyIcon() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/** An unpressed side: grooves and a blank label. */
export function Disc() {
  return (
    <svg className="disc" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="var(--ink)" />
      {[88, 78, 68, 58].map((r) => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="var(--g)" strokeOpacity=".35" strokeWidth="1" />)}
      <circle cx="100" cy="100" r="34" fill="var(--g)" />
      <circle cx="100" cy="100" r="4" fill="var(--ink)" />
    </svg>
  )
}
