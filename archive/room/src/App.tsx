import { useEffect, useRef } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router'
import { OWNER, workBySlug } from './content'
import { Bi, LANGS, useLang } from './i18n'
import { Icon } from './icons'
import { getVisits, TABS } from './lib'
import { About, Guestbook, Home, NotFound, SectionPage, WorkPage } from './pages'

function Shell() {
  const { pathname } = useLocation()
  const { lang, setLang, t, tr } = useLang()
  const activeRef = useRef<HTMLAnchorElement>(null)

  // a work lights up its home section's tab
  const path = pathname.replace(/\/+$/, '') || '/'
  const active = path.startsWith('/work/') ? `/${workBySlug(path.split('/')[2])?.sec[0] ?? ''}` : path

  useEffect(() => { getVisits() }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [pathname])

  return (
    <div className="site">
      <a className="skip" href="#main">{tr('跳到内容', 'Skip to content')}</a>
      <header className="site-head">
        <Link to="/" className="site-name">
          <Icon name="house" size={26} />
          <span>{t({ zh: `${OWNER.name.zh}的小屋`, en: `${OWNER.name.en}'s little room` })}</span>
        </Link>
      </header>

      <div className="tabbar">
        <nav className="tabs" aria-label={tr('栏目', 'Sections')}>
          <ul>
            {TABS.map((tb) => {
              const on = tb.to === active
              return (
                <li key={tb.to}>
                  <Link to={tb.to} ref={on ? activeRef : undefined} className={'tab' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined}>
                    <Bi text={tb.label} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="langs" role="group" aria-label={tr('语言', 'Language')}>
          {LANGS.map((l) => (
            <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
          ))}
        </div>
      </div>

      <main id="main" className="window" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<SectionPage k="research" />} />
          <Route path="/design" element={<SectionPage k="design" />} />
          <Route path="/art" element={<SectionPage k="art" />} />
          <Route path="/writing" element={<SectionPage k="writing" />} />
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-foot">
        <p>
          {t({ zh: `${OWNER.name.zh}的小屋`, en: `${OWNER.name.en}'s little room` })} · <span className="num">{new Date().getFullYear()}</span> ·{' '}
          {tr('留言、评论和访客数都只存在你自己的浏览器里。', 'Notes, comments and the visitor count live only in your own browser.')}
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
