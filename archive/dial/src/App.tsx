import { useEffect, useRef } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useSearchParams } from 'react-router'
import { ABOUT_NAME, OWNER, SECTIONS, SECTION_KEYS, workBySlug, worksIn, type SectionKey, type T } from './content'
import { LANGS, useLang } from './i18n'
import { About, Home, NotFound, SectionPage, WorkPage } from './pages'

export type MarkKey = SectionKey | 'about'
export const MARKS: { k: MarkKey; name: T; to: string }[] = [
  ...SECTION_KEYS.map((k) => ({ k, name: SECTIONS[k].name, to: `/${k}` })),
  { k: 'about' as const, name: ABOUT_NAME, to: '/about' },
]

const BASE_TITLE = '林雅 · Ada Lin'
export function useTitle(s?: string) {
  useEffect(() => {
    document.title = s ? `${s} · ${BASE_TITLE}` : BASE_TITLE
  }, [s])
}

/** The section a work is being read in: ?in=<section> when it belongs there, else its home section. */
export function useContextSection(slug?: string): SectionKey | undefined {
  const [params] = useSearchParams()
  const w = workBySlug(slug)
  if (!w) return undefined
  const via = params.get('in') as SectionKey | null
  return via && w.sec.includes(via) ? via : w.sec[0]
}

/** Primary language text, with the other set as a quieter second line in bilingual mode. */
export function Two({ text, className }: { text: T; className?: string }) {
  const { pri, sec } = useLang()
  const s = sec(text)
  return (
    <span className={className}>
      <span className="two-pri">{pri(text)}</span>
      {s && <span className="two-sec" lang="en">{s}</span>}
    </span>
  )
}

/** An applied marker: a polished bar with an inlay that takes the lume colour when current. */
export function Marker({ k, name, to, current, ariaCurrent, count, onHover }: {
  k: MarkKey; name: T; to: string; current: boolean; ariaCurrent?: 'page' | 'true'; count?: number
  onHover?: (k: MarkKey | null) => void
}) {
  const { tr } = useLang()
  return (
    <Link
      to={to}
      className={`mark${current ? ' is-current' : ''}`}
      aria-current={ariaCurrent}
      onPointerEnter={() => onHover?.(k)}
      onPointerLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(k)}
      onBlur={() => onHover?.(null)}
    >
      <span className="mark-bar" aria-hidden="true" />
      <Two text={name} className="mark-name" />
      {count !== undefined && (
        <span className="mark-count">
          {count}
          <span className="sr-only"> {tr('件作品', 'works')}</span>
        </span>
      )}
    </Link>
  )
}

export function LangSwitch() {
  const { lang, setLang, tr } = useLang()
  return (
    <div className="lang" role="group" aria-label={tr('语言', 'Language')}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>
          {l.label}
        </button>
      ))}
    </div>
  )
}

function currentMark(path: string, ctx?: SectionKey): MarkKey | undefined {
  const [, a] = path.split('/')
  if (a === 'work') return ctx
  if (a === 'about') return 'about'
  return SECTION_KEYS.find((k) => k === a)
}

function Bar() {
  const { pathname } = useLocation()
  const { pri, tr } = useLang()
  const ctx = useContextSection(pathname.startsWith('/work/') ? pathname.split('/')[2] : undefined)
  const cur = currentMark(pathname, ctx)
  return (
    <header className="bar">
      <Link to="/" className="bar-home" aria-label={tr('首页', 'Home')}>
        <span className="bar-name">{pri(OWNER.name)}</span>
        <span className="bar-latin" aria-hidden="true">{OWNER.name.en}</span>
      </Link>
      <nav className="marks marks-bar" aria-label={tr('栏目', 'Sections')}>
        {MARKS.map((m) => (
          <Marker key={m.k} {...m} current={cur === m.k} ariaCurrent={pathname === m.to ? 'page' : cur === m.k ? 'true' : undefined} />
        ))}
      </nav>
      <LangSwitch />
    </header>
  )
}

export function Footer() {
  const { tr } = useLang()
  return (
    <footer className="foot">
      <span className="rule-ticks" aria-hidden="true" />
      <p>{tr('示例内容：林雅是占位人物，这里的作品、日期与发表信息都是示意，不是真实经历。', 'Placeholder content: Ada Lin is a stand-in persona; every work, date and venue here is illustrative, not a real record.')}</p>
    </footer>
  )
}

/** The dial ground. Pointer and scroll turn the brushing's highlight a few degrees, like tilting a dial under a lamp. */
function Ground() {
  const sheen = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let px = 0.5, py = 0.5, raf = 0
    const apply = () => {
      raf = 0
      const a = -28 + (px - 0.5) * 16 + (py - 0.5) * 6 + Math.min(window.scrollY, 2400) * 0.004
      sheen.current?.style.setProperty('transform', `translate(-50%, -50%) rotate(${a.toFixed(2)}deg)`)
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply) }
    const move = (e: PointerEvent) => { px = e.clientX / innerWidth; py = e.clientY / innerHeight; queue() }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('scroll', queue, { passive: true })
    return () => { removeEventListener('pointermove', move); removeEventListener('scroll', queue); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="ground" aria-hidden="true">
      <div className="sheen" ref={sheen} />
      <div className="brush" />
    </div>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Shell() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  const { tr } = useLang()
  return (
    <>
      <a className="skip" href="#main">{tr('跳到正文', 'Skip to content')}</a>
      <Ground />
      {!home && <Bar />}
      <div id="main" key={pathname} className="cut">
        <Routes>
          <Route path="/" element={<Home />} />
          {SECTION_KEYS.map((k) => <Route key={k} path={`/${k}`} element={<SectionPage k={k} />} />)}
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!home && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Shell />
    </BrowserRouter>
  )
}

export const countOf = (k: MarkKey) => (k === 'about' ? undefined : worksIn(k).length)
