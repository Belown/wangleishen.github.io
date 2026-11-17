import { lazy, Suspense, type ReactNode } from 'react'
import { asset } from '../lib/assets'
import { copyText } from '../lib/util'
import { toast, useStore, type LightboxItem } from '../store'

const ModelViewer = lazy(() => import('./ModelViewer'))

/** Hatched placeholder showing what goes here and the file path that will replace it. */
export function Ph({ kind, file, ratio, note, onClick, children, className = '' }: {
  kind: string; file: string; ratio: string; note?: ReactNode; onClick?: () => void; children?: ReactNode; className?: string
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag type={onClick ? 'button' : undefined} className={`ph ${className}`} style={{ aspectRatio: ratio }} onClick={onClick}
      aria-label={onClick ? `${kind} placeholder: ${file}` : undefined}>
      <span className="ph-tag" title={file && `src/assets/${file}`}>
        <span>{kind}</span>
        <span className="ph-path"><bdi>{file && `src/assets/${file}`}</bdi></span>
      </span>
      {(note || children) && <span className="ph-mid">{children}{note}</span>}
    </Tag>
  )
}

const openBox = (items: LightboxItem[], i: number) => useStore.getState().openLightbox(items, i)

export function Img({ file, ratio = '16/9', note = 'Replace with your image', caption, alt = '' }: {
  file: string; ratio?: string; note?: string; caption?: ReactNode; alt?: string
}) {
  const url = asset(file)
  const item = { file, url, ratio, caption: typeof caption === 'string' ? caption : undefined }
  return (
    <figure className="fig">
      {url ? (
        <button type="button" className="media-btn" onClick={() => openBox([item], 0)}>
          <img src={url} alt={alt} style={{ aspectRatio: ratio }} loading="lazy" />
        </button>
      ) : (
        <Ph kind="Image" file={file} ratio={ratio} note={note} onClick={() => openBox([item], 0)} />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** A set of images named `<folder>/<name>-1.jpg`, `-2.jpg`, … */
export function Gallery({ folder, name = 'image', count, ratio = '4/3', caption, cols = 3, labels }: {
  folder: string; name?: string; count: number; ratio?: string | string[]; caption?: string; cols?: 2 | 3 | 'album'; labels?: string[]
}) {
  const items: LightboxItem[] = Array.from({ length: count }, (_, i) => {
    const file = `${folder}/${name}-${i + 1}.jpg`
    const r = Array.isArray(ratio) ? ratio[i % ratio.length] : ratio
    return { file, url: asset(file), ratio: r, caption: labels?.[i] ?? `${caption ?? name} · ${i + 1}/${count}` }
  })
  return (
    <figure className="fig">
      <div className={cols === 'album' ? 'album' : `grid${cols}`}>
        {items.map((it, i) =>
          it.url ? (
            <button key={it.file} type="button" className="media-btn" onClick={() => openBox(items, i)}>
              <img src={it.url} alt="" style={{ aspectRatio: it.ratio }} loading="lazy" />
            </button>
          ) : (
            <Ph key={it.file} kind="Image" file={it.file} ratio={it.ratio} onClick={() => openBox(items, i)} />
          ),
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function Video({ file, duration = '0:00', note = 'Video', caption, loop }: {
  file: string; duration?: string; note?: string; caption?: ReactNode; loop?: boolean
}) {
  const url = asset(file)
  return (
    <figure className="fig">
      {url ? (
        loop ? <video src={url} autoPlay muted loop playsInline className="vid" /> : <video src={url} controls playsInline preload="metadata" className="vid" />
      ) : (
        <Ph kind="Video" file={file} ratio="16/9" onClick={() => toast(`Add ${file} to src/assets to show the video here`)}>
          <span className="play">▶</span>
          {note}
          <span className="vbar"><span>0:00</span><i /><span>{duration}</span></span>
        </Ph>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function Pdf({ file, title, pages }: { file: string; title: string; pages?: number }) {
  const url = asset(file)
  const open = () => (url ? window.open(url, '_blank', 'noopener') : toast(`Add ${file} to src/assets to link it here`))
  return (
    <div className="pdfrow">
      <button type="button" className="ph pdf" onClick={open} aria-label={`Open ${title}`}>
        <span className="ph-tag"><span>PDF</span><span>{pages ? `${pages} pp` : ''}</span></span>
        <i className="t" />
        {Array.from({ length: 11 }, (_, i) => <i key={i} />)}
      </button>
      <div>
        <b className="w5">{title}</b>
        <div className="muted mono small">src/assets/{file}</div>
        <button type="button" className="b" onClick={open}>{url ? 'Open PDF ↗' : 'Download PDF'}</button>
      </div>
    </div>
  )
}

export function Embed({ service, abbr, title, note = '', href }: { service: string; abbr: string; title: string; note?: string; href?: string }) {
  const inner = (
    <>
      <span className="ic">{abbr}</span>
      <span className="embed-t"><b>{title} ↗</b><span>EMBED · {service}{note && ` · ${note}`}</span></span>
    </>
  )
  return href ? (
    <a className="embed" href={href} target="_blank" rel="noreferrer">{inner}</a>
  ) : (
    <button type="button" className="embed" onClick={() => toast(`Add a ${service} link for “${title}”`)}>{inner}</button>
  )
}

export const Quote = ({ children, cite }: { children: ReactNode; cite?: string }) => (
  <blockquote className="q">“{children}”{cite && <cite>{cite}</cite>}</blockquote>
)

/** MDX maps fenced code blocks here: adds a copy button. */
export function CodeBlock(props: { children?: ReactNode }) {
  const child = props.children as { props?: { children?: string; className?: string } } | undefined
  const text = String(child?.props?.children ?? '').replace(/\n$/, '')
  return (
    <div className="codewrap">
      <button type="button" className="b" onClick={() => copyText(text, 'Code')}>Copy</button>
      <pre className="code">{text}</pre>
    </div>
  )
}

export function Model({ file, caption = 'Drag to turn.' }: { file: string; caption?: string }) {
  const url = asset(file)
  return (
    <figure className="fig">
      <div className="ph mv" style={{ aspectRatio: '16/10' }}>
        <span className="ph-tag"><span>3D model</span><span>{url ? file : `src/assets/${file}`}</span></span>
        <Suspense fallback={<span className="ph-mid">Loading 3D…</span>}>
          <ModelViewer url={url} />
        </Suspense>
      </div>
      <figcaption>{url ? caption : `${caption} Placeholder shape until ${file} exists.`}</figcaption>
    </figure>
  )
}
