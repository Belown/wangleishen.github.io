import qrcode from 'qrcode-generator'
import { Link } from 'react-router'
import { asset } from '../assets'
import { OWNER } from '../content'
import { useTitle } from './shared'

/** A QR code as one SVG path: dark modules on a light tile, so any phone camera reads it. */
function QR({ text }: { text: string }) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
  return (
    <svg className="qr" viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label="QR code for this contact card">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="var(--ink)" />
      <path d={d} fill="var(--stage)" shapeRendering="crispEdges" />
    </svg>
  )
}

/** vCard text values escape \\ , ; and newlines. */
const vEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')

/** Lines longer than 75 octets fold onto continuation lines that start with a space. */
const vFold = (line: string) => line.length <= 75 ? line : line.slice(0, 75) + (line.slice(75).match(/.{1,74}/g) ?? []).map((l) => '\r\n ' + l).join('')

/**
 * Builds the contact from OWNER when it is saved, so it always carries this site's own address
 * and, once src/assets/about/portrait.jpg exists, the photo.
 */
async function saveContact() {
  const [first, ...rest] = OWNER.name.split(' ')
  const last = rest.join(' ')
  const a = OWNER.address
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${vEsc(last)};${vEsc(first)};;;`, `FN:${vEsc(OWNER.name)}`,
    `ORG:${vEsc(OWNER.org)}`, `TITLE:${vEsc(OWNER.role)}`,
    `EMAIL;TYPE=INTERNET:${OWNER.email}`,
    `URL:${window.location.origin}/`,
  ]
  if (a.street || a.city) lines.push(`ADR;TYPE=WORK:;;${vEsc(a.street)};${vEsc(a.city)};;${vEsc(a.postcode)};${vEsc(a.country)}`)
  OWNER.links.filter((l) => l.href).forEach((l, i) => lines.push(`item${i + 1}.URL:${l.href}`, `item${i + 1}.X-ABLabel:${vEsc(l.label)}`))
  const photo = asset(OWNER.portrait)
  if (photo) {
    try {
      const bytes = new Uint8Array(await (await fetch(photo)).arrayBuffer())
      let bin = ''
      bytes.forEach((b) => { bin += String.fromCharCode(b) })
      lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${btoa(bin)}`)
    } catch { /* no photo is fine */ }
  }
  lines.push('END:VCARD')
  const blob = new Blob([lines.map(vFold).join('\r\n') + '\r\n'], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = OWNER.name.toLowerCase().replace(/\s+/g, '-') + '.vcf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** A contact card to show in person: a business card standing in the light. Scan it, or save the contact. */
function CardRows({ className }: { className: string }) {
  const host = typeof window === 'undefined' ? '' : window.location.host
  const short = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  return (
    <dl className={className}>
      {OWNER.email && <div>
        <dt>Email</dt>
        <dd><button type="button" className="mail" onClick={() => { window.location.href = 'mailto:' + OWNER.email }}>{OWNER.email.replace('@', ' at ')}</button></dd>
      </div>}
      <div>
        <dt>Website</dt>
        <dd><Link to="/">{host}</Link></dd>
      </div>
      {OWNER.links.filter((l) => l.href).map((l) => (
        <div key={l.label}>
          <dt>{l.label}</dt>
          <dd><a href={l.href} target="_blank" rel="noreferrer">{short(l.href!)}</a></dd>
        </div>
      ))}
    </dl>
  )
}

function CardSave() {
  return (
    <div className="biz-save">
      <button type="button" className="cv" onClick={saveContact}>Add to Contacts</button>
      <p>On a phone this opens the contact; tap Create New Contact to save it. If nothing happens, open this page in the phone’s own browser: some in-app browsers block contact files.</p>
    </div>
  )
}

const cardUrl = () => (typeof window === 'undefined' ? '' : window.location.origin + '/card')

/** The ticket: the details sit on the body; the code sits on a stub past a perforation. */
function CardTicket() {
  return (
    <>
      <div className="biz-stage ticket-stage">
        <section className="ticket" aria-label={`${OWNER.name}, contact card`}>
          <div className="ticket-body">
            <h1 className="biz-name">{OWNER.name}</h1>
            <p className="biz-role">{OWNER.role} · {OWNER.org}</p>
            <CardRows className="ticket-rows" />
          </div>
          <div className="ticket-stub">
            <QR text={cardUrl()} />
            <span>Scan to open</span>
          </div>
        </section>
      </div>
      <CardSave />
    </>
  )
}

/** A contact card to show in person: a ticket, the details on its body and the code on its stub. */
export function Card() {
  useTitle('Contact card')
  return (
    <main className="card-page">
      <CardTicket />
    </main>
  )
}
