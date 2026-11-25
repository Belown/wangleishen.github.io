import { useEffect } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router'
import { ABOUT_NAME, OWNER, SECTIONS, SECTION_KEYS, workBySlug } from './content'
import { About } from './pages/about'
import { Card } from './pages/card'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Photos } from './pages/photos'
import { Random } from './pages/random'
import { RecordPage, Records } from './pages/records'
import { SectionPage } from './pages/section'
import { WorkPage } from './pages/work'

function Owner() {
  return (
    <Link to="/" className="owner" aria-label={'Home'}>
      {OWNER.name.toLowerCase()}<span className="owner-dot" aria-hidden="true" />
    </Link>
  )
}

/** The quiet row of sections, always on screen. A work page marks its home section. */
function Rail() {
  const { pathname } = useLocation()
  const [, a, b] = pathname.split('/')
  const cur = a === 'work' ? workBySlug(b)?.sec[0] : a
  return (
    <div className="rail">
      <div className="rail-in">
        <span className="wide-only"><Owner /></span>
        <nav className="sections" aria-label={'Sections'}>
          <ul>
            {SECTION_KEYS.map((k) => (
              <li key={k}>
                <NavLink to={`/${k}`} className={cur === k ? 'on' : undefined}>
                  {SECTIONS[k].name}
                </NavLink>
              </li>
            ))}
            <li><NavLink to="/photos">Photos</NavLink></li>
            <li><NavLink to="/records">Records</NavLink></li>
            <li><NavLink to="/random">Random</NavLink></li>
            <li>
              <NavLink to="/about">{ABOUT_NAME}</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]) // braces: scrollTo may return a Promise, which must not become the cleanup
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <a className="skip" href="#main">{'Skip to content'}</a>
      <div className="light" aria-hidden="true" />
      <header className="mast narrow-only">
        <Owner />
      </header>
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {SECTION_KEYS.map((k) => (
            <Route key={k} path={`/${k}`} element={<SectionPage k={k} />} />
          ))}
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/:id" element={<RecordPage />} />
          <Route path="/random" element={<Random />} />
          <Route path="/about" element={<About />} />
          <Route path="/card" element={<Card />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Rail />
    </BrowserRouter>
  )
}
