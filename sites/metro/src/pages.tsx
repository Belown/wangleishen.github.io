import { useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { OWNER, SECTIONS, SECTION_KEYS, workBySlug, type SectionKey, type T, type Work } from './content'
import { Bi, useLang } from './i18n'
import { Blocks, Img } from './media'
import { Arrow, Badge, Both, LineLink, LineStrip, lineWorks, useTitle } from './metro'

/* ---------- Section: the in-carriage line diagram ---------- */

export function SectionPage({ k }: { k: SectionKey }) {
  const { tr, pri } = useLang()
  const sec = SECTIONS[k]
  const works = lineWorks(k)
  const last = works[works.length - 1]
  useTitle(pri(sec.name))
  return (
    <main className={`section ln-${k}`}>
      <header className="section-head">
        <Badge k={k} size="lg" />
        <div>
          <h1>
            <Both text={sec.name} />
          </h1>
          <p className="section-blurb">
            <Bi text={sec.blurb} />
          </p>
          <p className="section-meta">
            {works.length} {tr('站', 'stations')} · {works[0].year}–{last.year}
          </p>
        </div>
      </header>

      <p className="toward">
        <Arrow dir="right" />
        <span>
          {tr('开往', 'Towards')} <Both text={last.title} className="inline" />
        </span>
      </p>

      <LineStrip k={k} />

      <nav className="other-lines" aria-label={tr('其他线路', 'Other lines')}>
        <span>{tr('其他线路', 'Other lines')}</span>
        {SECTION_KEYS.filter((s) => s !== k).map((s) => (
          <LineLink key={s} k={s} />
        ))}
      </nav>
    </main>
  )
}

/* ---------- Work: the station information board ---------- */

function DirSign({ dir, w }: { dir: 'prev' | 'next'; w?: Work }) {
  const { tr } = useLang()
  const label = dir === 'prev' ? tr('上一站', 'Previous station') : tr('下一站', 'Next station')
  const arrow = <Arrow dir={dir === 'prev' ? 'left' : 'right'} />
  if (!w)
    return (
      <span className={`dir ${dir} end`}>
        {dir === 'prev' && arrow}
        <span className="dir-text">
          <span className="dir-label">{label}</span>
          <span className="dir-name">{dir === 'prev' ? tr('本线起点站', 'First station on this line') : tr('本线终点站', 'End of the line')}</span>
        </span>
        {dir === 'next' && arrow}
      </span>
    )
  return (
    <Link to={`/work/${w.slug}`} className={`dir ${dir}`} rel={dir}>
      {dir === 'prev' && arrow}
      <span className="dir-text">
        <span className="dir-label">{label}</span>
        <Both text={w.title} className="dir-name" />
      </span>
      {dir === 'next' && arrow}
    </Link>
  )
}

function Row({ label, children }: { label: T; children: ReactNode }) {
  return (
    <tr>
      <th scope="row">
        <Both text={label} />
      </th>
      <td>{children}</td>
    </tr>
  )
}

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  if (!w) return <NotFound />
  return <WorkBoard w={w} key={w.slug} />
}

function WorkBoard({ w }: { w: Work }) {
  const { tr, pri } = useLang()
  useTitle(pri(w.title))
  const home = w.sec[0]
  const list = lineWorks(home)
  const i = list.findIndex((x) => x.slug === w.slug)
  const essay = home === 'writing'
  const transfers = w.sec.slice(1)

  const table = (
    <table className={`timetable ${essay ? 'compact' : ''}`}>
      <caption className="sr-only">{tr('作品信息', 'Work details')}</caption>
      <tbody>
        <Row label={{ zh: '年份', en: 'Year' }}>{w.year}</Row>
        {w.date && <Row label={{ zh: '日期', en: 'Date' }}>{w.date.replaceAll('-', '.')}</Row>}
        {w.venue && <Row label={{ zh: '发表', en: 'Venue' }}>{w.venue}</Row>}
        {w.role && <Row label={{ zh: '角色', en: 'Role' }}><Bi text={w.role} /></Row>}
        {w.tools && <Row label={{ zh: '材料与工具', en: 'Tools' }}><Bi text={w.tools} /></Row>}
      </tbody>
    </table>
  )

  return (
    <main className={`work ${essay ? 'essay' : ''}`}>
      <header className={`board ln-${home}`}>
        <div className="board-inner">
          <div className="board-lines">
            <LineLink k={home} className="on-board" />
            {transfers.map((s) => (
              <span className="board-transfer" key={s}>
                <span className="transfer-label">{tr('换乘', 'Transfer')}</span>
                <LineLink k={s} className="on-board" />
              </span>
            ))}
          </div>
          <h1 className="board-name">
            <Both text={w.title} />
          </h1>
          <p className="board-sum">
            <Bi text={w.summary} />
          </p>
        </div>
        <nav className="board-dirs" aria-label={tr('同线前后作品', 'Previous and next on this line')}>
          <DirSign dir="prev" w={list[i - 1]} />
          <DirSign dir="next" w={list[i + 1]} />
        </nav>
      </header>

      <div className={`work-body ln-${home}`}>
        <aside className="work-aside">{table}</aside>
        <article className="prose">
          <Blocks blocks={w.body} />
        </article>
      </div>

      <p className="back-line">
        <Link to={`/${home}`} className="line-link">
          <Badge k={home} size="sm" />
          <span>{tr('返回线路图', 'Back to the line diagram')}</span>
        </Link>
      </p>
    </main>
  )
}

