import { useEffect } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router'
import { ABOUT_NAME, OWNER, SECTIONS, SECTION_KEYS, workBySlug, type SectionKey } from './content'
import Home from './Home'
import { Bi, LANGS, useLang } from './i18n'
import { Badge, Both } from './metro'
import { About, NotFound, SectionPage, WorkPage } from './pages'

/** The section the current page belongs to: the section itself, or a work's home line. */
function currentLine(path: string): SectionKey | undefined {
  const [, a, b] = path.split('/')
  if (a === 'work') return workBySlug(b)?.sec[0]
  return SECTION_KEYS.find((k) => k === a)
}

function Bar() {
  const { lang, setLang, tr } = useLang()
  const { pathname } = useLocation()
  const cur = currentLine(pathname)
  return (
    <header className="bar">
      <Link to="/" className="bar-owner" aria-label={tr('首页：作品线网图', 'Home: works network map')}>
        <Both text={OWNER.name} className="inline" />
      </Link>
      <nav className="bar-nav" aria-label={tr('线路', 'Lines')}>
        <ul>
          {SECTION_KEYS.map((k) => (
            <li key={k}>
              <Link
                to={`/${k}`}
                className={`bar-line ${cur === k ? 'cur' : ''}`}
                aria-current={pathname === `/${k}` ? 'page' : cur === k ? 'true' : undefined}
              >
                <Badge k={k} />
                <Bi text={SECTIONS[k].name} className="stack" />
              </Link>
            </li>
          ))}
          <li>
            <NavLink to="/about" className="bar-line bar-about">
              <Bi text={ABOUT_NAME} className="stack" />
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="lang" role="group" aria-label={tr('语言', 'Language')}>
        {LANGS.map((l) => (
          <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
    </header>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]) // braces: scrollTo returns a Promise in recent Chrome, which must not become the cleanup
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <a className="skip" href="#main">
        <Bi text={{ zh: '跳到正文', en: 'Skip to content' }} />
      </a>
      <Bar />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {SECTION_KEYS.map((k) => (
            <Route key={k} path={`/${k}`} element={<SectionPage k={k} />} />
          ))}
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
