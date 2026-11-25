import { SECTIONS, worksIn, type SectionKey } from '../content'
import { WorksIndex } from './home'
import { Hero, Name, newestFirst, useTitle } from './shared'

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
