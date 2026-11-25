import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { NotFound } from './not-found'
import { PageHead, useTitle } from './shared'

/**
 * The Discogs collection, by year of first release, newest first. scripts/discogs.mjs writes it to /data/ (public/data/ locally;
 * on the server a service refreshes it every few hours), so it is fetched at run time, not built in.
 */
type Rec = {
  id: number; title: string; artist: string; year?: number; original?: number | null; format: string; label?: string; added: string
  cover?: string; catno?: string; country?: string; released?: string; genres?: string[]; tracks?: { pos: string; title: string; dur?: string }[]
}
let recordsLoad: Promise<Rec[]> | undefined
/** The records, or undefined while they load; an empty list when there are none or the list cannot be read. */
export function useRecords() {
  const [recs, setRecs] = useState<Rec[]>()
  useEffect(() => {
    recordsLoad ??= fetch('/data/records.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
    recordsLoad.then(setRecs)
  }, [])
  return recs
}
const SAMPLE_RECORDS: Rec[] = Array.from({ length: 8 }, (_, i) => ({ id: -i - 1, title: 'Album title', artist: 'Artist', year: 2000 + i, format: 'Vinyl, LP', added: '' }))

export function Shelf({ records, limit, strip }: { records?: Rec[]; limit?: number; strip?: boolean }) {
  const recs = (records ? (records.length ? records : SAMPLE_RECORDS) : []).slice(0, limit)
  return (
    <ul className={strip ? 'shelf shelf-strip' : 'shelf'}>
      {recs.map((r) => {
        const sleeve = r.cover
          ? <img src={`/data/${r.cover}`} alt="" loading="lazy" />
          : <span className="sleeve-blank" aria-hidden="true">{r.id < 0 ? 'Sample' : ''}</span>
        return (
          <li key={r.id}>
            {r.id > 0
              ? <Link to={`/records/${r.id}`} className="sleeve" aria-label={`${r.title}, ${r.artist}`}>{sleeve}</Link>
              : <span className="sleeve">{sleeve}</span>}
            <p className="rec-title">{r.title}</p>
            <p className="rec-meta">{r.artist}{(r.original ?? r.year) ? ` · ${r.original ?? r.year}` : ''}</p>
            {!strip && <p className="rec-meta">{r.format}</p>}
          </li>
        )
      })}
    </ul>
  )
}

export function Records() {
  useTitle('Records')
  const records = useRecords()
  return (
    <main className="records">
      <PageHead title="Records" line="The records on my shelf." />
      {records?.length === 0 && <p className="sample-line">Sample layout: the shelf fills in from Discogs once the collection is synced.</p>}
      <Shelf records={records} />
    </main>
  )
}

export function RecordPage() {
  const { id } = useParams()
  const records = useRecords()
  const i = records ? records.findIndex((r) => String(r.id) === id) : -1
  const r = records?.[i]
  useTitle(r ? `${r.title} | Records` : 'Records')
  if (!records) return <main className="record" />
  if (!r) return <NotFound />
  const cover = r.cover && `/data/${r.cover}`
  const newer = records[i - 1], older = records[i + 1]
  const facts: [string, string | undefined][] = [
    ['Released', r.original ? String(r.original) : undefined],
    ['This pressing', r.released?.replace(/-00/g, '').replaceAll('-', '.') ?? (r.year ? String(r.year) : undefined)],
    ['Label', [r.label, r.catno].filter(Boolean).join(' · ') || undefined],
    ['Format', r.format],
    ['Country', r.country],
    ['Genre', r.genres?.join(', ')],
    ['On my shelf since', r.added.replaceAll('-', '.')],
  ]
  return (
    <main className="record">
      <div className="record-top">
        <div className="sleeve record-sleeve">
          {cover ? <img src={cover} alt={`Cover of ${r.title}`} /> : <span className="sleeve-blank" />}
        </div>
        <div className="record-info">
          <h1 className="record-title">{r.title}</h1>
          <p className="record-artist">{r.artist}</p>
          <dl className="record-facts">
            {facts.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <a className="see-all" href={`https://www.discogs.com/release/${r.id}`} target="_blank" rel="noreferrer">View on Discogs</a>
        </div>
      </div>
      {r.tracks && r.tracks.length > 0 && (
        <section className="tracks" aria-labelledby="tracks-h">
          <h2 id="tracks-h" className="works-title">Tracklist</h2>
          <ol>
            {r.tracks.map((t) => (
              <li key={t.pos + t.title}>
                <span className="num">{t.pos}</span>
                <span>{t.title}</span>
                <span className="num">{t.dur}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      <nav className="pager" aria-label="More records">
        {newer ? (
          <Link to={`/records/${newer.id}`} rel="prev" className="pager-prev">
            <span className="pager-label">Newer</span>
            <span className="pager-title">{newer.title}</span>
          </Link>
        ) : <span />}
        {older ? (
          <Link to={`/records/${older.id}`} rel="next" className="pager-next">
            <span className="pager-label">Older</span>
            <span className="pager-title">{older.title}</span>
          </Link>
        ) : <span />}
        <Link to="/records" className="pager-back">All records</Link>
      </nav>
    </main>
  )
}
