import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { asset, imagesIn } from './assets'
import {
  ABOUT_NAME, HONOURS, ME, OWNER, PHOTO_CAPTIONS, PUBLICATIONS, RANDOM, SAMPLE_NOTE, SAMPLE_POSTS, SECTIONS, SECTION_KEYS, TIMELINE, WORKS,
  whenOf, workBySlug, worksIn, type SectionKey, type T, type Work,
} from './content'
import { Blocks, Img, Ph } from './media'

const BASE_TITLE = OWNER.name
function useTitle(s?: string) {
  useEffect(() => {
    document.title = s ? `${s} · ${BASE_TITLE}` : BASE_TITLE
  }, [s])
}

const newestFirst = (ws: Work[]) => [...ws].sort((a, b) => whenOf(b).localeCompare(whenOf(a)))
const cover = (w: Work) => `works/${w.slug}/cover.jpg`

function Sections({ w }: { w: Work }) {
  return <>{w.sec.map((s) => (SECTIONS[s].name)).join(' / ')}</>
}

/** A work standing in the light: a lit pool on the floor, a catch-light on its top edge, a contact shadow. */
function Piece({ w, link = true, ratio = '4/3', portrait }: { w?: Work; link?: boolean; ratio?: string; portrait?: string }) {
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
function Hero({ w, children, compact }: { w: Work; children: ReactNode; compact?: boolean }) {
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
function Name({ text, level = 1 }: { text: T; level?: 1 | 2 }) {
  const Tag = level === 1 ? 'h1' : 'h2'
  return <Tag className="display keep">{text}</Tag>
}

/* ---------- The self-introduction ---------- */

function Authors({ list }: { list: string[] }) {
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

function CiteLink({ label, href, file }: { label: string; href?: string; file?: string }) {
  const url = href || (file && asset(file))
  return url
    ? <a className="cite-link" href={url} target="_blank" rel="noreferrer">[{label}]</a>
    : <span className="cite-link off" title={'Link not added yet'}>[{label}]</span>
}

function Profile({ page }: { page?: boolean }) {
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
              <dd><a href={`mailto:${OWNER.email}`}>{OWNER.email}</a></dd>
            </div>}
            {OWNER.links.map((l) => (
              <div key={l.label}>
                <dt>{l.label}</dt>
                <dd>
                  {l.href
                    ? <a href={l.href} target="_blank" rel="noreferrer">{l.href.replace(/^https?:\/\//, '')}</a>
                    : <span className="muted">{'Link coming soon'}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {/* The CV becomes a download once the file exists at src/assets/about/cv.pdf (OWNER.cv). */}
          {cv
            ? <a className="cv" href={cv} download>{'Download CV (PDF)'}</a>
            : <span className="cv off" aria-disabled="true">{'CV PDF (coming soon)'}</span>}
        </div>
      </div>
    </section>
  )
}

/* ---------- The works index ---------- */

function WorksIndex({ works, filterable, title }: { works: Work[]; filterable?: boolean; title: T }) {
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

/* ---------- Pages ---------- */

export function Home() {
  useTitle()
  const [newest] = newestFirst(WORKS)
  return (
    <main className="home">
      <Hero w={newest}>
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

export function SectionPage({ k }: { k: SectionKey }) {
  const sec = SECTIONS[k]
  const works = worksIn(k)
  const years = works.map((w) => w.year)
  useTitle((sec.name))
  return (
    <main className="section" key={k}>
      <Hero w={newestFirst(works)[0]} compact>
        <Name text={sec.name} />
        <p className="line keep">{sec.blurb}</p>
        <p className="sample num">
          {works.length} {works.length === 1 ? 'work' : 'works'} · {Math.min(...years)}–{Math.max(...years)}
        </p>
      </Hero>
      <WorksIndex works={works} title={'Works'} />
    </main>
  )
}

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
          <p className="line keep">{w.summary}</p>
          <dl className="facts">
            <Fact label={'Date'}><span className="num">{whenOf(w).replaceAll('-', '.')}</span></Fact>
            {w.venue && <Fact label={'Context'}>{w.venue}</Fact>}
            {w.role && <Fact label={'Role'}>{w.role}</Fact>}
            {w.tools && <Fact label={'Tools'}>{w.tools}</Fact>}
            {w.links && w.links.length > 0 && (
              <Fact label={'Links'}>
                {w.links.map((l, n) => (
                  <span key={l.href}>{n > 0 && ' · '}<a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></span>
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

export function About() {
  useTitle((ABOUT_NAME))
  return (
    <main className="about">
      <Profile page />
    </main>
  )
}

function PageHead({ title, line }: { title: string; line: string }) {
  return (
    <header className="page-head">
      <Name text={title} />
      <p className="line keep">{line}</p>
    </header>
  )
}

/** Sample frames shown, labelled, while src/assets/photos/ is empty. */
const SAMPLE_RATIOS = ['4/5', '3/2', '1/1', '2/3', '3/2', '4/3']

function PhotoWall({ limit, strip }: { limit?: number; strip?: boolean }) {
  const real = imagesIn('photos').slice(0, limit)
  const cls = strip ? 'photo-strip' : 'photo-wall'
  if (real.length === 0) {
    return (
      <ul className={cls}>
        {SAMPLE_RATIOS.slice(0, limit).map((r, i) => (
          <li key={i}><Ph kind="Sample photo" file={`photos/2026-11-0${i + 1}.jpg`} ratio={strip ? '4/5' : r} /></li>
        ))}
      </ul>
    )
  }
  return (
    <ul className={cls}>
      {real.map(([file, url]) => (
        <li key={file}>
          <a href={url} target="_blank" rel="noreferrer">
            <img src={url} alt={PHOTO_CAPTIONS[file] ?? ''} loading="lazy" />
          </a>
          {!strip && PHOTO_CAPTIONS[file] && <p className="cap">{PHOTO_CAPTIONS[file]}</p>}
        </li>
      ))}
    </ul>
  )
}

function Feed({ limit, compact }: { limit?: number; compact?: boolean }) {
  const posts = (RANDOM.length ? [...RANDOM] : SAMPLE_POSTS).sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
  return (
    <ol className={`feed ${compact ? 'compact' : ''}`}>
      {posts.map((p) => (
        <li key={p.date + p.text}>
          <time className="num" dateTime={p.date}>{p.date.replaceAll('-', '.')}</time>
          <p>{p.text}</p>
          {p.image && !compact && <Img file={p.image} ratio={asset(p.image) ? 'auto' : '16/9'} />}
        </li>
      ))}
    </ol>
  )
}

const photosAreSamples = () => imagesIn('photos').length === 0

export function Photos() {
  useTitle('Photos')
  return (
    <main className="photos">
      <PageHead title="Photos" line="Photographs I have taken." />
      {photosAreSamples() && <p className="sample-line">Sample layout: these frames are placeholders until the real photos are in.</p>}
      <PhotoWall />
    </main>
  )
}

export function Random() {
  useTitle('Random')
  return (
    <main className="random">
      <PageHead title="Random" line="Unfiltered: odd ideas, small experiments and whatever else." />
      {RANDOM.length === 0 && <p className="sample-line">Sample posts, until the real ones are in.</p>}
      <Feed />
    </main>
  )
}

/** Home: a glimpse of Photos and Random below the works index. */
function Glimpses() {
  return (
    <>
      <section className="works glimpse" aria-labelledby="g-photos">
        <div className="works-head">
          <h2 id="g-photos" className="works-title">Photos</h2>
          <Link to="/photos" className="see-all">All photos</Link>
        </div>
        <PhotoWall limit={4} strip />
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

export function NotFound() {
  useTitle('Not found')
  return (
    <main className="missing">
      <h1 className="display keep">{'Nothing here'}</h1>
      <p className="line">{'The page you are looking for is not on this site.'}</p>
      <p><Link to="/" className="text-link">{'Back to the start'}</Link></p>
    </main>
  )
}
