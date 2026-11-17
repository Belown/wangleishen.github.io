import { Link } from 'react-router'
import { Track } from '../components/AudioPlayer'
import { Crumb, ExtLink, Foot, Kick, Publication } from '../components/bits'
import { Demo } from '../components/Demos'
import { Gallery, Img, Ph, Video } from '../components/media'
import { SECTIONS, type SectionKey } from '../content/site'
import { WORKS, type Work } from '../content/works'
import { asset } from '../lib/assets'

function Cover({ w, ratio = '4/3', kind = 'Image', name = 'cover.jpg' }: { w: Work; ratio?: string; kind?: string; name?: string }) {
  const file = `works/${w.slug}/${name}`
  const url = asset(file)
  return url ? <img src={url} alt="" style={{ aspectRatio: ratio }} className="cover-img" loading="lazy" /> : <Ph kind={kind} file={file} ratio={ratio} />
}

export default function Section({ k }: { k: SectionKey }) {
  const s = SECTIONS[k]
  const works = WORKS.filter((w) => w.section === k)
  return (
    <>
      <Crumb trail={[['/works', 'works'], [null, s.name.toLowerCase()]]} />
      <Kick>{['Section', `${works.length} works`]}</Kick>
      <h1 className="pt" tabIndex={-1}>{s.name}</h1>
      <p className="lede">{s.intro}</p>

      {k === 'research' && (
        <>
          <h2><span>Publications</span><span>{works.length}</span></h2>
          {works.map((w) => <Publication key={w.slug} w={w} />)}
          <h2><span>Talks</span></h2>
          <Video file="research/talk-chi-2026.mp4" duration="18:40" note="Conference talk recording" caption="CHI 2026, Barcelona. 18 minutes plus questions." />
        </>
      )}

      {k === 'design' && (
        <>
          <h2><span>Projects</span></h2>
          <div className="grid2">
            {works.map((w) => (
              <Link key={w.slug} className="card" to={`/works/${w.slug}`}>
                <Cover w={w} />
                <b>{w.title}</b>
                <span>{w.summary}. {w.tools}.</span>
              </Link>
            ))}
          </div>
          <Img file="design/workshop-bench.jpg" ratio="21/9" note="Wide workshop photo" caption="The bench where most of these were made." />
        </>
      )}

      {k === 'art' && (
        <>
          <h2><span>Works</span></h2>
          <div className="album">
            {works.map((w, i) => (
              <Link key={w.slug} className="card" to={`/works/${w.slug}`}>
                <Cover w={w} ratio={i % 2 ? '3/4' : '4/5'} />
                <b>{w.title}</b>
                <span>{w.summary}</span>
              </Link>
            ))}
          </div>
          <h2><span>Studio</span></h2>
          <Gallery folder="art/studio" name="studio" count={4} ratio={['1/1', '4/3', '3/4', '1/1']} cols="album" caption="Studio" />
        </>
      )}

      {k === 'music' && (
        <>
          <h2><span>Recordings</span></h2>
          {works.map((w) => (
            <div className="box" key={w.slug}>
              <Kick>{[w.venue, w.year, w.duration]}</Kick>
              <h3 className="box-t"><Link to={`/works/${w.slug}`}>{w.title}</Link></h3>
              <div className="muted">{w.summary}</div>
              {w.track && <Track id={w.track} />}
              <div className="btns">
                <ExtLink>YouTube</ExtLink>
                <ExtLink>Bilibili</ExtLink>
                <ExtLink>Sheet music</ExtLink>
              </div>
            </div>
          ))}
          <h2><span>Live</span></h2>
          <Video file="music/live-zurich-2024.mp4" duration="24:10" note="Full concert, one camera" caption="Zürich, November 2024." />
          <h2><span>Currently learning</span></h2>
          <p className="prose-p">Ravel, <i>Pavane pour une infante défunte</i>. Chopin, Nocturne in E-flat, Op. 9 No. 2. Slowly.</p>
        </>
      )}

      {k === 'experiments' && (
        <>
          <h2><span>Toys</span></h2>
          <div className="grid2">
            {works.map((w) => (
              <div className="box flush" key={w.slug}>
                <Cover w={w} ratio="16/9" name="screenshot.png" kind="Screenshot" />
                <h3 className="box-t small-t"><Link to={`/works/${w.slug}`}>{w.title}</Link> {w.beta && <span className="beta">beta</span>}</h3>
                <div className="muted">{w.summary}</div>
                {w.demo ? <Demo kind={w.demo} /> : <div className="btns"><ExtLink>Launch</ExtLink></div>}
              </div>
            ))}
          </div>
        </>
      )}
      <Foot />
    </>
  )
}
