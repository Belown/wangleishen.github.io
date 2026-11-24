import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { OWNER, SECTIONS, WORKS, sorted, whenOf, workBySlug, type SectionKey, type T, type Work } from './content'
import { Bi, useLang } from './i18n'
import { Blocks, Img } from './media'
import { LangSwitch, MARKS, Marker, Two, countOf, useContextSection, useTitle, type MarkKey } from './App'

const dot = (d: string) => d.replaceAll('-', '.')
const LATEST: SectionKey = WORKS.reduce((a, b) => (whenOf(b) > whenOf(a) ? b : a)).sec[0]
/** The section last opened in this visit; home lights it on return. */
let lastVisited: MarkKey | undefined

/* ---------- Home: the dial ---------- */

export function Home() {
  const { lang, pri, tr } = useLang()
  const [hover, setHover] = useState<MarkKey | null>(null)
  useTitle()
  const lit = hover ?? lastVisited ?? LATEST
  const years = WORKS.map((w) => w.year)
  const other = lang === 'en' ? OWNER.name.zh : OWNER.name.en
  return (
    <main className="dial">
      <header className="dial-top">
        <p className="engraved">
          {tr('示例内容', 'Placeholder')}
          <span className="sep" aria-hidden="true" />
          {pri(OWNER.place)}
          <span className="sep" aria-hidden="true" />
          {Math.min(...years)}–{Math.max(...years)}
          <span className="sep" aria-hidden="true" />
          {WORKS.length} {tr('件作品', 'works')}
        </p>
        <LangSwitch />
      </header>

      <section className="intro" aria-labelledby="who">
        <h1 id="who" className={`intro-name${lang === 'en' ? ' is-latin' : ''}`}>{pri(OWNER.name)}</h1>
        <p className="intro-latin" lang={lang === 'en' ? 'zh-CN' : 'en'}>{other}</p>
        <p className="intro-line"><Bi text={OWNER.bio} /></p>
      </section>

      <nav className="marks marks-dial" aria-label={tr('栏目', 'Sections')}>
        <span className="rule-ticks" aria-hidden="true" />
        <div className="marks-row">
          {MARKS.map((m) => (
            <Marker key={m.k} {...m} count={countOf(m.k)} current={lit === m.k} onHover={setHover} />
          ))}
        </div>
      </nav>
    </main>
  )
}

/* ---------- Section: the works, newest first ---------- */

