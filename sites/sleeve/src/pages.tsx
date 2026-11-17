import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { OWNER, SECTIONS, workBySlug, whenOf, worksIn, type SectionKey, type T, type Work } from './content'
import { Bi, useLang } from './i18n'
import { Blocks } from './media'
import {
  Arrow, CATALOGUE, CopyIcon, Cover, Disc, LangSwitch, PlayedMark, Portrait, TRACKS, TrackLink,
  featOf, singleOf, trackOf, useGround,
} from './record'

/* ---------- home: the front of the sleeve ---------- */

export function Home() {
  const { lang, tr, pri } = useLang()
  const { hot, played } = useGround()
  const hotSection = hot && hot !== 'home' && hot !== 'about' ? hot : null

  return (
    <main className="home" id="main">
      <h1 className="home-logo">
        <span className="logo-zh">{OWNER.name.zh}</span>
        <span className="logo-en" lang="en">{OWNER.name.en.toLowerCase()}</span>
      </h1>

      <div className="home-cat">
        <p>
          {CATALOGUE.no} · STEREO<br />
          {CATALOGUE.years}<br />
          {tr('A 面 / B 面', 'Side A / Side B')}
        </p>
        <LangSwitch />
      </div>

      <Portrait className="home-photo" />

      <nav className="home-tracks" aria-label={tr('曲目', 'Tracklist')}>
        <ol className="tracks">
          {TRACKS.map((t) => {
            const n = t.k === 'about' ? 0 : worksIn(t.k).length
            return (
              <li key={t.k} className={t.n === 'B1' ? 'side-b' : undefined}>
                <TrackLink k={t.k} className="track">
                  <span className="track-n">{t.n}</span>
                  <span className="track-t"><Bi text={t.name} />{played.has(t.k) && <PlayedMark />}</span>
                  <span className="track-c">{n ? (lang === 'en' ? `${n} works` : `${n} 件`) : lang === 'en' ? 'notes' : '简介'}</span>
                </TrackLink>
              </li>
            )
          })}
        </ol>
        <p className="now">
          {hotSection
            ? <><span className="now-k">{tr('这一面：', 'On this side: ')}</span>{singleOf(hotSection).slice(0, 4).map(({ w }) => pri(w.title)).join(' · ')}</>
            : <Bi text={OWNER.bio} />}
        </p>
      </nav>
    </main>
  )
}

/* ---------- section: a 45-rpm single ---------- */

