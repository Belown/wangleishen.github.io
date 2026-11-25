import { asset } from '../assets'
import { RANDOM, SAMPLE_POSTS } from '../content'
import { Img } from '../media'
import { PageHead, useTitle } from './shared'

export function Feed({ limit, compact }: { limit?: number; compact?: boolean }) {
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
