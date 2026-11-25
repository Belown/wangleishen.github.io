import { imagesIn } from '../assets'
import { PHOTO_CAPTIONS } from '../content'
import { Ph } from '../media'
import { PageHead, useTitle } from './shared'

/** Sample frames shown, labelled, while src/assets/photos/ is empty. */
const SAMPLE_RATIOS = ['4/5', '3/2', '1/1', '2/3', '3/2', '4/3']

export function PhotoWall({ limit, strip }: { limit?: number; strip?: boolean }) {
  const real = imagesIn('photos').slice(0, limit)
  const cls = strip ? 'photo-strip' : 'photo-wall'
  if (real.length === 0) {
    return (
      <ul className={cls}>
        {SAMPLE_RATIOS.slice(0, limit).map((r, i) => (
          <li key={i}><Ph kind="Sample photo" file={`photos/2026-11-0${i + 1}.jpg`} ratio={strip ? '4/5' : r} /></li>
        ))}
      </ul>
    )
  }
  return (
    <ul className={cls}>
      {real.map(([file, url]) => (
        <li key={file}>
          <a href={url} target="_blank" rel="noreferrer">
            <img src={url} alt={PHOTO_CAPTIONS[file] ?? ''} loading="lazy" />
          </a>
          {!strip && PHOTO_CAPTIONS[file] && <p className="cap">{PHOTO_CAPTIONS[file]}</p>}
        </li>
      ))}
    </ul>
  )
}

const photosAreSamples = () => imagesIn('photos').length === 0

export function Photos() {
  useTitle('Photos')
  return (
    <main className="photos">
      <PageHead title="Photos" line="Photographs I have taken." />
      {photosAreSamples() && <p className="sample-line">Sample layout: these frames are placeholders until the real photos are in.</p>}
      <PhotoWall />
    </main>
  )
}
