import { useState } from 'react'
import { Link } from 'react-router'
import { asset } from '../assets'
import { HONOURS, OWNER, PUBLICATIONS, SAMPLE_NOTE, SECTIONS, SECTION_KEYS, TIMELINE, WORKS, worksIn, type SectionKey, type T, type Work } from '../content'
import { Blocks, Img } from '../media'
import { PhotoWall } from './photos'
import { Feed } from './random'
import { Shelf, useRecords } from './records'
import { Authors, CiteLink, Hero, Name, Sections, cover, newestFirst, useTitle } from './shared'

/* ---------- The self-introduction ---------- */

export function Profile({ page }: { page?: boolean }) {
  const H = page ? 'h2' : 'h3'
  const cv = asset(OWNER.cv)
  return (
    <section className="profile" id="profile" aria-labelledby="profile-h">
      <header className="profile-head">
        {page
          ? <h1 id="profile-h" className="profile-title keep">{OWNER.hello}</h1>
          : <h2 id="profile-h" className="profile-title keep">{OWNER.hello}</h2>}
        {SAMPLE_NOTE && <p className="sample">{SAMPLE_NOTE}</p>}
      </header>

      <div className="row">
        <H className="row-h">{'Bio and research interests'}</H>
        <div className="row-body">
          <div className="bio">
            <Blocks blocks={OWNER.about.map((text) => ({ type: 'p' as const, text }))} />
          </div>
          <ul className="tags">
            {OWNER.interests.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </div>

      <div className="row">
        <H className="row-h">{'Education and experience'}</H>
        <ol className="row-body timeline">
          {TIMELINE.map((e) => (
            <li key={e.when + e.title}>
              <span className="when num">{e.when}</span>
              <span className="what">
                <b className="keep">{e.title}</b>
                <span className="keep">{e.place}</span>
                {e.note && <span className="muted keep">{e.note}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {PUBLICATIONS.length > 0 && <div className="row">
        <H className="row-h">{'Publications'}</H>
        <ol className="row-body pubs">
          {PUBLICATIONS.map((p) => (
            <li key={p.title}>
              <span lang="en">
                <Authors list={p.authors} />. {p.year}.{' '}
                {p.work
                  ? <Link to={`/work/${p.work}`} className="pub-title">{p.title}</Link>
                  : <span className="pub-title">{p.title}</span>}
                . In <i>{p.venue}</i>.
              </span>
              {p.award && <span className="award">{p.award}</span>}
              <span className="cite-links">
                {p.links.map((l) => <CiteLink key={l.label} {...l} />)}
              </span>
            </li>
          ))}
        </ol>
      </div>}

      {HONOURS.length > 0 && <div className="row">
        <H className="row-h">{'Honours'}</H>
        <ul className="row-body honours">
          {HONOURS.map((h) => (
            <li key={h.title}>
              <span className="when num">{h.year}</span>
              <span className="keep">{h.title}</span>
            </li>
          ))}
        </ul>
      </div>}

      <div className="row">
        <H className="row-h">{'Contact'}</H>
        <div className="row-body contact">
          <dl>
            {OWNER.email && <div>
              <dt>{'Email'}</dt>
              <dd><button type="button" className="mail" onClick={() => { window.location.href = 'mailto:' + OWNER.email }}>{OWNER.email.replace('@', ' at ')}</button></dd>
            </div>}
            {OWNER.links.map((l) => (
              <div key={l.label}>
                <dt>{l.label}</dt>
                <dd>
                  {l.href
                    ? <a href={l.href} target="_blank" rel="noreferrer">{l.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>
                    : <span className="muted">{'Link coming soon'}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {/* The CV becomes a download once the file exists at src/assets/about/cv.pdf (OWNER.cv). */}
          <Link to="/card" className="see-all card-link">Contact card</Link>
          {cv
            ? <a className="cv" href={cv} download>{'Download CV (PDF)'}</a>
            : <span className="cv off" aria-disabled="true">{'CV PDF (coming soon)'}</span>}
        </div>
      </div>
    </section>
  )
}

/* ---------- The works index ---------- */

export function WorksIndex({ works, filterable, title }: { works: Work[]; filterable?: boolean; title: T }) {
  const [f, setF] = useState<SectionKey | 'all'>('all')
  const shown = newestFirst(f === 'all' ? works : works.filter((w) => w.sec.includes(f)))
  return (
    <section className="works" id="works" aria-labelledby="works-h">
      <div className="works-head">
        <h2 id="works-h" className="works-title">{title}</h2>
        {filterable && (
          <div className="filter" role="group" aria-label={'Filter by section'}>
            {(['all', ...SECTION_KEYS] as const).map((k) => (
              <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>
                {k === 'all' ? 'All' : (SECTIONS[k].name)}
                <span className="count num">{k === 'all' ? works.length : worksIn(k).length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className="rows">
        {shown.map((w) => (
          <li key={w.slug}>
            <Link to={`/work/${w.slug}`} className="row-link">
              <span className="thumb" aria-hidden="true"><Img file={cover(w)} ratio="4/3" /></span>
              <span className="row-main">
                <span className="row-title keep">{w.title}</span>
                <span className="row-sum keep">{w.summary}</span>
                <span className="row-meta"><span className="num">{w.year}</span><span className="dot">·</span><Sections w={w} /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Home() {
  useTitle()
  return (
    <main className="home">
      <Hero>
        <Name text={OWNER.name} />
        <p className="name-zh" lang="zh-CN">{OWNER.nameZh}</p>
        <p className="line keep">{OWNER.line}</p>
      </Hero>
      <Profile />
      <WorksIndex works={WORKS} filterable title={'Works'} />
      <Glimpses />
    </main>
  )
}

/** Home: a glimpse of Photos, Records and Random below the works index. */
function Glimpses() {
  const records = useRecords()
  return (
    <>
      <section className="works glimpse" aria-labelledby="g-photos">
        <div className="works-head">
          <h2 id="g-photos" className="works-title">Photos</h2>
          <Link to="/photos" className="see-all">All photos</Link>
        </div>
        <PhotoWall limit={4} strip />
      </section>
      <section className="works glimpse" aria-labelledby="g-records">
        <div className="works-head">
          <h2 id="g-records" className="works-title">Records</h2>
          <Link to="/records" className="see-all">All records</Link>
        </div>
        <Shelf records={records} limit={6} strip />
      </section>
      <section className="works glimpse" aria-labelledby="g-random">
        <div className="works-head">
          <h2 id="g-random" className="works-title">Random</h2>
          <Link to="/random" className="see-all">All posts</Link>
        </div>
        <Feed limit={3} compact />
      </section>
    </>
  )
}
