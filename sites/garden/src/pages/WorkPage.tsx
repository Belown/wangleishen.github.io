import { Link, useParams } from 'react-router'
import { Track } from '../components/AudioPlayer'
import { Crumb, ExtLink, Foot, Kick, Publication } from '../components/bits'
import { Demo } from '../components/Demos'
import { Embed, Gallery, Img, Model, Pdf, Quote, Video } from '../components/media'
import { SECTIONS, SITE } from '../content/site'
import { SECTION_COPY, WORKS, workBySlug } from '../content/works'
import NotFound from './NotFound'

/** Case-study template. Every block is a placeholder until its file exists in src/assets/works/<slug>/. */
export default function WorkPage() {
  const w = workBySlug(useParams().slug)
  if (!w) return <NotFound />
  const sec = SECTIONS[w.section]
  const copy = SECTION_COPY[w.section]
  const process = w.process ?? copy.process
  const quote = w.quote ?? copy.quote
  const outcome = (w.outcome ?? copy.outcome).replace('{venue}', w.venue).replace('{year}', String(w.year))
  const i = WORKS.indexOf(w)
  const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length]
  const next = WORKS[(i + 1) % WORKS.length]
  const dir = `works/${w.slug}`

  return (
    <>
      <Crumb trail={[['/works', 'works'], [`/${w.section}`, sec.name.toLowerCase()], [null, w.slug]]} />
      <Kick>{[sec.name, w.year, w.beta && <span className="beta">beta</span>, w.award && <span className="award">✦ {w.award}</span>]}</Kick>
      <h1 className="pt" tabIndex={-1}>{w.title}</h1>
      <p className="lede">{w.summary}.</p>

      {w.section === 'music' ? (
        <>
          {w.track && <Track id={w.track} />}
          <Embed service="YouTube" abbr="YT" title={`${w.title} (video)`} note="add the video link" />
        </>
      ) : w.demo ? (
        <div className="box"><Kick>Live demo</Kick><Demo kind={w.demo} /></div>
      ) : (
        <Video file={`${dir}/hero.mp4`} duration="0:24" note="Hero loop. Show the thing moving, muted." loop />
      )}

      <dl className="meta-dl">
        <div><dt>Role</dt><dd>{w.role}</dd></div>
        <div><dt>Team</dt><dd>{w.team}</dd></div>
        <div><dt>Year</dt><dd>{w.year}</dd></div>
        <div><dt>{w.section === 'research' ? 'Venue' : 'Type'}</dt><dd>{w.venue}</dd></div>
        <div><dt>Tools &amp; materials</dt><dd>{w.tools}</dd></div>
      </dl>

      <div className="prose">
        <h2><span>Context</span></h2>
        <p>It started with a question: {w.question}</p>
        <Img file={`${dir}/context.jpg`} note="Context photo or first sketch" caption="Where it began." />
        <h2><span>Process</span></h2>
        <p>{process[0]}</p>
        <Gallery folder={dir} name="process" count={3} caption="Process, left to right." />
        <p>{process[1]}</p>
        {w.model && <Model file={`${dir}/model.glb`} />}
        {w.track && w.section !== 'music' && <Track id={w.track} />}
        <Quote cite={quote[1]}>{quote[0]}</Quote>
        <h2><span>Outcome</span></h2>
        <p>{outcome}</p>
        <Img file={`${dir}/final.jpg`} ratio="3/2" note="Final photo, best light" caption="The finished piece." />
      </div>

      {w.section === 'research' && (
        <>
          <h2><span>Paper</span></h2>
          <Publication w={w} />
          <Pdf file={`${dir}/paper.pdf`} title={`${w.title}: ${w.summary}`} pages={10} />
        </>
      )}

      <h2><span>Credits</span></h2>
      <p className="muted">{w.role}: {SITE.name}. {w.team}. Photography: placeholder. Thanks to everyone who held a prototype.</p>
      <div className="btns"><ExtLink>Project page</ExtLink><ExtLink>Code</ExtLink><ExtLink>Press kit</ExtLink></div>

      <nav className="pn" aria-label="More works">
        <Link to={`/works/${prev.slug}`}><span>← previous</span><b>{prev.title}</b></Link>
        <Link to={`/works/${next.slug}`}><span>next →</span><b>{next.title}</b></Link>
      </nav>
      <Foot />
    </>
  )
}