/* ---------- About: passenger information ---------- */

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="7.4" r="1.6" fill="currentColor" />
      <rect x="10.6" y="10.4" width="2.8" height="7.6" rx="1" fill="currentColor" />
    </svg>
  )
}

async function copyText(text: string, fallbackEl: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers or insecure origins: select the text and use the legacy command.
    if (!fallbackEl) return false
    const range = document.createRange()
    range.selectNodeContents(fallbackEl)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    try {
      return document.execCommand('copy')
    } catch {
      return false
    }
  }
}

export function About() {
  const { tr, pri } = useLang()
  const emailRef = useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  useTitle(pri({ zh: '关于', en: 'About' }))

  async function copy() {
    const ok = await copyText(OWNER.email, emailRef.current)
    setCopied(ok ? 'ok' : 'fail')
  }

  return (
    <main className="about">
      <div className="notice">
        <header className="notice-head">
          <InfoIcon />
          <h1>
            <Both text={{ zh: '乘客须知', en: 'Passenger information' }} />
          </h1>
        </header>
        <div className="notice-body">
          <div className="notice-portrait">
            <Img file={OWNER.portrait} ratio="4/5" alt={pri(OWNER.name)} />
          </div>
          <div className="notice-text">
            <h2 className="notice-name">
              <Both text={OWNER.name} />
            </h2>
            <p className="notice-bio">
              <Bi text={OWNER.bio} />
            </p>
            <div className="prose">
              <Blocks blocks={OWNER.about.map((text) => ({ type: 'p' as const, text }))} />
            </div>

            <dl className="notice-list">
              <div>
                <dt>
                  <Both text={{ zh: '邮箱', en: 'Email' }} />
                </dt>
                <dd className="email-row">
                  <span className="email" ref={emailRef}>{OWNER.email}</span>
                  <button type="button" className="copy" onClick={copy}>
                    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                      <rect x="6.5" y="6.5" width="10" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M3.5 13.5V4a1.5 1.5 0 0 1 1.5-1.5h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {tr('复制', 'Copy')}
                  </button>
                  <span className="copy-status" role="status">
                    {copied === 'ok' && tr('已复制', 'Copied')}
                    {copied === 'fail' && tr('没能复制，请手动选中', 'Could not copy. Select it by hand')}
                  </span>
                </dd>
              </div>
              <div>
                <dt>
                  <Both text={{ zh: '链接', en: 'Links' }} />
                </dt>
                <dd>
                  <ul className="links">
                    {OWNER.links.map((l) => (
                      <li key={l.label.en}>
                        {l.href ? (
                          <a href={l.href} target="_blank" rel="noreferrer">
                            <Bi text={l.label} />
                          </a>
                        ) : (
                          <>
                            <span className="link-empty"><Bi text={l.label} /></span>
                            <span className="link-note">{tr('在 content.ts 里填上链接', 'Add the link in content.ts')}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ---------- 404 ---------- */

export function NotFound() {
  const { tr } = useLang()
  useTitle(tr('本站暂停服务', 'Station closed'))
  return (
    <main className="closed">
      <div className="closed-sign">
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" className="closed-mark">
          <circle cx="32" cy="32" r="26" fill="#fff" stroke="currentColor" strokeWidth="6" />
          <rect x="16" y="28" width="32" height="8" rx="2" fill="currentColor" />
        </svg>
        <h1>
          <Both text={{ zh: '本站暂停服务', en: 'This station is closed' }} />
        </h1>
        <p>{tr('你要找的页面不在线网上。', 'The page you are looking for is not on the network.')}</p>
        <Link to="/" className="closed-back">
          <Arrow dir="left" />
          {tr('返回线网图', 'Back to the map')}
        </Link>
      </div>
    </main>
  )
}
