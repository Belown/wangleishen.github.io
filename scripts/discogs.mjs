// Pulls the Discogs collection for the Records page.
//   npm run records                 fetch what is new, then rebuild the page data
//   npm run records -- --offline    rebuild the page data from the saved responses only, no network
// Everything Discogs returns is kept in RAW_DIR (data/discogs/ locally): the collection, every release and every
// master, in full. A release is fetched once; to show more of it, change build() below and rebuild offline.
// The page data goes to RECORDS_DIR (public/data/ locally, which Vite serves): records.json and covers/<release id>.jpg.
// On the server the records service in docker-compose.yml runs this every 6 hours.
// A cover you choose yourself goes in record-covers/<release id>.jpg (committed); it replaces Discogs' on every run.
// Needs DISCOGS_USER; the collection must be public unless DISCOGS_TOKEN is set too.
import { copyFile, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const raw = process.env.RAW_DIR || 'data/discogs'
const out = process.env.RECORDS_DIR || 'public/data'
const mine = process.env.COVERS_DIR || 'record-covers'
const offline = process.argv.includes('--offline')
const user = process.env.DISCOGS_USER
const token = process.env.DISCOGS_TOKEN
if (!user && !offline) { console.error('Set DISCOGS_USER in .env (your Discogs user name).'); process.exit(1) }

const headers = { 'User-Agent': 'PersonalSiteRecords/1.0', ...(token && { Authorization: `Discogs token=${token}` }) }
const pause = () => new Promise((ok) => setTimeout(ok, 1100)) // stay under Discogs' rate limit
const get = async (url) => {
  let r = await fetch(url, { headers })
  for (let tries = 0; r.status === 429 && tries < 5; tries++) { // rate limited: Discogs counts requests per minute
    await new Promise((ok) => setTimeout(ok, 61000))
    r = await fetch(url, { headers })
  }
  if (r.status === 403 && !token) {
    console.error(`The Discogs collection of ${user} is private: make it public (Discogs Settings > Privacy) or set DISCOGS_TOKEN in .env.`)
    process.exit(1)
  }
  if (!r.ok) { console.error(`${r.status} ${url}\n${await r.text()}`); process.exit(1) }
  return r
}
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))
// Write then rename, so a reader (the server) never sees a half-written file.
const save = async (file, data) => {
  await writeFile(file + '.tmp', typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2) + '\n')
  await rename(file + '.tmp', file)
}
/** Saved response at raw/<kind>/<id>.json, fetched once. */
const cached = async (kind, id) => {
  const file = `${raw}/${kind}/${id}.json`
  if (existsSync(file)) return readJson(file)
  if (offline) return undefined
  const data = await (await get(`https://api.discogs.com/${kind}/${id}`)).json()
  await save(file, data)
  await pause()
  return data
}

await mkdir(`${raw}/releases`, { recursive: true })
await mkdir(`${raw}/masters`, { recursive: true })
await mkdir(`${out}/covers`, { recursive: true })

// 1. The collection, in full (dates added, folders, ratings and notes come with it).
let collection
if (offline) collection = await readJson(`${raw}/collection.json`)
else {
  collection = []
  for (let page = 1, pages = 1; page <= pages; page++) {
    const j = await (await get(`https://api.discogs.com/users/${encodeURIComponent(user)}/collection/folders/0/releases?per_page=100&page=${page}&sort=added&sort_order=desc`)).json()
    pages = j.pagination.pages
    collection.push(...j.releases)
  }
  await save(`${raw}/collection.json`, collection)
}

// 2. Every release and its master, in full; then the cover the page shows.
const clean = (name) => name.replace(/ \(\d+\)$/, '') // Discogs tells same-name artists apart with "(2)"
const artists = (list) => list.map((a, i) => clean(a.anv || a.name) + (i < list.length - 1 ? (a.join && a.join !== ',' ? ` ${a.join} ` : ', ') : '')).join('')

/** One record as the page shows it: c is the collection entry, d the release, m its master. */
const build = (c, d, m) => {
  const b = c.basic_information
  return {
    id: c.id,
    title: b.title,
    artist: artists(b.artists),
    year: b.year || undefined,
    // The album's first release (a 2023 reissue of a 1997 album is from 1997); the page sorts by it.
    original: m?.year || b.year || null,
    format: b.formats.map((f) => [f.name, ...(f.descriptions ?? [])].join(', ')).join(' + '),
    label: b.labels[0] && clean(b.labels[0].name),
    catno: d?.labels?.[0]?.catno,
    country: d?.country || undefined,
    released: d?.released || undefined,
    genres: d?.styles?.length ? d.styles : d?.genres ?? b.genres, // styles are the specific ones (City Pop, not Pop)
    tracks: d?.tracklist?.filter((t) => t.type_ === 'track').map((t) => ({ pos: t.position, title: t.title, dur: t.duration || undefined })),
    added: c.date_added.slice(0, 10),
  }
}

const records = []
for (const c of collection) {
  const b = c.basic_information
  const d = await cached('releases', c.id)
  const m = b.master_id ? await cached('masters', b.master_id) : undefined
  const r = build(c, d, m)
  const cover = `${out}/covers/${c.id}.jpg`
  // ponytail: delete covers/<id>.jpg by hand after removing an override, or the override stays until the record leaves
  if (existsSync(`${mine}/${c.id}.jpg`)) await copyFile(`${mine}/${c.id}.jpg`, cover)
  else if (!offline && b.cover_image && !b.cover_image.includes('spacer.gif') && !existsSync(cover)) {
    await save(cover, Buffer.from(await (await get(b.cover_image)).arrayBuffer()))
    await pause()
  }
  if (existsSync(cover)) r.cover = `covers/${c.id}.jpg`
  records.push(r)
}

// 3. Covers of records no longer in the collection go; their saved responses stay in raw/.
const keep = new Set(collection.map((c) => `${c.id}.jpg`))
for (const f of await readdir(`${out}/covers`)) if (!keep.has(f)) await rm(`${out}/covers/${f}`)

records.sort((a, b) => (b.original ?? 0) - (a.original ?? 0) || b.added.localeCompare(a.added))
await save(`${out}/records.json`, records)
console.log(`${new Date().toISOString()} ${records.length} records in ${out}/, responses in ${raw}/`)
