import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { SECTION_KEYS, SITE } from '../content/site'
import { POSTS, postBySlug } from '../content/posts'
import { TRACKS } from '../content/tracks'
import { WORKS } from '../content/works'
import { stopAudio, toggleAudio } from '../lib/audio'
import { fmt } from '../lib/util'
import { TIMES, useStore } from '../store'
import { Ph } from './media'

const TIME_ICON = { dawn: '☼', noon: '☼', dusk: '◐', night: '☾' } as const

export function TopBar({ group }: { group: string | null }) {
  const time = useStore((s) => s.time)
  const termOpen = useStore((s) => s.termOpen)
  const nav = [['works', 'Works'], ['journal', 'Journal'], ['about', 'About']]
  return (
    <header className="top">
      <Link className="brand" to="/">{SITE.name.toLowerCase()} <small>{SITE.nameLocal}</small></Link>
      <nav className="nav" aria-label="Main">
        {nav.map(([k, l]) => <Link key={k} to={'/' + k} aria-current={group === k ? 'page' : undefined}>{l}</Link>)}
      </nav>
      <button type="button" className="tbtn" title="Change time of day"
        onClick={() => useStore.getState().setTime(TIMES[(TIMES.indexOf(time) + 1) % TIMES.length])}>
        {TIME_ICON[time]} <span className="lbl">{time}</span>
      </button>
      <button type="button" className="tbtn" title="Toggle terminal (`)" aria-expanded={termOpen}
        onClick={() => useStore.getState().setTerm(!termOpen)}>
        ›_ <span className="lbl">terminal</span>
      </button>
    </header>
  )
}

