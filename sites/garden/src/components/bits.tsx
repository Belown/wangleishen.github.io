import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { SITE } from '../content/site'
import type { Work } from '../content/works'
import { copyText } from '../lib/util'
import { toast } from '../store'

export function Crumb({ trail }: { trail: [string | null, string][] }) {
  return (
    <div className="crumb">
      <span>
        <Link to="/">garden</Link>
        {trail.map(([to, label]) => (
          <span key={label}> / {to ? <Link to={to}>{label}</Link> : label}</span>
        ))}
      </span>
      <Link className="x" to="/">Close ×</Link>
    </div>
  )
}

export const Kick = ({ children }: { children: ReactNode[] | ReactNode }) => {
  const parts = (Array.isArray(children) ? children : [children]).filter(Boolean)
  return <div className="kick">{parts.flatMap((p, i) => (i ? [<span key={'d' + i}>·</span>, <span key={i}>{p}</span>] : [<span key={i}>{p}</span>]))}</div>
}

export function Foot() {
  return (
    <div className="foot">
      <span>{SITE.name} {SITE.nameLocal} · © {new Date().getFullYear()}</span>
      <span>Last raked {new Date().toLocaleDateString('en-GB')}</span>
      <button type="button" className="b" onClick={(e) => (e.currentTarget.closest('.sheet') as HTMLElement)?.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top ↑
      </button>
    </div>
  )
}

/** External link that falls back to a hint when the URL is not filled in yet. */
export function ExtLink({ href, children, className = 'b' }: { href?: string; children: ReactNode; className?: string }) {
  return href ? (
    <a className={className} href={href} target="_blank" rel="noreferrer">{children} ↗</a>
  ) : (
    <button type="button" className={className} onClick={() => toast(`Add a link for “${children}” in src/content`)}>{children} ↗</button>
  )
}

export function Newsletter() {
  const [done, setDone] = useState(false)
  if (done) return <p className="cap ink">Thanks. This form is a placeholder, so nothing was sent.</p>
  return (
    <>
      <form className="form" onSubmit={(e) => { e.preventDefault(); setDone(true) }}>
        <input type="email" id="nl-email" required placeholder="you@example.com" aria-label="Email address" />
        <button className="b solid" type="submit">Subscribe</button>
      </form>
      <p className="cap">Placeholder form. Connect it to your newsletter provider in components/bits.tsx.</p>
    </>
  )
}

const bibtex = (w: Work) =>
  `@inproceedings{lin${w.year}${w.slug.replace(/-/g, '')},\n  title     = {${w.title}: ${w.summary}},\n  author    = {${(w.authors ?? SITE.name).split(', ').join(' and ')}},\n  booktitle = {Proceedings of ${w.venue}},\n  year      = {${w.year}}\n}`

export function Publication({ w }: { w: Work }) {
  const [bib, setBib] = useState(false)
  return (
    <article className="pub">
      <h3><Link to={`/works/${w.slug}`}>{w.title}: {w.summary}</Link></h3>
      <div className="au">
        {(w.authors ?? SITE.name).split(', ').map((a, i) => (
          <span key={a}>{i > 0 && ', '}{a === SITE.name ? <strong>{a}</strong> : a}</span>
        ))}
      </div>
      <div className="ve"><span>{w.venue}</span>{w.award && <span className="award">✦ {w.award}</span>}</div>
      <div className="btns">
        {['PDF', 'DOI', 'Video', 'Talk'].map((l) => <ExtLink key={l}>{l}</ExtLink>)}
        <button type="button" className="b" aria-expanded={bib} onClick={() => setBib(!bib)}>BibTeX</button>
        <button type="button" className="b" onClick={() => copyText(bibtex(w), 'BibTeX')}>Copy BibTeX</button>
      </div>
      {bib && <pre className="code">{bibtex(w)}</pre>}
    </article>
  )
}

export function CopyEmail() {
  return (
    <div className="email">
      <span>{SITE.email}</span>
      <button type="button" className="b" onClick={() => copyText(SITE.email, 'Email')}>Copy</button>
    </div>
  )
}
