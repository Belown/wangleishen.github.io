import { Crumb, CopyEmail, ExtLink, Foot, Kick } from '../components/bits'
import { Gallery, Img, Ph, Video } from '../components/media'
import { ALBUM_RATIOS, COLLABORATORS, FRIENDS, NEWS, SITE, TEACHING } from '../content/site'
import { asset } from '../lib/assets'
import { toast } from '../store'

export default function About() {
  const cv = asset(SITE.cv)
  return (
    <>
      <Crumb trail={[[null, 'about']]} />
      <Kick>About</Kick>
      <h1 className="pt" tabIndex={-1}>About</h1>
      <div className="grid2 top-align">
        <Img file="about/portrait.jpg" ratio="4/5" note="Portrait, 1200 × 1500" />
        <div className="prose">
          <p className="lede">{SITE.bio}</p>
          <p>{SITE.bioMore}</p>
          <p className="muted mono small">Currently: {SITE.now}</p>
          <div className="btns">
            {cv ? <a className="b solid" href={cv} target="_blank" rel="noreferrer">Download CV</a>
              : <button type="button" className="b solid" onClick={() => toast(`Add your CV at src/assets/${SITE.cv}`)}>Download CV</button>}
            {Object.entries(SITE.links).map(([label, href]) => <ExtLink key={label} href={href}>{label}</ExtLink>)}
          </div>
        </div>
      </div>

      <h2><span>News</span></h2>
      <div className="tl">{NEWS.map(([d, t]) => [<time key={d}>{d}</time>, <span key={t}>{t}</span>])}</div>

      <h2><span>Collaborations</span></h2>
      <div className="grid3">
        {COLLABORATORS.map((c) => {
          const url = asset(`logos/${c}.svg`)
          return url ? <img key={c} src={url} alt={c} className="logo" /> : <Ph key={c} kind="Logo" file={`logos/${c}.svg`} ratio="5/2" />
        })}
      </div>

      <h2><span>Mentorship</span></h2>
      <p className="prose-p">I mentor undergraduate researchers each term. If you are a student interested in soft interfaces, write to me with one thing you made and one question you have.</p>

      <h2><span>Teaching</span></h2>
      <div className="tl">{TEACHING.map(([d, t]) => [<time key={d}>{d}</time>, <span key={t}>{t}</span>])}</div>

      <h2><span>Talk</span></h2>
      <Video file="about/talk.mp4" duration="6:12" note="Speech or interview clip" caption="A short talk about making slow things." />

      <h2><span>Album</span><span>click to enlarge</span></h2>
      <Gallery folder="about/album" name="photo" count={ALBUM_RATIOS.length} ratio={ALBUM_RATIOS} cols="album" caption="Album" />

      <h2><span>Friends</span></h2>
      <div className="friends">{FRIENDS.map((f) => <ExtLink key={f.name} href={f.url} className="friend">{`${f.name}, ${f.what}`}</ExtLink>)}</div>

      <h2><span>Contact</span></h2>
      <CopyEmail />
      <p className="cap">Slow replies, but I read everything.</p>
      <Foot />
    </>
  )
}
