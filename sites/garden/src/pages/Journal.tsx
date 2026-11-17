import type { MDXComponents } from 'mdx/types'
import { Link, useParams } from 'react-router'
import { Track } from '../components/AudioPlayer'
import { Crumb, ExtLink, Foot, Kick, Newsletter } from '../components/bits'
import { CodeBlock, Embed, Gallery, Img, Model, Pdf, Quote, Video } from '../components/media'
import { READING } from '../content/site'
import { POSTS, postBySlug } from '../content/posts'
import { copyText, fdate } from '../lib/util'
import NotFound from './NotFound'

/** Components available inside every .mdx post without importing them. */
const mdx: MDXComponents = { Img, Gallery, Video, Track, Quote, Pdf, Embed, Model, pre: CodeBlock }

export function Journal() {
  return (
    <>
      <Crumb trail={[[null, 'journal']]} />
      <Kick>{['Journal', `${POSTS.length} posts`]}</Kick>
      <h1 className="pt" tabIndex={-1}>Journal</h1>
      <p className="lede">Essays, notes and things I am still figuring out. The lantern in the garden is lit when there is something new.</p>
      {POSTS.map((p) => (
        <Link key={p.slug} className="post-row" to={`/journal/${p.slug}`}>
          <time dateTime={p.date}>{fdate(p.date)}</time>
          <span>
            <b>{p.title}</b>
            <p>{p.lede}</p>
            <Kick>{[`${p.read} min read`, ...p.tags]}</Kick>
          </span>
        </Link>
      ))}
      <h2><span>Further reading</span></h2>
      <div className="tl narrow-d">{READING.map(([y, t]) => [<time key={y}>{y}</time>, <span key={t}>{t}</span>])}</div>
      <h2><span>Subscribe</span></h2>
      <Newsletter />
      <div className="btns"><ExtLink>RSS feed</ExtLink></div>
      <Foot />
    </>
  )
}

export function Post() {
  const p = postBySlug(useParams().slug)
  if (!p) return <NotFound />
  const others = POSTS.filter((x) => x !== p).slice(0, 2)
  return (
    <>
      <Crumb trail={[['/journal', 'journal'], [null, p.slug]]} />
      <Kick>{[<time dateTime={p.date}>{fdate(p.date)}</time>, `${p.read} min read`, ...p.tags]}</Kick>
      <h1 className="pt" tabIndex={-1}>{p.title}</h1>
      <p className="lede">{p.lede}</p>
      <article className="prose"><p.Body components={mdx} /></article>
      <div className="btns spaced">
        <button type="button" className="b" onClick={() => copyText(location.href, 'Link')}>Copy link</button>
        {p.tags.map((t) => <span key={t} className="b static">#{t}</span>)}
      </div>
      <h2><span>Keep reading</span></h2>
      {others.map((r) => (
        <Link key={r.slug} className="post-row" to={`/journal/${r.slug}`}>
          <time dateTime={r.date}>{fdate(r.date)}</time>
          <span><b>{r.title}</b><p>{r.lede}</p></span>
        </Link>
      ))}
      <h2><span>Letters, every few months</span></h2>
      <Newsletter />
      <Foot />
    </>
  )
}
