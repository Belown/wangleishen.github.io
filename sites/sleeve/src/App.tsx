import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router'
import { OWNER, SECTIONS, SECTION_KEYS, workBySlug, type SectionKey, type T } from './content'
import { useLang } from './i18n'
import { About, Home, NotFound, Section, WorkPage } from './pages'
import { CATALOGUE, GroundProvider, LangSwitch, PlayedMark, TRACKS, TrackLink, useGround, type Ground } from './record'

/** Which ground a path sits on, and what its tab is called. */
function routeInfo(path: string): { ground: Ground; title: T | null } {
  const seg = path.split('/').filter(Boolean)
  if (seg.length === 0) return { ground: 'home', title: null }
  if (seg.length === 1 && (SECTION_KEYS as string[]).includes(seg[0])) {
    const k = seg[0] as SectionKey
    return { ground: k, title: SECTIONS[k].name }
  }
  if (seg.length === 1 && seg[0] === 'about') return { ground: 'about', title: { zh: '关于这张唱片', en: 'About this record' } }
  const w = seg[0] === 'work' && seg.length === 2 ? workBySlug(seg[1]) : undefined
  if (w) return { ground: w.sec[0], title: w.title }
  return { ground: 'home', title: { zh: '这面没有录音', en: 'Nothing recorded on this side' } }
}

function Chrome() {
  const { pri, tr } = useLang()
  const { played } = useGround()
  return (
    <header className="chrome">
      <Link to="/" className="chrome-logo" aria-label={tr('林雅 · 回到封面', 'Ada Lin · back to the cover')}>
        <span className="logo-zh">{OWNER.name.zh}</span>
        <span className="logo-en" lang="en">{OWNER.name.en.toLowerCase()}</span>
      </Link>
      <nav className="chrome-nav" aria-label={tr('曲目', 'Tracklist')}>
        <ol>
          {TRACKS.map((t) => (
            <li key={t.k}>
              <TrackLink k={t.k} className="chip">
                <span className="chip-n">{t.n}</span>{pri(t.name)}{played.has(t.k) && <PlayedMark />}
              </TrackLink>
            </li>
          ))}
        </ol>
      </nav>
      <LangSwitch />
    </header>
  )
}

function Sleeve() {
  const { pathname } = useLocation()
  const { t, tr } = useLang()
  const { ground, title } = routeInfo(pathname)
  const home = pathname === '/'

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    const name = `${OWNER.name.zh} · ${OWNER.name.en}`
    document.title = title ? `${t(title)} — ${name}` : name
  }, [title, t])

  return (
    <GroundProvider base={ground} path={pathname}>
      <a className="skip" href="#main">{tr('跳到正文', 'Skip to content')}</a>
      <div className="sleeve">
        {!home && <Chrome />}
        <Routes>
          <Route path="/" element={<Home />} />
          {SECTION_KEYS.map((k) => <Route key={k} path={`/${k}`} element={<Section k={k} />} />)}
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!home && (
          <footer className="foot">
            <span>{CATALOGUE.no} · STEREO · {CATALOGUE.years}</span>
            <span>© {new Date().getFullYear()} {OWNER.name.zh} · {OWNER.name.en}</span>
          </footer>
        )}
      </div>
    </GroundProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Sleeve />
    </BrowserRouter>
  )
}
