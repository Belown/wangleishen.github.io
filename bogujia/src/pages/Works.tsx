import { useState } from 'react'
import { Link } from 'react-router'
import { Crumb, Foot, Kick } from '../components/bits'
import { Pdf, Ph } from '../components/media'
import { SECTION_KEYS, SECTIONS, SITE, type SectionKey } from '../content/site'
import { WORKS } from '../content/works'
import { asset } from '../lib/assets'

export default function Works() {
  const [filter, setFilter] = useState<SectionKey | 'all'>('all')
  const list = WORKS.filter((w) => filter === 'all' || w.section === filter)
  return (
    <>
      <Crumb trail={[[null, 'works']]} />
      <Kick>{['Index', `${WORKS.length} works`]}</Kick>
      <h1 className="pt" tabIndex={-1}>Works</h1>
      <p className="lede">Everything in one list: papers, objects, paintings, recordings and toys. Each section is also a stone in the garden.</p>
      <div className="chips" role="group" aria-label="Filter by section">
        {(['all', ...SECTION_KEYS] as const).map((k) => (
          <button key={k} type="button" className="b" aria-pressed={filter === k} onClick={() => setFilter(k)}>
            {k === 'all' ? 'All' : SECTIONS[k].name}
          </button>
        ))}
      </div>
      <div className="rows">
        {list.map((w) => {
          const cover = asset(`works/${w.slug}/cover.jpg`)
          return (
            <Link key={w.slug} to={`/works/${w.slug}`}>
              {cover ? <img src={cover} alt="" className="thumb" /> : <Ph kind="" file="" ratio="16/10" />}
              <span className="row-t"><b>{w.title} {w.beta && <span className="beta">beta</span>}</b><span>{w.summary}</span></span>
              <em>{SECTIONS[w.section].name} · {w.year}</em>
            </Link>
          )
        })}
      </div>
      <h2><span>Portfolios</span></h2>
      <div className="grid2">
        <Pdf file={SITE.portfolio} title="Design portfolio" pages={24} />
        <Pdf file={SITE.cv} title="Curriculum vitae" pages={3} />
      </div>
      <Foot />
    </>
  )
}
