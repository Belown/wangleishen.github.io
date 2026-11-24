import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { asset } from './assets'
import { OWNER, SECTIONS, WORKS, workBySlug, worksIn, whenOf, type SectionKey, type T, type Work } from './content'
import { Bi, useLang } from './i18n'
import { Icon } from './icons'
import {
  dot, getVisits, GUESTBOOK_KEY, MOODS, moodOf, objectOf, recentWorks, SAMPLE_NOTES, TABS, tabLabel, useNotes, useTitle,
} from './lib'
import { Blocks, Ph } from './media'
import { NoteForm, NoteList, SecSticker } from './notes'
import { FurnitureArt, Room } from './room'

const workUrl = (w: Work) => `/work/${w.slug}`

function Avatar({ big }: { big?: boolean }) {
  const { lang } = useLang()
  const url = asset(OWNER.portrait)
  return (
    <span className={'ava' + (big ? ' big' : '')}>
      {url ? <img src={url} alt="" /> : <span aria-hidden="true">{lang === 'en' ? OWNER.name.en[0] : OWNER.name.zh.slice(-1)}</span>}
    </span>
  )
}

function Paras({ items }: { items: T[] }) {
  const { lang } = useLang()
  return items.map((p, i) => lang === 'both'
    ? <div key={i} className="para-pair"><p>{p.zh}</p><p lang="en">{p.en}</p></div>
    : <p key={i}>{lang === 'zh' ? p.zh : p.en}</p>)
}

/* ---------- home ---------- */
function Bgm() {
  const { tr } = useLang()
  const url = asset('audio/bgm.mp3')
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  return (
    <div className="bgm">
      <Icon name="note" size={20} />
      <span className="bgm-label">{tr('背景音乐', 'Background music')}</span>
      {url ? (
        <>
          <audio ref={ref} src={url} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          <button type="button" className="btn btn-sm" aria-pressed={playing}
            onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play().catch(() => {}); else a.pause() }}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />{playing ? tr('暂停', 'Pause') : tr('播放', 'Play')}
          </button>
        </>
      ) : <span className="fine">{tr('把 bgm.mp3 放进 src/assets/audio/ 就能听', 'Drop bgm.mp3 into src/assets/audio/ to play')}</span>}
    </div>
  )
}

function ProfileCard() {
  const { t, tr } = useLang()
  const v = getVisits()
  return (
    <section className="card profile">
      <div className="profile-top">
        <Avatar />
        <div>
          <h1><Bi text={OWNER.name} /></h1>
          <p className="bio">{t(OWNER.bio)}</p>
        </div>
      </div>
      <dl className="stats">
        <div className="stat mood">
          <dt>{tr('今日心情', 'Mood today')}</dt>
          <dd><Icon name={OWNER.mood.icon} size={26} /><span>{t(OWNER.mood.text)}</span></dd>
        </div>
        <div className="stat visits">
          <dt>{tr('访客', 'Visitors')}</dt>
          <dd><span>{tr('今日', 'Today')} <b>{v.today}</b></span><span>{tr('总计', 'Total')} <b>{v.total}</b></span></dd>
        </div>
      </dl>
      <p className="fine">{tr('访客数暂时只算这台浏览器的来访。', 'For now the counter only counts visits from this browser.')}</p>
      <Bgm />
    </section>
  )
}

