import { useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { OWNER, SECTIONS, SECTION_KEYS, workBySlug, type SectionKey, type Work } from './content'
import { Bi, useLang } from './i18n'
import { Arrow, Badge, Both, LineChips, LineStrip, NETWORK_YEAR, useTitle } from './metro'

/*
 * Network geometry, in viewBox units (1200 x 760). Lines run on 0/45/90 degree segments.
 * The top-right, bottom-left and bottom-right corners stay clear for the title, legend and
 * passenger panel. Along each line, stations sit in date order (oldest at the line's start).
 */
const PATHS: Record<SectionKey, string> = {
  research: 'M130 400H880',
  design: 'M90 300H540L760 520',
  art: 'M110 110H270L400 240V400',
  writing: 'M760 700V520L880 400',
}

/** Line badge beside each line's first station. */
const TERMINI: Record<SectionKey, [number, number]> = {
  research: [84, 400],
  design: [42, 300],
  art: [62, 110],
  writing: [760, 742],
}

type Anchor = 'start' | 'middle' | 'end'
/** slug: [station x, y, label x, primary label baseline, anchor]. Secondary label sits 16 below. */
const STATIONS: [string, number, number, number, number, Anchor][] = [
  ['slow-mail', 130, 400, 130, 434, 'middle'],
  ['hum-atlas', 400, 400, 400, 434, 'middle'],
  ['softfold', 640, 400, 656, 366, 'start'],
  ['soft-machines', 880, 400, 902, 398, 'start'],
  ['warm-cup', 90, 300, 90, 268, 'middle'],
  ['paper-synth', 205, 300, 205, 268, 'middle'],
  ['tidal-clock', 320, 300, 320, 268, 'middle'],
  ['night-garden', 400, 300, 418, 266, 'start'],
  ['mood-weather', 760, 520, 742, 542, 'end'],
  ['small-hours', 110, 110, 110, 144, 'middle'],
  ['lake-frames', 215, 110, 215, 80, 'middle'],
  ['goldberg-aria', 335, 175, 352, 150, 'start'],
  ['notes-from-uist', 760, 610, 742, 607, 'end'],
  ['slow-interfaces', 760, 700, 742, 697, 'end'],
]

type Tip = { w: Work; x: number; y: number }

export default function Home() {
  const { lang, tr, pri } = useLang()
  const navigate = useNavigate()
  const canvas = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState<SectionKey[] | null>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')
  useTitle()

  const en = lang === 'en'
  const isOn = (secs: SectionKey[]) => !!hot && secs.some((s) => hot.includes(s))

  function show(w: Work, el: Element) {
    const box = canvas.current?.getBoundingClientRect()
    const dot = el.querySelector('.stn-dot')?.getBoundingClientRect()
    setHot(w.sec)
    if (box && dot) setTip({ w, x: dot.left + dot.width / 2 - box.left, y: dot.top - box.top })
  }
  function hide() {
    setHot(null)
    setTip(null)
  }
  const go = (slug: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(`/work/${slug}`)
  }

  // Keep the tooltip inside the map; its pointer still aims at the station.
  const tipW = canvas.current?.clientWidth ?? 0
  const tipX = tip ? Math.min(Math.max(tip.x, 150), Math.max(tipW - 150, 150)) : 0

  return (
    <main className="home" data-view={view}>
      <header className="title-block">
        <h1 className="owner">
          <Both text={OWNER.name} />
        </h1>
        <p className="network-name">
          <Both text={{ zh: `作品线网 ${NETWORK_YEAR}`, en: `Works network ${NETWORK_YEAR}` }} />
        </p>
        <p className="bio">
          <Bi text={OWNER.bio} />
        </p>
      </header>

      <div className="view-toggle" role="group" aria-label={tr('显示方式', 'View')}>
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
          {tr('线网图', 'Map')}
        </button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
          {tr('线路列表', 'Line list')}
        </button>
      </div>

      <div className="map-scroll">
        <div className={`map ${hot ? 'dim' : ''}`} ref={canvas} onMouseLeave={hide}>
          <svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid meet" role="group" aria-label={tr('作品线网图', 'Works network map')}>
            <g aria-hidden="true">
              {SECTION_KEYS.map((k) => (
                <path key={k} className={`line ln-${k} ${isOn([k]) ? 'on' : ''}`} d={PATHS[k]} />
              ))}
              {SECTION_KEYS.map((k) => {
                const [x, y] = TERMINI[k]
                return (
                  <g key={k} className={`term ln-${k} ${isOn([k]) ? 'on' : ''}`}>
                    <rect x={x - 15} y={y - 15} width="30" height="30" rx="6" />
                    <text x={x} y={y + 7} textAnchor="middle">{SECTION_KEYS.indexOf(k) + 1}</text>
                  </g>
                )
              })}
            </g>
            {STATIONS.map(([slug, cx, cy, lx, ly, anchor]) => {
              const w = workBySlug(slug)!
              const x = w.sec.length > 1
              const a = en ? w.title.en : w.title.zh
              const b = en ? w.title.zh : w.title.en
              const label = `${pri(w.title)}, ${w.year}, ${w.sec.map((s) => pri(SECTIONS[s].name)).join(' · ')}`
              return (
                <a
                  key={slug}
                  href={`/work/${slug}`}
                  className={`stn ln-${w.sec[0]} ${x ? 'x' : ''} ${isOn(w.sec) ? 'on' : ''}`}
                  aria-label={label}
                  onClick={go(slug)}
                  onMouseEnter={(e) => show(w, e.currentTarget)}
                  onMouseLeave={hide}
                  onFocus={(e) => show(w, e.currentTarget)}
                  onBlur={hide}
                >
                  <circle className="stn-hit" cx={cx} cy={cy} r="20" />
                  <circle className="stn-ring" cx={cx} cy={cy} r={x ? 17 : 14} />
                  <circle className="stn-dot" cx={cx} cy={cy} r={x ? 10 : 7} />
                  <text className="stn-a" x={lx} y={ly} textAnchor={anchor}>{a}</text>
                  <text className="stn-b" x={lx} y={ly + 16} textAnchor={anchor}>{b}</text>
                </a>
              )
            })}
          </svg>
          {tip && (
            <div
              className={`tip ${tip.y < 110 ? 'below' : ''}`}
              aria-hidden="true"
              style={{ left: tipX, top: tip.y, ['--px' as string]: `${tip.x - tipX}px` }}
            >
              <b className="tip-title">
                <Bi text={tip.w.title} />
              </b>
              <span className="tip-year">{tip.w.year}</span>
              <LineChips w={tip.w} />
            </div>
          )}
        </div>
      </div>

      <section className="legend" aria-label={tr('图例', 'Legend')}>
        <ul>
          {SECTION_KEYS.map((k) => (
            <li key={k}>
              <Link
                to={`/${k}`}
                className={`legend-line ln-${k}`}
                onMouseEnter={() => setHot([k])}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot([k])}
                onBlur={() => setHot(null)}
              >
                <Badge k={k} />
                <span className="legend-swatch" aria-hidden="true" />
                <Bi text={SECTIONS[k].name} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="legend-key">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="#fff" stroke="currentColor" strokeWidth="3.5" />
          </svg>
          <Bi text={{ zh: '换乘站：同时在两条线上的作品', en: 'Interchange: a work on two lines' }} />
        </p>
      </section>

      <Link to="/about" className="passenger">
        <span className="passenger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="7.4" r="1.6" fill="currentColor" />
            <rect x="10.6" y="10.4" width="2.8" height="7.6" rx="1" fill="currentColor" />
          </svg>
        </span>
        <span className="passenger-text">
          <Both text={{ zh: '乘客须知', en: 'Passenger information' }} className="passenger-title" />
          <span className="passenger-sub">{tr('关于我，以及怎样联系我', 'About me, and how to reach me')}</span>
        </span>
        <Arrow dir="right" className="passenger-arrow" />
      </Link>

      <div className="line-list">
        {SECTION_KEYS.map((k) => (
          <section key={k} className="line-list-item" aria-labelledby={`ll-${k}`}>
            <h2 id={`ll-${k}`}>
              <Link to={`/${k}`} className={`ln-${k}`}>
                <Badge k={k} />
                <Bi text={SECTIONS[k].name} />
              </Link>
            </h2>
            <LineStrip k={k} />
          </section>
        ))}
      </div>
    </main>
  )
}
