import type { ReactNode } from 'react'
import { asset } from './assets'
import type { Block, T } from './content'

/*
 * Media blocks. Each one shows the real file when it exists in src/assets/, otherwise a labelled
 * placeholder naming the exact path to drop the file at. Styling is left to each site through the
 * class names below (.ph, .ph-tag, .ph-mid, .fig, .cap, .audio, .pdf, .embed, .quote).
 */

export function Ph({ kind, file, ratio = '16/9', children }: { kind: T; file: string; ratio?: string; children?: ReactNode }) {
  return (
    <div className="ph" style={{ aspectRatio: ratio }} role="img" aria-label={`${kind}: src/assets/${file}`}>
      <span className="ph-tag"><span className="ph-kind">{kind}</span><span className="ph-path">src/assets/{file}</span></span>
      {children && <span className="ph-mid">{children}</span>}
    </div>
  )
}

const K = {
  image: 'Image placeholder',
  video: 'Video placeholder',
}

export function Img({ file, ratio = '16/9', cap, alt = '' }: { file: string; ratio?: string; cap?: T; alt?: string }) {
  const url = asset(file)
  return (
    <figure className="fig">
      {url ? <img src={url} alt={alt} style={{ aspectRatio: ratio }} loading="lazy" /> : <Ph kind={K.image} file={file} ratio={ratio} />}
      {cap && <figcaption className="cap">{cap}</figcaption>}
    </figure>
  )
}

/** Images named <folder>/<n>.jpg, 1…count. */
export function Gallery({ folder, count, ratio = '4/3', cap }: { folder: string; count: number; ratio?: string; cap?: T }) {
  return (
    <figure className="fig gallery">
      <div className="gallery-grid">
        {Array.from({ length: count }, (_, i) => {
          const file = `${folder}/${i + 1}.jpg`
          const url = asset(file)
          return url
            ? <a key={file} href={url} target="_blank" rel="noreferrer"><img src={url} alt="" style={{ aspectRatio: ratio }} loading="lazy" /></a>
            : <Ph key={file} kind={K.image} file={file} ratio={ratio} />
        })}
      </div>
      {cap && <figcaption className="cap">{cap}</figcaption>}
    </figure>
  )
}

export function Video({ file, duration, cap }: { file: string; duration: string; cap?: T }) {
  const url = asset(file)
  return (
    <figure className="fig">
      {url ? <video src={url} controls playsInline preload="metadata" className="video" /> : (
        <Ph kind={K.video} file={file}>
          <PlayIcon />
          <span>Video · {duration}</span>
        </Ph>
      )}
      {cap && <figcaption className="cap">{cap}</figcaption>}
    </figure>
  )
}

export function AudioClip({ file, title }: { file: string; title: T }) {
  const url = asset(file)
  return (
    <div className="audio">
      <span className="audio-title">{title}</span>
      {url ? <audio src={url} controls preload="none" /> : (
        <span className="audio-ph"><PlayIcon /> {'Audio goes at'} <code>src/assets/{file}</code></span>
      )}
    </div>
  )
}

export function Pdf({ file, title, pages }: { file: string; title: T; pages: number }) {
  const url = asset(file)
  return (
    <div className="pdf">
      <span className="pdf-sheet" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
      <span className="pdf-info">
        <b>{title}</b>
        <span>{pages} {pages === 1 ? 'page' : 'pages'} · PDF</span>
        {url ? <a href={url} target="_blank" rel="noreferrer">{'Open PDF'}</a> : <code>src/assets/{file}</code>}
      </span>
    </div>
  )
}

export function Embed({ service, title }: { service: string; title: T }) {
  return (
    <div className="embed">
      <b>{title}</b>
      <span>{service} · add the link in src/content/works.ts</span>
    </div>
  )
}

export function Quote({ text, cite }: { text: T; cite: T }) {
  return (
    <blockquote className="quote">
      {text}
      <cite>{cite}</cite>
    </blockquote>
  )
}

export function YouTube({ id, cap }: { id: string; cap?: T }) {
  return (
    <figure className="fig">
      <iframe
        className="yt"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={cap ?? 'Video'}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {cap && <figcaption className="cap">{cap}</figcaption>}
    </figure>
  )
}

export function Refs({ items }: { items: string[] }) {
  return (
    <div className="refs">
      <h2>{'References'}</h2>
      <ol>{items.map((r) => <li key={r}>{r}</li>)}</ol>
    </div>
  )
}

export function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
    </svg>
  )
}

/** Renders a work's body. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}>{b.text}</p>
          case 'h': return <h2 key={i}>{b.text}</h2>
          case 'img': return <Img key={i} file={b.file} ratio={b.ratio} cap={b.cap} />
          case 'gallery': return <Gallery key={i} folder={b.folder} count={b.count} ratio={b.ratio} cap={b.cap} />
          case 'video': return <Video key={i} file={b.file} duration={b.duration} cap={b.cap} />
          case 'audio': return <AudioClip key={i} file={b.file} title={b.title} />
          case 'quote': return <Quote key={i} text={b.text} cite={b.cite} />
          case 'pdf': return <Pdf key={i} file={b.file} title={b.title} pages={b.pages} />
          case 'embed': return <Embed key={i} service={b.service} title={b.title} />
          case 'refs': return <Refs key={i} items={b.items} />
          case 'youtube': return <YouTube key={i} id={b.id} cap={b.cap} />
        }
      })}
    </>
  )
}
