import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router'
import { OWNER } from './content'
import Home from './Home'
import { LANGS, useLang } from './i18n'
import { About, NotFound, WorkPage } from './pages'

function Nav() {
  const { lang, setLang, tr } = useLang()
  const { pathname } = useLocation()
  const cur = (p: string) => (pathname === p ? 'page' : undefined)
  return (
    <header className="nav">
      <Link to="/" className="mark" aria-label={tr('首页', 'Home')}>W·S</Link>
      <nav aria-label={tr('主导航', 'Main')}>
        <Link to="/" aria-current={cur('/')}>{tr('首页', 'Home')}</Link>
        <Link to="/#work">{tr('作品', 'Work')}</Link>
        <Link to="/about" aria-current={cur('/about')}>{tr('关于', 'About')}</Link>
        <Link to="/about#cv">CV</Link>
      </nav>
      <div className="lang" role="group" aria-label={tr('语言', 'Language')}>
        {LANGS.map((l) => (
          <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
        ))}
      </div>
    </header>
  )
}

/** Top of page on navigation, or the #anchor when the link has one. */
function Scroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const el = hash && document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Footer() {
  const { tr } = useLang()
  return (
    <footer className="foot">
      <b>{OWNER.name}{OWNER.nameZh && ` ${OWNER.nameZh}`}</b>
      <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>
      <span>© {new Date().getFullYear()} {OWNER.name}. {tr('保留所有权利。', 'All rights reserved.')}</span>
    </footer>
  )
}

export default function App() {
  const { tr } = useLang()
  return (
    <BrowserRouter>
      <Scroll />
      <a className="skip" href="#main">{tr('跳到正文', 'Skip to content')}</a>
      <Nav />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}
