import { useState } from 'react'
import { Link } from 'react-router'
import { asset } from './assets'
import { OWNER, SECTIONS, SECTION_KEYS, WORKS, type SectionKey, type Work } from './content'
import { useLang } from './i18n'
import { Img } from './media'
import { Links, NewsList, Tx, useTitle } from './ui'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

function Hero() {
  const { tr } = useLang()
  const file = OWNER.heroVideo
  const video = asset(file)
  const still = asset(file.replace(/\.\w+$/, '.jpg'))
  return (
    <section className="hero">
      {video ? (
        <video className="media" src={video} poster={still} autoPlay={!reduced} muted loop playsInline aria-hidden="true" />
      ) : still ? (
        <img className="media" src={still} alt="" />
      ) : (
        <div className="media stand-in" aria-hidden="true"><code>src/assets/{file}</code></div>
      )}
      <div className="id">
        <div>
          <h1>{OWNER.name}{OWNER.nameZh && <span className="zh"> {OWNER.nameZh}</span>}</h1>
          <p><Tx text={OWNER.tagline} /></p>
        </div>
        <a href="#about" className="scroll">{tr('向下', 'Scroll')} ↓</a>
      </div>
    </section>
  )
}

/** Placeholder tone by position in WORKS, so tiles keep their colour when filtered. */
const tone = (slug: string) => WORKS.findIndex((w) => w.slug === slug) % 9

function Tile({ w }: { w: Work }) {
  const { t } = useLang()
  const file = `works/${w.slug}/cover.jpg`
  const url = asset(file)
  return (
    <Link to={`/work/${w.slug}`} className="tile">
      {url ? <img className="img" src={url} alt="" loading="lazy" /> : <span className={`img tone${tone(w.slug)}`} aria-hidden="true"><code>{file}</code></span>}
      <span className="cap">
        <b>{t(w.title)}</b>
        <span>{w.venue ?? w.year} · {t(SECTIONS[w.sec[0]].name)}</span>
      </span>
    </Link>
  )
}

type Filter = 'all' | SectionKey

function WorkGrid() {
  const { t, tr } = useLang()
  const [f, setF] = useState<Filter>('all')
  const list = WORKS.filter((w) => f === 'all' || w.sec.includes(f))
  return (
    <section id="work" className="work-sec">
      <div className="ghead">
        <h2 className="big">{tr('作品精选', 'Selected Work')}</h2>
        <div className="chips" role="group" aria-label={tr('筛选作品', 'Filter work')}>
          {(['all', ...SECTION_KEYS] as Filter[]).map((k) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>
              {k === 'all' ? tr('全部', 'All') : t(SECTIONS[k].name)}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid" aria-live="polite">
        {list.map((w) => <li key={w.slug}><Tile w={w} /></li>)}
      </ul>
    </section>
  )
}

export default function Home() {
  const { tr } = useLang()
  useTitle(null)
  return (
    <main>
      <Hero />
      <div className="wrap">
        <section className="about" id="about">
          <div>
            <p className="eyebrow">{tr('关于', 'About')}</p>
            <p className="lede"><Tx text={OWNER.lede} /></p>
            {OWNER.about.map((p) => <p key={p.en}><Tx text={p} /></p>)}
            <Links />
          </div>
          <Img file={OWNER.portrait} ratio="3/4" cap={OWNER.portraitCap} alt={OWNER.name} />
        </section>
        <WorkGrid />
        <section className="split">
          <h2>{tr('动态', 'News')}</h2>
          <div>
            <NewsList limit={4} />
            <Link className="more" to="/about#news">{tr('全部动态', 'All news')} →</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
