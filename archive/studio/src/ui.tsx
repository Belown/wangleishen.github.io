import { Fragment, useEffect } from 'react'
import { Link } from 'react-router'
import { NEWS, OWNER, type T } from './content'
import { useLang } from './i18n'

export function useTitle(s: string | null) {
  useEffect(() => {
    document.title = s ? `${s} · ${OWNER.name}` : OWNER.name
  }, [s])
}

/** Plain text with [blanks] underlined, so unfilled placeholders stand out. */
export function Fill({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith('[') ? <span key={i} className="fill">{part}</span> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}

/** Text in the current language; bilingual mode shows English under the Chinese. */
export function Tx({ text }: { text: T }) {
  const { lang } = useLang()
  if (lang === 'both')
    return (
      <>
        <Fill text={text.zh} />
        <span className="bi-sec" lang="en"> <Fill text={text.en} /></span>
      </>
    )
  return <Fill text={lang === 'zh' ? text.zh : text.en} />
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function useMonth() {
  const { lang } = useLang()
  return (ym: string) => {
    const [y, m] = ym.split('-').map(Number)
    return lang === 'zh' ? `${y}年${m}月` : `${MONTHS[m - 1]} ${y}`
  }
}

export function NewsList({ limit }: { limit?: number }) {
  const month = useMonth()
  return (
    <ol className="news-list">
      {NEWS.slice(0, limit).map((n) => (
        <li key={n.date + n.text.en}>
          <time dateTime={n.date}>{month(n.date)}</time>
          <span>
            {n.work ? <Link to={`/work/${n.work}`}><Tx text={n.text} /></Link> : <Tx text={n.text} />}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Links() {
  const { t } = useLang()
  return (
    <div className="links">
      {OWNER.links.map((l) => (
        <a key={l.label.en} href={l.href} target="_blank" rel="noreferrer">{t(l.label)}</a>
      ))}
      <a href={`mailto:${OWNER.email}`}>Email</a>
    </div>
  )
}