export function Section({ k }: { k: SectionKey }) {
  const { lang, t, pri } = useLang()
  const s = SECTIONS[k]
  const single = singleOf(k)
  const track = trackOf(k)

  return (
    <main className="single" id="main">
      <header className="single-head">
        <h1 className="display"><Bi text={s.name} /></h1>
        <div className="single-side">
          <p className="single-blurb"><Bi text={s.blurb} /></p>
          <p className="cat">
            {CATALOGUE.no}-{track.n} · 45 RPM · {lang === 'en' ? `${single.length} tracks` : `${single.length} 首`}
          </p>
        </div>
      </header>

      <ol className="tracklist">
        {single.map(({ w, n, sideB }) => {
          const feat = featOf(w, k)
          return (
            <li key={w.slug} className={sideB ? 'row side-b' : 'row'}>
              <Cover slug={w.slug} />
              <span className="row-n">{n}</span>
              <span className="row-main">
                <Link className="row-title" to={`/work/${w.slug}`}><Bi text={w.title} /></Link>
                <span className="row-sum">{t(w.summary)}</span>
                {feat && (
                  <TrackLink k={feat} className="feat">feat. {pri(SECTIONS[feat].name)}</TrackLink>
                )}
              </span>
              <span className="row-y">{w.year}</span>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

/* ---------- work: the back of the sleeve ---------- */

function Credits({ w }: { w: Work }) {
  const { tr, pri } = useLang()
  const home = w.sec[0]
  const n = singleOf(home).find((x) => x.w === w)!.n
  const feat = featOf(w, home)
  const rows: [string, ReactNode][] = [
    [tr('曲目', 'Track'), <><span className="tnum">{n}</span> · <TrackLink k={home}>{pri(SECTIONS[home].name)}</TrackLink></>],
    [tr('录音', 'Recorded'), <time className="tnum" dateTime={whenOf(w)}>{whenOf(w)}</time>],
  ]
  if (w.venue) rows.push([tr('场地', 'Venue'), w.venue])
  if (w.role) rows.push([tr('角色', 'Role'), <Bi text={w.role} />])
  if (w.tools) rows.push([tr('材料·工具', 'Tools'), <Bi text={w.tools} />])
  if (feat) rows.push([tr('客串', 'Featuring'), <TrackLink k={feat}>{pri(SECTIONS[feat].name)}</TrackLink>])
  return (
    <dl className="credits">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  )
}

function PrevNext({ w }: { w: Work }) {
  const { tr } = useLang()
  const home = w.sec[0]
  const single = singleOf(home)
  const i = single.findIndex((x) => x.w === w)
  const prev = single[i - 1], next = single[i + 1]
  return (
    <nav className="pn" aria-label={tr('同一张单曲里的其他曲目', 'Other tracks on this single')}>
      {prev ? (
        <Link to={`/work/${prev.w.slug}`} rel="prev" className="pn-prev">
          <Arrow dir="left" />
          <span><small>{tr('上一首', 'Previous')} · {prev.n}</small><Bi text={prev.w.title} /></span>
        </Link>
      ) : <span />}
      <Link to={`/${home}`} className="pn-all">{tr('全部曲目', 'All tracks')}</Link>
      {next ? (
        <Link to={`/work/${next.w.slug}`} rel="next" className="pn-next">
          <span><small>{tr('下一首', 'Next')} · {next.n}</small><Bi text={next.w.title} /></span>
          <Arrow dir="right" />
        </Link>
      ) : <span />}
    </nav>
  )
}

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  if (!w) return <NotFound />
  return w.sec[0] === 'writing' ? <Booklet w={w} /> : <Liner w={w} />
}

function Liner({ w }: { w: Work }) {
  return (
    <main className="liner" id="main">
      <header className="liner-head">
        <h1 className="display display-m"><Bi text={w.title} /></h1>
        <p className="lede"><Bi text={w.summary} /></p>
      </header>
      <div className="liner-grid">
        <aside className="liner-credits"><Credits w={w} /></aside>
        <article className="paper notes"><Blocks blocks={w.body} /></article>
      </div>
      <PrevNext w={w} />
    </main>
  )
}

/** Writing: a lyric booklet. */
function Booklet({ w }: { w: Work }) {
  const { tr, pri } = useLang()
  const feat = featOf(w, 'writing')
  const n = singleOf('writing').find((x) => x.w === w)!.n
  return (
    <main className="booklet" id="main">
      <header className="booklet-band">
        <div className="col">
          <h1 className="display display-m"><Bi text={w.title} /></h1>
          <p className="booklet-meta">
            <span className="tnum">{n}</span>
            <time className="tnum" dateTime={whenOf(w)}>{whenOf(w)}</time>
            {feat && <TrackLink k={feat}>feat. {pri(SECTIONS[feat].name)}</TrackLink>}
          </p>
        </div>
      </header>
      <div className="paper booklet-page">
        <article className="col notes">
          <p className="lede"><Bi text={w.summary} /></p>
          <Blocks blocks={w.body} />
        </article>
        <div className="col"><PrevNext w={w} /></div>
        <p className="col booklet-end">{tr('歌词本完', 'End of booklet')} · {CATALOGUE.no}</p>
      </div>
    </main>
  )
}

/* ---------- about ---------- */

function CopyEmail() {
  const { tr } = useLang()
  const [state, setState] = useState<'idle' | 'copied' | 'selected'>('idle')
  const addr = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (state === 'idle') return
    const id = setTimeout(() => setState('idle'), 2500)
    return () => clearTimeout(id)
  }, [state])

  async function copy() {
    try {
      await navigator.clipboard.writeText(OWNER.email)
      return setState('copied')
    } catch { /* clipboard API missing or blocked: fall back below */ }
    const ta = document.createElement('textarea')
    ta.value = OWNER.email
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    if (ok) return setState('copied')
    // last resort: select the address so the visitor can copy it themselves
    const range = document.createRange()
    range.selectNodeContents(addr.current!)
    getSelection()?.removeAllRanges()
    getSelection()?.addRange(range)
    setState('selected')
  }

  const msg = state === 'copied' ? tr('已复制', 'Copied') : state === 'selected' ? tr('已选中，按 Ctrl+C 复制', 'Selected, press Ctrl+C') : ''
  return (
    <span className="email">
      <span className="email-addr" ref={addr}>{OWNER.email}</span>
      <button type="button" className="btn" onClick={copy}>
        <CopyIcon />{state === 'idle' ? tr('复制地址', 'Copy address') : msg}
      </button>
      <span className="sr-only" role="status">{msg}</span>
    </span>
  )
}

export function About() {
  const { tr } = useLang()
  return (
    <main className="about" id="main">
      <Portrait className="about-photo" />
      <div className="about-body">
        <h1 className="display display-m">{tr('关于这张唱片', 'About this record')}</h1>
        <p className="lede"><Bi text={OWNER.bio} /></p>
        <div className="about-text"><Blocks blocks={OWNER.about.map((text: T) => ({ type: 'p' as const, text }))} /></div>
        <dl className="credits">
          <div><dt>{tr('写信', 'Write to')}</dt><dd><CopyEmail /></dd></div>
          <div>
            <dt>{tr('链接', 'Links')}</dt>
            <dd>
              <ul className="links">
                {OWNER.links.map((l) => (
                  <li key={l.label.en}>
                    {l.href
                      ? <a href={l.href} target="_blank" rel="noreferrer"><Bi text={l.label} /></a>
                      : <><Bi text={l.label} /> <span className="todo">{tr('（在 src/content.ts 里填上链接）', '(add the link in src/content.ts)')}</span></>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  )
}

/* ---------- 404 ---------- */

export function NotFound() {
  const { tr } = useLang()
  return (
    <main className="nf" id="main">
      <Disc />
      <h1 className="display display-m">{tr('这面没有录音', 'Nothing recorded on this side')}</h1>
      <p><Link to="/" className="btn"><Arrow dir="left" />{tr('回到封面', 'Back to the cover')}</Link></p>
    </main>
  )
}