export function Intro({ hidden }: { hidden: boolean }) {
  return (
    <section className={'intro' + (hidden ? ' gone' : '')} aria-hidden={hidden}>
      <h1>{SITE.name}<span>{SITE.nameLocal}</span></h1>
      <p>{SITE.tagline}</p>
      <ul>
        <li><b>hover</b>take an object off the shelf</li>
        <li><b>click</b>open its section</li>
        <li><b>`</b>open the terminal</li>
      </ul>
    </section>
  )
}

/* ---------------- terminal ---------------- */
type Line = { text: string; dim?: boolean; links?: [string, string][] }
const PLACES = [...SECTION_KEYS, 'works', 'journal', 'about']

export function Terminal() {
  const open = useStore((s) => s.termOpen)
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const out = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const run = (cmd: string) => {
    const s = useStore.getState()
    const add: Line[] = [{ text: '› ' + cmd, dim: true }]
    const say = (text: string, links?: [string, string][]) => add.push({ text, links })
    const [a, ...rest] = cmd.trim().split(/\s+/)
    const arg = rest.join(' ').replace(/\/$/, '').toLowerCase()
    const findWork = (q: string) => WORKS[parseInt(q) - 1] ?? WORKS.find((w) => w.slug.startsWith(q) || w.title.toLowerCase().startsWith(q))
    const findPost = (q: string) => POSTS[parseInt(q) - 1] ?? postBySlug(q) ?? POSTS.find((p) => p.title.toLowerCase().includes(q))
    switch (a) {
      case undefined: case '': break
      case 'help':
        say(['ls [section]    list sections, or the works in one', `cd <place>      ${PLACES.join(' · ')} · ~`, 'open <n|name>   open a work',
          'read <n|name>   read a journal post', `play <track>    ${Object.keys(TRACKS).join(' · ')}`, 'stop            stop the music',
          `time <t>        ${TIMES.join(' · ')}`, 'whoami · clear'].join('\n'))
        break
      case 'ls':
        if (!arg) say('', [...SECTION_KEYS.map((k) => [`cd ${k}`, `${k}/  ${WORKS.filter((w) => w.section === k).length}`] as [string, string]), ['cd journal', `journal/  ${POSTS.length}`], ['cd about', 'about']])
        else if (arg === 'journal') say('', POSTS.map((p, i) => [`read ${p.slug}`, `${i + 1}  ${p.title}`]))
        else {
          const ws = WORKS.filter((w) => w.section === arg)
          ws.length ? say('', ws.map((w) => [`open ${w.slug}`, `${String(WORKS.indexOf(w) + 1).padStart(2)}  ${w.title}  ${w.year}`])) : say(`ls: ${arg}: no such section`)
        }
        break
      case 'cd':
        if (!arg || arg === '~' || arg === '..') { navigate('/'); say('back at the shelf.') }
        else if (PLACES.includes(arg)) { navigate('/' + arg); say('ok.') }
        else say(`cd: ${arg}: no such place`)
        break
      case 'open': { const w = findWork(arg); if (w) { navigate('/works/' + w.slug); say('opening ' + w.title + ' …') } else say('open: nothing by that name. try ls'); break }
      case 'read': { const p = findPost(arg); if (p) { navigate('/journal/' + p.slug); say('reading ' + p.title + ' …') } else say('read: no such post. try ls journal'); break }
      case 'play': { const id = Object.keys(TRACKS).find((k) => k.startsWith(arg)) ?? 'gymnopedie'; if (s.audio.id !== id) toggleAudio(id); say('♪ ' + TRACKS[id].title); break }
      case 'stop': stopAudio(); say('silence.'); break
      case 'time': if ((TIMES as string[]).includes(arg)) { s.setTime(arg as never); say(arg === 'night' ? 'the lamp is lit.' : 'light shifts.') } else say('time: ' + TIMES.join(' · ')); break
      case 'whoami': say('a visitor. welcome.'); break
      case 'clear': setLines([]); return
      case 'sudo': say('in this study, nobody is root.'); break
      default: say(`${a}: not found. type help`)
    }
    setLines((l) => [...l, ...add].slice(-200))
  }

  useEffect(() => {
    setLines([{ text: `Welcome to ${SITE.name.toLowerCase().replace(' ', '.')}, a cabinet of ${WORKS.length} works.\nType help, or pick something off the shelf.` }])
    run('ls')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { out.current?.scrollTo({ top: out.current.scrollHeight }) }, [lines])
  useEffect(() => { if (open && innerWidth > 700) input.current?.focus({ preventScroll: true }) }, [open])

  if (!open) return null
  return (
    <div className="term" role="region" aria-label="Terminal">
      <div className="bar"><span>~/{SITE.name.split(' ')[0].toLowerCase()} · zsh</span><button type="button" aria-label="Close terminal" onClick={() => useStore.getState().setTerm(false)}>×</button></div>
      <div className="tout" ref={out}>
        {lines.map((l, i) => (
          <div key={i} className={l.dim ? 'dim' : undefined}>
            {l.text}
            {l.links?.map(([c, label]) => <div key={c}><button type="button" onClick={() => run(c)}>{label}</button></div>)}
          </div>
        ))}
      </div>
      <form className="tin" onSubmit={(e) => { e.preventDefault(); run(value); setValue('') }}>
        <span>›</span>
        <input ref={input} id="term-input" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} placeholder="type help" aria-label="Terminal command" />
      </form>
    </div>
  )
}

/* ---------------- overlays ---------------- */
export function Overlays() {
  const t = useStore((s) => s.toast)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!t) return
    setShown(true)
    const id = setTimeout(() => setShown(false), 2600)
    return () => clearTimeout(id)
  }, [t])
  const audio = useStore((s) => s.audio)
  const lb = useStore((s) => s.lightbox)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (lb) close.current?.focus() }, [lb !== null]) // eslint-disable-line react-hooks/exhaustive-deps
  const item = lb?.items[lb.i]
  return (
    <>
      <div className="toast" style={{ opacity: shown ? 1 : 0 }} role="status">{t?.msg}</div>
      {audio.id && (
        <div className="mini">
          <span>♪ {TRACKS[audio.id].title} · {fmt(audio.elapsed)} / {fmt(audio.length)}</span>
          <button type="button" onClick={stopAudio} aria-label="Stop">■</button>
        </div>
      )}
      {lb && item && (
        <div className="lb" role="dialog" aria-label="Image viewer" onClick={(e) => e.target === e.currentTarget && useStore.getState().closeLightbox()}>
          <div className="lb-media">
            {item.url ? <img src={item.url} alt={item.caption ?? ''} /> : <Ph kind="Image" file={item.file} ratio={item.ratio} note="Full-resolution image goes here" />}
          </div>
          <p>{item.caption ?? item.file} · {lb.i + 1} / {lb.items.length}</p>
          <button ref={close} type="button" className="c" onClick={() => useStore.getState().closeLightbox()}>Close (Esc)</button>
          {lb.items.length > 1 && (
            <>
              <button type="button" className="pv" aria-label="Previous" onClick={() => useStore.getState().stepLightbox(-1)}>←</button>
              <button type="button" className="nx" aria-label="Next" onClick={() => useStore.getState().stepLightbox(1)}>→</button>
            </>
          )}
        </div>
      )}
    </>
  )
}
