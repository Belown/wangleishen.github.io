import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useOutlet } from 'react-router'
import { Intro, Overlays, Terminal, TopBar } from './components/Chrome'
import { SECTION_KEYS, SITE, type SectionKey } from './content/site'
import { workBySlug } from './content/works'
import Garden from './garden/Garden'
import About from './pages/About'
import { Journal, Post } from './pages/Journal'
import NotFound from './pages/NotFound'
import Section from './pages/Section'
import WorkPage from './pages/WorkPage'
import Works from './pages/Works'
import { useStore } from './store'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={null} />
          <Route path="works" element={<Works />} />
          <Route path="works/:slug" element={<WorkPage />} />
          {SECTION_KEYS.map((k) => <Route key={k} path={k} element={<Section key={k} k={k} />} />)}
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<Post />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

/** Which garden object the camera looks at, and which nav item is current, for a path. */
function routeInfo(pathname: string): { focus: string; group: string | null } {
  const [a, b] = pathname.split('/').filter(Boolean)
  if (!a) return { focus: 'home', group: null }
  if (a === 'works') return b ? { focus: '/' + (workBySlug(b)?.section ?? 'lost'), group: 'works' } : { focus: 'works', group: 'works' }
  if (SECTION_KEYS.includes(a as SectionKey)) return { focus: '/' + a, group: 'works' }
  if (a === 'journal' || a === 'about') return { focus: '/' + a, group: a }
  return { focus: 'lost', group: null }
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}

function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const outlet = useOutlet()
  const open = pathname !== '/'
  const last = useRef(outlet) // keep the page visible while the sheet slides out
  if (open) last.current = outlet
  const { focus, group } = routeInfo(pathname)
  const view = useStore((s) => s.view)
  const time = useStore((s) => s.time)
  const narrow = useMedia('(max-width: 900px)')
  const sheet = useRef<HTMLElement>(null)

  useEffect(() => { document.documentElement.dataset.time = time }, [time])

  useEffect(() => {
    if (!open) { document.title = SITE.name; return }
    sheet.current?.scrollTo({ top: 0 })
    const h = sheet.current?.querySelector<HTMLElement>('.pt')
    h?.focus({ preventScroll: true })
    document.title = (h?.textContent ? h.textContent + ' · ' : '') + SITE.name
    const s = useStore.getState()
    if (innerWidth < 1000) s.setTerm(false)
    s.setView(null)
  }, [pathname, open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      const typing = /INPUT|TEXTAREA/.test((document.activeElement as HTMLElement | null)?.tagName ?? '')
      if (s.lightbox) {
        if (e.key === 'Escape') s.closeLightbox()
        if (e.key === 'ArrowLeft') s.stepLightbox(-1)
        if (e.key === 'ArrowRight') s.stepLightbox(1)
        return
      }
      if (e.key === 'Escape') open ? navigate('/') : s.setTerm(false)
      if (e.key === '`' && !typing) { e.preventDefault(); s.setTerm(!s.termOpen) }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open, navigate])

  return (
    <>
      <Garden focus={open ? focus : view ?? 'home'} sheetOpen={open} narrow={narrow} onSelect={(route) => navigate(route)} />
      <TopBar group={group} />
      <Intro hidden={open} />
      <Terminal />
      <main ref={sheet} className={'sheet' + (open ? ' open' : '')} aria-hidden={!open} inert={!open}>
        <div className="sin" key={pathname}>{last.current}</div>
      </main>
      <Overlays />
    </>
  )
}
