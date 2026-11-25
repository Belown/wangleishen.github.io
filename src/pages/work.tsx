import { Fragment, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { asset } from '../assets'
import { ME, SAMPLE_NOTE, SECTIONS, whenOf, workBySlug, worksIn, type Paper, type T, type Work } from '../content'
import { Blocks } from '../media'
import { NotFound } from './not-found'
import { Authors, CiteLink, Piece, newestFirst, useTitle } from './shared'

function Fact({ label, children }: { label: T; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  return w ? <CaseStudy w={w} key={w.slug} /> : <NotFound />
}

/** The paper's title block under the work title: subtitle, authors with affiliations, venue, links. */
function PaperHead({ w, p }: { w: Work; p: Paper }) {
  const sub = p.title.startsWith(w.title + ':') ? p.title.slice(w.title.length + 1).trim() : p.title
  return (
    <div className="paper-head">
      <p className="line keep">{sub}</p>
      <p className="authors">
        {p.authors.map((a, n) => (
          <Fragment key={a.name}>
            {n > 0 && ', '}
            {a.name === ME ? <b>{a.name}</b> : a.name}<sup>{a.aff.join(',')}</sup>
          </Fragment>
        ))}
      </p>
      <p className="affs">
        {p.affiliations.map((x, n) => <span key={x}><sup>{n + 1}</sup>{x}</span>)}
      </p>
      {p.mentors && (
        <div className="mentors">
          <span className="mentors-label">Mentors</span>
          <ul>
            {p.mentors.map((m) => <li key={m.name}>{m.href ? <a href={m.href} target="_blank" rel="noreferrer">{m.name}</a> : m.name} <span className="dim">{m.aff}</span></li>)}
          </ul>
        </div>
      )}
      <p className="venue">{p.venue}</p>
      <p className="paper-links">
        <CiteLink label="Paper" file={p.pdf} />
        <CiteLink label="DOI" href={p.doi && `https://doi.org/${p.doi}`} />
        {w.links?.map((l) => <CiteLink key={l.label} label={l.label} href={l.href} file={l.file} />)}
      </p>
    </div>
  )
}

/** The end of a paper's page: the citation, abstract and BibTeX. */
function Publication({ p }: { p: Paper }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!p.bibtex || !navigator.clipboard) return
    navigator.clipboard.writeText(p.bibtex).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })
  }
  return (
    <section className="prose publication" aria-labelledby="pub-h">
      <h2 id="pub-h">Publication</h2>
      <p className="pub-cite">
        <b>{p.title}</b><br />
        <Authors list={p.authors.map((a) => a.name)} /><br />
        <i>{p.venue}</i>
      </p>
      <p className="cite-links">
        <CiteLink label="DOI" href={p.doi && `https://doi.org/${p.doi}`} />
        <CiteLink label="PDF" file={p.pdf} />
      </p>
      {p.abstract && (<><h3>Abstract</h3><p>{p.abstract}</p></>)}
      {p.bibtex && (
        <div className="bibtex">
          <div className="bibtex-bar">
            <h3>BibTeX</h3>
            <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <pre><code>{p.bibtex}</code></pre>
        </div>
      )}
    </section>
  )
}

function CaseStudy({ w }: { w: Work }) {
  useTitle((w.title))
  const home = w.sec[0]
  const list = newestFirst(worksIn(home))
  const i = list.findIndex((x) => x.slug === w.slug)
  const newer = list[i - 1]
  const older = list[i + 1]
  return (
    <main className="work">
      <header className="hero compact">
        <div className="hero-text">
          <h1 className="display work-title keep">{w.title}</h1>
          {w.paper ? <PaperHead w={w} p={w.paper} /> : <p className="line keep">{w.summary}</p>}
          <dl className="facts">
            <Fact label={'Date'}><span className="num">{whenOf(w).replaceAll('-', '.')}</span></Fact>
            {w.venue && !w.paper && <Fact label={'Context'}>{w.venue}</Fact>}
            {w.role && <Fact label={'Role'}>{w.role}</Fact>}
            {w.tools && <Fact label={'Tools'}>{w.tools}</Fact>}
            {w.links && w.links.length > 0 && !w.paper && (
              <Fact label={'Links'}>
                {w.links.map((l, n) => (
                  <span key={l.label}>{n > 0 && ' · '}<a href={l.href ?? (l.file && asset(l.file))} target="_blank" rel="noreferrer">{l.label}</a></span>
                ))}
              </Fact>
            )}
            <Fact label={'Sections'}>
              {w.sec.map((s, n) => (
                <span key={s}>{n > 0 && ' / '}<Link to={`/${s}`}>{SECTIONS[s].name}</Link></span>
              ))}
            </Fact>
          </dl>
          {SAMPLE_NOTE && <p className="sample">{SAMPLE_NOTE}</p>}
        </div>
        <div className="hero-stage">
          <Piece w={w} link={false} />
        </div>
      </header>

      <article className="prose">
        <Blocks blocks={w.body} />
      </article>
      {w.paper && <Publication p={w.paper} />}

      <nav className="pager" aria-label={'More in this section'}>
        {newer ? (
          <Link to={`/work/${newer.slug}`} rel="prev" className="pager-prev">
            <span className="pager-label">{'Newer'}</span>
            <span className="pager-title keep">{newer.title}</span>
          </Link>
        ) : <span />}
        {older ? (
          <Link to={`/work/${older.slug}`} rel="next" className="pager-next">
            <span className="pager-label">{'Older'}</span>
            <span className="pager-title keep">{older.title}</span>
          </Link>
        ) : <span />}
        <Link to={`/${home}`} className="pager-back">
          {'Back to'} {SECTIONS[home].name}
        </Link>
      </nav>
    </main>
  )
}
