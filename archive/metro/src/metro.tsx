import { useEffect } from 'react'
import { Link } from 'react-router'
import { OWNER, SECTIONS, SECTION_KEYS, WORKS, whenOf, worksIn, type SectionKey, type T, type Work } from './content'
import { Bi, useLang } from './i18n'

/** Line number on the network: research = 1, design = 2, art = 3, writing = 4. */
export const lineNo = (k: SectionKey) => SECTION_KEYS.indexOf(k) + 1

/** Works on a line, oldest first (a year-only work sorts before dated works of that year). */
export const lineWorks = (k: SectionKey) => worksIn(k).sort((a, b) => whenOf(a).localeCompare(whenOf(b)))

export const NETWORK_YEAR = Math.max(...WORKS.map((w) => w.year))

const BASE_TITLE = `${OWNER.name.zh} · ${OWNER.name.en}`
export function useTitle(s?: string) {
  useEffect(() => {
    document.title = s ? `${s} · ${BASE_TITLE}` : BASE_TITLE
  }, [s])
}

/** Both languages, always, primary first by the current language. */
export function Both({ text, className = '' }: { text: T; className?: string }) {
  const { lang } = useLang()
  const en = lang === 'en'
  return (
    <span className={`both ${className}`}>
      <span className="both-a" lang={en ? 'en' : 'zh-CN'}>{en ? text.en : text.zh}</span>
      <span className="both-b" lang={en ? 'zh-CN' : 'en'}>{en ? text.zh : text.en}</span>
    </span>
  )
}

/** Metro line badge: a rounded rectangle in the line colour with the line numeral. */
export function Badge({ k, size = '' }: { k: SectionKey; size?: '' | 'sm' | 'lg' }) {
  return (
    <span className={`badge ln-${k} ${size}`} aria-hidden="true">
      {lineNo(k)}
    </span>
  )
}

/** A transfer link: badge + line name, pointing at that line's diagram. */
export function LineLink({ k, className = '' }: { k: SectionKey; className?: string }) {
  return (
    <Link to={`/${k}`} className={`line-link ${className}`}>
      <Badge k={k} size="sm" />
      <Bi text={SECTIONS[k].name} />
    </Link>
  )
}

/** Signage arrow, filled. Points left unless dir="right". */
export function Arrow({ dir = 'left', className = '' }: { dir?: 'left' | 'right' | 'up'; className?: string }) {
  const rot = dir === 'right' ? 180 : dir === 'up' ? 90 : 0
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      <path d="M2.5 14 13 3.5V10h12.5v8H13v6.5z" fill="currentColor" transform={`rotate(${rot} 14 14)`} strokeLinejoin="round" />
    </svg>
  )
}

/** Line chips used in tooltips and boards. */
export function LineChips({ w }: { w: Work }) {
  return (
    <span className="chips">
      {w.sec.map((s) => (
        <span className="chip" key={s}>
          <Badge k={s} size="sm" />
          <Bi text={SECTIONS[s].name} />
        </span>
      ))}
    </span>
  )
}

/**
 * A line drawn as a strip of stations in date order, like the diagram above a carriage door.
 * Horizontal when its container is wide, vertical when narrow (a container query in styles.css).
 */
export function LineStrip({ k }: { k: SectionKey }) {
  const { tr } = useLang()
  const works = lineWorks(k)
  return (
    <div className="strip-wrap">
      <ol className={`strip ln-${k}`} style={{ ['--n' as string]: works.length }}>
        {works.map((w) => {
          const transfers = w.sec.filter((s) => s !== k)
          return (
            <li key={w.slug} className={transfers.length ? 'x' : ''}>
              <span className="strip-dot" aria-hidden="true" />
              <span className="strip-year">{w.year}</span>
              <Link to={`/work/${w.slug}`} className="strip-name">
                <Both text={w.title} />
              </Link>
              <p className="strip-sum">
                <Bi text={w.summary} />
              </p>
              {transfers.length > 0 && (
                <p className="transfer">
                  <span className="transfer-label">{tr('换乘', 'Transfer')}</span>
                  {transfers.map((s) => (
                    <LineLink key={s} k={s} />
                  ))}
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
