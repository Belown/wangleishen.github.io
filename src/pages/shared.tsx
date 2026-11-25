import { Fragment, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router'
import { asset } from '../assets'
import { ME, OWNER, SECTIONS, whenOf, type T, type Work } from '../content'
import { Img } from '../media'

const HOME_TITLE = `${OWNER.name} | ${OWNER.role} | ${OWNER.org}`
export function useTitle(s?: string) {
  useEffect(() => {
    document.title = s ? `${s} | ${OWNER.name}` : HOME_TITLE
  }, [s])
}

export const newestFirst = (ws: Work[]) => [...ws].sort((a, b) => whenOf(b).localeCompare(whenOf(a)))
export const cover = (w: Work) => `works/${w.slug}/cover.jpg`

export function Sections({ w }: { w: Work }) {
  return <>{w.sec.map((s) => (SECTIONS[s].name)).join(' / ')}</>
}

/** A work standing in the light: a lit pool on the floor, a catch-light on its top edge, a contact shadow. */
export function Piece({ w, link = true, ratio = '4/3', portrait }: { w?: Work; link?: boolean; ratio?: string; portrait?: string }) {
  const inner = (
    <>
      <span className="pool" aria-hidden="true" />
      <span className="catch" aria-hidden="true" />
      <Img file={portrait ?? cover(w!)} ratio={ratio} alt={w ? (w.title) : (OWNER.name)} />
    </>
  )
  const cls = `piece ${portrait ? 'portrait' : ''}`
  return w && link
    ? <Link to={`/work/${w.slug}`} className={cls} tabIndex={-1} aria-hidden="true">{inner}</Link>
    : <div className={cls}>{inner}</div>
}

/** The opening screen: a short introduction on the left, one work in the light on the right. */
export function Hero({ w, children, compact }: { w: Work; children: ReactNode; compact?: boolean }) {
  return (
    <section className={`hero ${compact ? 'compact' : ''}`}>
      <div className="hero-text">{children}</div>
      <div className="hero-stage">
        <Piece w={w} />
        <p className="caption keep">
          <Link to={`/work/${w.slug}`}>{w.title}</Link>
          <span className="dot">·</span>
          <span className="num">{w.year}</span>
          <span className="dot">·</span>
          <Sections w={w} />
        </p>
      </div>
    </section>
  )
}

/** A name or section title in display type. */
export function Name({ text, level = 1 }: { text: T; level?: 1 | 2 }) {
  const Tag = level === 1 ? 'h1' : 'h2'
  return <Tag className="display keep">{text}</Tag>
}

export function Authors({ list }: { list: string[] }) {
  return (
    <>
      {list.map((a, i) => (
        <Fragment key={a}>
          {i > 0 && (i === list.length - 1 ? (list.length > 2 ? ', and ' : ' and ') : ', ')}
          {a === ME ? <b>{a}</b> : a}
        </Fragment>
      ))}
    </>
  )
}

export function CiteLink({ label, href, file }: { label: string; href?: string; file?: string }) {
  const url = href || (file && asset(file))
  return url
    ? <a className="cite-link" href={url} target="_blank" rel="noreferrer">[{label}]</a>
    : <span className="cite-link off" title={'Link not added yet'}>[{label}]</span>
}

export function PageHead({ title, line }: { title: string; line: string }) {
  return (
    <header className="page-head">
      <Name text={title} />
      <p className="line keep">{line}</p>
    </header>
  )
}