function Recent() {
  const { tr } = useLang()
  return (
    <section className="card recent">
      <h2>{tr('最近更新', 'Recent updates')}</h2>
      <ol>
        {recentWorks(5).map((w) => (
          <li key={w.slug}>
            <time dateTime={whenOf(w)}>{dot(whenOf(w))}</time>
            <Link to={workUrl(w)}><Bi text={w.title} /></Link>
            <SecSticker k={w.sec[0]} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function MiniGuestbook() {
  const { tr } = useLang()
  const { notes } = useNotes(GUESTBOOK_KEY)
  return (
    <section className="card mini-gb">
      <h2>{tr('留言板', 'Guestbook')}</h2>
      <NoteList notes={[...notes, ...SAMPLE_NOTES].slice(0, 3)} compact />
      <Link className="btn btn-sm more" to="/guestbook"><Icon name="pencil" size={16} />{tr('去留言板写一句', 'Leave a note')}</Link>
    </section>
  )
}

export function Home() {
  useTitle()
  const { tr } = useLang()
  return (
    <div className="home">
      <div className="home-room">
        <Room />
        <p className="room-hint"><Icon name="pencil" size={18} />{tr('点点家具，看看我最近在做什么。', 'Poke the furniture to see what I have been making.')}</p>
      </div>
      <div className="home-side">
        <ProfileCard />
        <Recent />
        <MiniGuestbook />
      </div>
    </div>
  )
}

/* ---------- section pages ---------- */
function Others({ w, k }: { w: Work; k: SectionKey }) {
  const others = w.sec.filter((s) => s !== k)
  return others.length ? <span className="stickers">{others.map((s) => <SecSticker key={s} k={s} also />)}</span> : null
}

function Drawer({ k, works }: { k: SectionKey; works: Work[] }) {
  const { t } = useLang()
  return (
    <div className="drawer">
      <span className="drawer-handle" aria-hidden="true" />
      <ul className="drawer-list">
        {works.map((w) => (
          <li key={w.slug} className="row-card lift">
            <span className={`row-ico s-${w.sec[0]}`}><Icon name={objectOf(w)} size={28} /></span>
            <div className="row-main">
              <h2><Link className="stretch" to={workUrl(w)}><Bi text={w.title} /></Link></h2>
              <p>{t(w.summary)}</p>
            </div>
            <div className="row-meta">
              <span className="num">{w.year}</span>
              {w.venue && <span className="venue">{w.venue}</span>}
              <Others w={w} k={k} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Album({ k, works }: { k: SectionKey; works: Work[] }) {
  const { t } = useLang()
  return (
    <ul className="album">
      {works.map((w) => {
        const file = `works/${w.slug}/cover.jpg`
        const url = asset(file)
        return (
          <li key={w.slug} className="polaroid">
            <span className="tape" aria-hidden="true" />
            <div className="pol-photo">{url ? <img src={url} alt="" loading="lazy" /> : <Ph kind={{ zh: '封面', en: 'Cover' }} file={file} ratio="1/1" />}</div>
            <Link className="pol-cap stretch" to={workUrl(w)}><Bi text={w.title} /></Link>
            <span className="pol-sub"><span className="num">{w.year}</span> · {t(w.summary)}</span>
            <Others w={w} k={k} />
          </li>
        )
      })}
    </ul>
  )
}

function Diary({ k, works }: { k: SectionKey; works: Work[] }) {
  const { t } = useLang()
  const sorted = [...works].sort((a, b) => whenOf(b).localeCompare(whenOf(a)))
  return (
    <ol className="diary">
      {sorted.map((w) => (
        <li key={w.slug} className="entry">
          <time className="num" dateTime={whenOf(w)}>{dot(whenOf(w))}</time>
          <span className="entry-mood"><Icon name={moodOf(w)} size={28} /><span className="sr-only">{t(MOODS[moodOf(w)])}</span></span>
          <div className="entry-main">
            <h2><Link className="stretch" to={workUrl(w)}><Bi text={w.title} /></Link></h2>
            <p>{t(w.summary)}</p>
            <Others w={w} k={k} />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function SectionPage({ k }: { k: SectionKey }) {
  const sec = SECTIONS[k]
  useTitle(sec.name)
  const { t, tr } = useLang()
  const works = worksIn(k)
  const List = k === 'art' ? Album : k === 'writing' ? Diary : Drawer
  return (
    <div className={`section sec-${k}`}>
      <header className="page-head">
        <FurnitureArt to={`/${k}`} />
        <div>
          <h1><Bi text={sec.name} /></h1>
          <p>{t(sec.blurb)}</p>
          <p className="count num">{tr(`${works.length} 件`, `${works.length} pieces`)}</p>
        </div>
      </header>
      <List k={k} works={works} />
    </div>
  )
}

/* ---------- a work ---------- */
function Comments({ slug }: { slug: string }) {
  const { tr } = useLang()
  const { notes, add, remove } = useNotes(`room-comments:${slug}`)
  return (
    <section className="card comments" aria-labelledby="comments-h">
      <h2 id="comments-h">{tr('评论', 'Comments')}</h2>
      <p className="fine">{tr('评论只保存在这台浏览器里，别人暂时看不到。', 'Comments are saved in this browser only. Nobody else can see them yet.')}</p>
      {notes.length
        ? <NoteList notes={notes} onRemove={remove} deleteLabel={tr('删掉我的评论', 'Delete my comment')} />
        : <p className="empty">{tr('还没有评论。想说点什么吗？', 'No comments yet. Want to say something?')}</p>}
      <NoteForm id="comment" onAdd={add} submit={tr('发表评论', 'Post comment')} />
    </section>
  )
}

const NOT_FOUND: T = { zh: '这个房间还没布置好', en: 'This room isn’t furnished yet' }

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  useTitle(w ? w.title : NOT_FOUND)
  const { t, tr } = useLang()
  if (!w) return <NotFound />
  const home = w.sec[0]
  const list = WORKS.filter((x) => x.sec[0] === home)
  const i = list.indexOf(w)
  const prev = list[i - 1], next = list[i + 1]
  const mood = moodOf(w)
  const meta: [string, string][] = []
  if (w.role) meta.push([tr('角色', 'Role'), t(w.role)])
  if (w.tools) meta.push([tr('工具', 'Tools'), t(w.tools)])
  if (w.venue) meta.push([tr('发表于', 'Venue'), w.venue])

  return (
    <article className={'post' + (home === 'writing' ? ' essay' : '')}>
      <Link to={`/${home}`} className="back"><Icon name="arrow" size={18} className="icon flip" />{tr('回到', 'Back to')} {t(tabLabel(`/${home}`))}</Link>
      <header className="post-head">
        <h1><Bi text={w.title} /></h1>
        <p className="post-when">
          <time className="num" dateTime={whenOf(w)}>{dot(whenOf(w))}</time>
          <span className="mood-line"><Icon name={mood} size={22} /><span>{tr('心情', 'Mood')}</span><b>{t(MOODS[mood])}</b></span>
        </p>
        <p className="post-sum">{t(w.summary)}</p>
        <dl className="post-meta">
          {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          <div><dt>{tr('放在', 'Filed under')}</dt><dd className="stickers">{w.sec.map((s) => <SecSticker key={s} k={s} />)}</dd></div>
        </dl>
      </header>
      <div className="post-body"><Blocks blocks={w.body} /></div>
      {(prev || next) && (
        <nav className="prevnext" aria-label={tr('上一篇和下一篇', 'Previous and next')}>
          {prev ? <Link className="pn lift" to={workUrl(prev)} rel="prev"><span><Icon name="arrow" size={16} className="icon flip" />{tr('上一篇', 'Previous')}</span><b><Bi text={prev.title} /></b></Link> : <span />}
          {next ? <Link className="pn next lift" to={workUrl(next)} rel="next"><span>{tr('下一篇', 'Next')}<Icon name="arrow" size={16} /></span><b><Bi text={next.title} /></b></Link> : <span />}
        </nav>
      )}
      <Comments key={w.slug} slug={w.slug} />
    </article>
  )
}

/* ---------- guestbook ---------- */
export function Guestbook() {
  useTitle(tabLabel('/guestbook'))
  const { tr } = useLang()
  const { notes, add, remove } = useNotes(GUESTBOOK_KEY)
  return (
    <div className="gb">
      <header className="page-head plain">
        <div>
          <h1>{tr('留言板', 'Guestbook')}</h1>
          <p>{tr('路过的话，留一句再走吧。', 'If you are passing by, leave a line before you go.')}</p>
        </div>
      </header>
      <div className="gb-grid">
        <section className="card gb-form" aria-labelledby="gb-write">
          <h2 id="gb-write">{tr('写一句', 'Write a note')}</h2>
          <NoteForm id="gb" onAdd={add} submit={tr('贴到留言板', 'Pin it up')} />
          <p className="fine">{tr('留言现在只存在你自己的浏览器里，我还看不到。等网站接上后台，它们才会真的寄到我这里。',
            'For now your notes stay in your own browser, and I cannot read them yet. Once the site has a backend, they will actually reach me.')}</p>
        </section>
        <div className="gb-lists">
          <section aria-labelledby="gb-mine">
            <h2 id="gb-mine">{tr('你的留言', 'Your notes')}</h2>
            {notes.length
              ? <NoteList notes={notes} onRemove={remove} deleteLabel={tr('删掉我的留言', 'Delete my note')} />
              : <p className="empty">{tr('你还没有留过言。第一句写什么都可以。', 'You have not left a note yet. Anything works for a first one.')}</p>}
          </section>
          <section aria-labelledby="gb-samples">
            <h2 id="gb-samples">{tr('示例留言', 'Sample notes')}</h2>
            <p className="fine">{tr('下面几条是示例，用来展示留言板的样子。', 'These are samples, here to show what the guestbook looks like.')}</p>
            <NoteList notes={SAMPLE_NOTES} />
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---------- about ---------- */
export function About() {
  useTitle(tabLabel('/about'))
  const { t, tr } = useLang()
  const emailRef = useRef<HTMLSpanElement>(null)
  const [status, setStatus] = useState('')
  const portrait = asset(OWNER.portrait)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email)
      setStatus(tr('复制好了。', 'Copied.'))
    } catch {
      const el = emailRef.current, sel = getSelection()
      if (!el || !sel) return
      const r = document.createRange()
      r.selectNodeContents(el)
      sel.removeAllRanges()
      sel.addRange(r)
      const ok = document.execCommand('copy')
      setStatus(ok ? tr('复制好了。', 'Copied.') : tr('没法自动复制，地址已经选中了，按 Ctrl+C 就好。', 'Could not copy automatically. The address is selected, press Ctrl+C.'))
    }
  }

  return (
    <div className="about">
      <section className="card about-card">
        <div className="about-portrait">
          <Avatar big />
          {!portrait && <p className="fine">{tr('照片放在', 'Photo goes at')} <code>src/assets/{OWNER.portrait}</code></p>}
        </div>
        <div className="about-text">
          <h1><Bi text={OWNER.name} /></h1>
          <p className="bio">{t(OWNER.bio)}</p>
          <Paras items={OWNER.about} />
        </div>
      </section>
      <div className="about-side">
        <section className="card contact">
          <h2>{tr('写信给我', 'Write to me')}</h2>
          <div className="email-row">
            <span className="email" ref={emailRef}>{OWNER.email}</span>
            <button type="button" className="btn btn-sm" onClick={copy}><Icon name="copy" size={16} />{tr('复制', 'Copy')}</button>
          </div>
          <p className="ok" role="status">{status}</p>
          <h2>{tr('别处的我', 'Elsewhere')}</h2>
          <ul className="links">
            {OWNER.links.map((l) => (
              <li key={l.label.en}>
                {l.href
                  ? <a href={l.href} target="_blank" rel="noreferrer"><Icon name="link" size={18} />{t(l.label)}</a>
                  : <><span className="link-empty"><Icon name="link" size={18} />{t(l.label)}</span>
                    <span className="fine">{tr('还没填链接：在 src/content.ts 里加上', 'No link yet: add it in src/content.ts')}</span></>}
              </li>
            ))}
          </ul>
        </section>
        <section className="card corners">
          <h2>{tr('房间里的角落', 'Corners of the room')}</h2>
          <ul>
            {TABS.slice(1, 5).map((tb) => (
              <li key={tb.to}>
                <Link to={tb.to} className="corner lift"><FurnitureArt to={tb.to} /><Bi text={tb.label} /></Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

/* ---------- 404 ---------- */
export function NotFound() {
  useTitle(NOT_FOUND)
  const { tr } = useLang()
  return (
    <div className="nf">
      <Icon name="box" size={84} />
      <h1><Bi text={NOT_FOUND} /></h1>
      <p>{tr('这里还空着，可能是链接打错了。', 'Nothing here yet. The link may have a typo.')}</p>
      <Link className="btn" to="/"><Icon name="house" size={18} />{tr('回主页', 'Back home')}</Link>
    </div>
  )
}