export function SectionPage({ k }: { k: SectionKey }) {
  const { pri, tr } = useLang()
  const sec = SECTIONS[k]
  const works = sorted(k)
  const years = works.map((w) => w.year)
  useTitle(pri(sec.name))
  useEffect(() => { lastVisited = k }, [k])
  return (
    <main className="page section">
      <header className="head">
        <h1><Two text={sec.name} /></h1>
        <p className="head-sum"><Bi text={sec.blurb} /></p>
        <p className="engraved">
          {works.length} {tr('件作品', works.length === 1 ? 'work' : 'works')}
          <span className="sep" aria-hidden="true" />
          {Math.min(...years)}–{Math.max(...years)}
        </p>
      </header>
      <span className="rule-ticks" aria-hidden="true" />
      <ol className="index">
        {works.map((w, i) => (
          <li key={w.slug}>
            <Link to={`/work/${w.slug}${w.sec[0] === k ? '' : `?in=${k}`}`} className="row">
              <span className="row-when">{dot(whenOf(w))}</span>
              <span className="row-main">
                <Two text={w.title} className="row-title" />
                <span className="row-sum"><Bi text={w.summary} /></span>
              </span>
              <span className="row-pos" aria-label={tr(`第 ${i + 1} 件，共 ${works.length} 件`, `${i + 1} of ${works.length}`)}>
                {i + 1} / {works.length}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}

/* ---------- Work: one held view ---------- */

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  const ctx = useContextSection(slug)
  if (!w || !ctx) return <NotFound />
  return <WorkView w={w} k={ctx} />
}

function Pair({ label, children }: { label: T; children: ReactNode }) {
  return (
    <div>
      <dt><Bi text={label} /></dt>
      <dd>{children}</dd>
    </div>
  )
}

function Step({ dir, w, k }: { dir: 'prev' | 'next'; w?: Work; k: SectionKey }) {
  const { tr } = useLang()
  const label = dir === 'prev' ? tr('上一件', 'Previous') : tr('下一件', 'Next')
  if (!w) return <span className={`step ${dir} is-end`}><span className="step-label">{label}</span><span className="step-name">{tr('没有了', 'None')}</span></span>
  return (
    <Link to={`/work/${w.slug}${w.sec[0] === k ? '' : `?in=${k}`}`} className={`step ${dir}`} rel={dir}>
      <span className="step-label">
        {dir === 'prev' && <Chevron dir="left" />}
        {label}
        {dir === 'next' && <Chevron dir="right" />}
      </span>
      <Two text={w.title} className="step-name" />
    </Link>
  )
}

function WorkView({ w, k }: { w: Work; k: SectionKey }) {
  const { pri, tr } = useLang()
  const nav = useNavigate()
  const list = sorted(k)
  const i = list.findIndex((x) => x.slug === w.slug)
  const prev = list[i - 1], next = list[i + 1]
  useTitle(pri(w.title))
  useEffect(() => { lastVisited = k }, [k])

  // Left and right arrow keys step through the section, one work at a time.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, audio, video, [contenteditable]')) return
      const to = e.key === 'ArrowLeft' ? prev : e.key === 'ArrowRight' ? next : undefined
      if (to) nav(`/work/${to.slug}${to.sec[0] === k ? '' : `?in=${k}`}`)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [prev, next, k, nav])

  return (
    <main className="page work">
      <header className="head">
        <h1><Two text={w.title} /></h1>
        <p className="head-sum"><Bi text={w.summary} /></p>
        <p className="engraved">
          <Link to={`/${k}`} className="engraved-link">{pri(SECTIONS[k].name)}</Link>
          <span className="sep" aria-hidden="true" />
          <span className="pos">
            <b>{i + 1}</b> / {list.length}
          </span>
          <span className="sep" aria-hidden="true" />
          {dot(whenOf(w))}
          {w.venue && <><span className="sep" aria-hidden="true" />{w.venue}</>}
        </p>
      </header>

      {(w.role || w.tools) && (
        <dl className="spec">
          {w.role && <Pair label={{ zh: '角色', en: 'Role' }}><Bi text={w.role} /></Pair>}
          {w.tools && <Pair label={{ zh: '材料与工具', en: 'Medium' }}><Bi text={w.tools} /></Pair>}
        </dl>
      )}

      <span className="rule-ticks" aria-hidden="true" />

      <article className="prose">
        <Blocks blocks={w.body} />
      </article>

      <nav className="steps" aria-label={tr('同栏目里的前后作品', 'Previous and next in this section')}>
        <Step dir="prev" w={prev} k={k} />
        <Step dir="next" w={next} k={k} />
      </nav>
    </main>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="chev" viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
      <path d={dir === 'left' ? 'M6.5 1.5 3 5l3.5 3.5' : 'M3.5 1.5 7 5 3.5 8.5'} fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/* ---------- About ---------- */

async function copyText(text: string, el: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    if (!el) return false
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    try { return document.execCommand('copy') } catch { return false }
  }
}

export function About() {
  const { pri, tr } = useLang()
  const emailRef = useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  useTitle(pri({ zh: '关于', en: 'About' }))
  useEffect(() => { lastVisited = 'about' }, [])

  return (
    <main className="page about">
      <header className="head">
        <h1><Two text={OWNER.name} /></h1>
        <p className="head-sum"><Bi text={OWNER.bio} /></p>
      </header>
      <div className="about-portrait">
        <Img file={OWNER.portrait} ratio="4/5" alt={pri(OWNER.name)} />
      </div>
      <span className="rule-ticks" aria-hidden="true" />
      <div className="prose">
        <Blocks blocks={OWNER.about.map((text) => ({ type: 'p' as const, text }))} />
      </div>
      <dl className="spec contact">
        <Pair label={{ zh: '邮箱', en: 'Email' }}>
          <span className="email" ref={emailRef}>{OWNER.email}</span>
          <button type="button" className="copy" onClick={async () => setCopied((await copyText(OWNER.email, emailRef.current)) ? 'ok' : 'fail')}>
            {tr('复制', 'Copy')}
          </button>
          <span className="copy-status" role="status">
            {copied === 'ok' && tr('已复制', 'Copied')}
            {copied === 'fail' && tr('没能复制，请手动选中', 'Could not copy. Select it by hand')}
          </span>
        </Pair>
        <Pair label={{ zh: '链接', en: 'Links' }}>
          <ul className="links">
            {OWNER.links.map((l) => (
              <li key={l.label.en}>
                {l.href
                  ? <a href={l.href} target="_blank" rel="noreferrer"><Bi text={l.label} /></a>
                  : <span className="link-empty"><Bi text={l.label} /><span className="link-note">{tr('在 content.ts 里填上链接', 'add the link in content.ts')}</span></span>}
              </li>
            ))}
          </ul>
        </Pair>
      </dl>
    </main>
  )
}

/* ---------- 404 ---------- */

export function NotFound() {
  const { tr } = useLang()
  useTitle(tr('找不到这一页', 'Page not found'))
  return (
    <main className="page lost">
      <header className="head">
        <h1>{tr('找不到这一页', 'Nothing here')}</h1>
        <p className="head-sum">{tr('这个地址上没有作品。从上面的五个栏目里选一个吧。', 'No work lives at this address. Pick one of the five sections above.')}</p>
        <p className="engraved"><Link to="/" className="engraved-link">{tr('回到首页', 'Back to the start')}</Link></p>
      </header>
    </main>
  )
}
