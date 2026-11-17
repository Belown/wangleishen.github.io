import type { ReactNode } from 'react'
import { asset } from './assets'
import type { Block, T } from './content'
import { Bi, useLang } from './i18n'

/*
 * Media blocks. Each one shows the real file when it exists in src/assets/, otherwise a labelled
 * placeholder naming the exact path to drop the file at. Styling is left to each site through the
 * class names below (.ph, .ph-tag, .ph-mid, .fig, .cap, .audio, .pdf, .embed, .quote).
 */

export function Ph({ kind, file, ratio = '16/9', children }: { kind: T; file: string; ratio?: string; children?: ReactNode }) {
  const { t } = useLang()
  return (
    <div className="ph" style={{ aspectRatio: ratio }} role="img" aria-label={`${t(kind)}: src/assets/${file}`}>
      <span className="ph-tag"><span>{t(kind)}</span><span className="ph-path">src/assets/{file}</span></span>
      {children && <span className="ph-mid">{children}</span>}
    </div>
  )
}

const K = {
  image: { zh: '图片', en: 'Image' },
  video: { zh: '视频', en: 'Video' },
  audio: { zh: '音频', en: 'Audio' },
  pdf: { zh: 'PDF', en: 'PDF' },
}

export function Img({ file, ratio = '16/9', cap, alt = '' }: { file: string; ratio?: string; cap?: T; alt?: string }) {
  const url = asset(file)
  return (
    <figure className="fig">
      {url ? <img src={url} alt={alt} style={{ aspectRatio: ratio }} loading="lazy" /> : <Ph kind={K.image} file={file} ratio={ratio} />}
      {cap && <figcaption className="cap"><Bi text={cap} /></figcaption>}
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
          return url ? <img key={file} src={url} alt="" style={{ aspectRatio: ratio }} loading="lazy" /> : <Ph key={file} kind={K.image} file={file} ratio={ratio} />
        })}
      </div>
      {cap && <figcaption className="cap"><Bi text={cap} /></figcaption>}
    </figure>
  )
}

export function Video({ file, duration, cap }: { file: string; duration: string; cap?: T }) {
  const { tr } = useLang()
  const url = asset(file)
  return (
    <figure className="fig">
      {url ? <video src={url} controls playsInline preload="metadata" className="video" /> : (
        <Ph kind={K.video} file={file}>
          <PlayIcon />
          <span>{tr('视频', 'Video')} · {duration}</span>
        </Ph>
      )}
      {cap && <figcaption className="cap"><Bi text={cap} /></figcaption>}
    </figure>
  )
}

export function AudioClip({ file, title }: { file: string; title: T }) {
  const { tr } = useLang()
  const url = asset(file)
  return (
    <div className="audio">
      <span className="audio-title"><Bi text={title} /></span>
      {url ? <audio src={url} controls preload="none" /> : (
        <span className="audio-ph"><PlayIcon /> {tr('音频放在', 'Audio goes at')} <code>src/assets/{file}</code></span>
      )}
    </div>
  )
}

export function Pdf({ file, title, pages }: { file: string; title: T; pages: number }) {
  const { tr } = useLang()
  const url = asset(file)
  return (
    <div className="pdf">
      <span className="pdf-sheet" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
      <span className="pdf-info">
        <b><Bi text={title} /></b>
        <span>{pages} {tr('页', 'pages')} · PDF</span>
        {url ? <a href={url} target="_blank" rel="noreferrer">{tr('打开 PDF', 'Open PDF')}</a> : <code>src/assets/{file}</code>}
      </span>
    </div>
  )
}

export function Embed({ service, title }: { service: string; title: T }) {
  const { tr } = useLang()
  return (
    <div className="embed">
      <b><Bi text={title} /></b>
      <span>{service} · {tr('在 content.ts 里填上链接', 'add the link in content.ts')}</span>
    </div>
  )
}

export function Quote({ text, cite }: { text: T; cite: T }) {
  return (
    <blockquote className="quote">
      <Bi text={text} />
      <cite><Bi text={cite} /></cite>
    </blockquote>
  )
}

export function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
    </svg>
  )
}

/** Renders a work's body. Paragraphs and headings are bilingual-aware. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  const { lang } = useLang()
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return lang === 'both'
              ? <div key={i} className="para-pair"><p>{b.text.zh}</p><p lang="en">{b.text.en}</p></div>
              : <p key={i}>{lang === 'zh' ? b.text.zh : b.text.en}</p>
          case 'h': return <h2 key={i}><Bi text={b.text} /></h2>
          case 'img': return <Img key={i} file={b.file} ratio={b.ratio} cap={b.cap} />
          case 'gallery': return <Gallery key={i} folder={b.folder} count={b.count} ratio={b.ratio} cap={b.cap} />
          case 'video': return <Video key={i} file={b.file} duration={b.duration} cap={b.cap} />
          case 'audio': return <AudioClip key={i} file={b.file} title={b.title} />
          case 'quote': return <Quote key={i} text={b.text} cite={b.cite} />
          case 'pdf': return <Pdf key={i} file={b.file} title={b.title} pages={b.pages} />
          case 'embed': return <Embed key={i} service={b.service} title={b.title} />
        }
      })}
    </>
  )
}
