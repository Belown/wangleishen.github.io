import { useEffect, useState } from 'react'
import { type Mood, type SectionKey, type T, type Work, OWNER, WORKS, whenOf } from './content'
import type { IconName } from './icons'
import { useLang } from './i18n'

/* ---------- the window's tabs ---------- */
export const TABS: { to: string; label: T }[] = [
  { to: '/', label: { zh: '主页', en: 'Home' } },
  { to: '/research', label: { zh: '研究', en: 'Research' } },
  { to: '/design', label: { zh: '设计', en: 'Design' } },
  { to: '/art', label: { zh: '相册', en: 'Art·Music·Photo' } },
  { to: '/writing', label: { zh: '日志', en: 'Writing' } },
  { to: '/guestbook', label: { zh: '留言板', en: 'Guestbook' } },
  { to: '/about', label: { zh: '个人档', en: 'About' } },
]
export const tabLabel = (to: string) => TABS.find((t) => t.to === to)!.label

/* ---------- page title ---------- */
export function useTitle(title?: T) {
  const { t } = useLang()
  const home = `${OWNER.name.zh}的小屋 · ${OWNER.name.en}`
  const text = title ? `${t(title)} · ${OWNER.name.zh}的小屋` : home
  useEffect(() => { document.title = text }, [text])
}

/* ---------- moods ---------- */
export const MOODS: Record<Mood, T> = {
  sun: { zh: '晴，心情不错', en: 'Sunny, in a good mood' },
  cloud: { zh: '多云，在想事情', en: 'Cloudy, thinking things over' },
  rain: { zh: '小雨，慢慢来', en: 'Light rain, taking it slow' },
  note: { zh: '一边听歌一边写', en: 'Writing with music on' },
  pencil: { zh: '埋头写东西', en: 'Head down, writing' },
}
const SECTION_MOOD: Record<SectionKey, Mood> = { research: 'pencil', design: 'sun', art: 'note', writing: 'cloud' }
export const moodOf = (w: Work): Mood => w.mood ?? SECTION_MOOD[w.sec[0]]

/** A small drawn object for each work in the drawer lists. */
const OBJECT: Record<string, IconName> = {
  softfold: 'fold', 'hum-atlas': 'wave', 'slow-mail': 'envelope', 'tidal-clock': 'clock',
  'paper-synth': 'note', 'warm-cup': 'cup', 'night-garden': 'moon', 'soft-machines': 'fold', 'mood-weather': 'cloud',
}
const SECTION_OBJECT: Record<SectionKey, IconName> = { research: 'book', design: 'pencil', art: 'camera', writing: 'pencil' }
export const objectOf = (w: Work): IconName => OBJECT[w.slug] ?? SECTION_OBJECT[w.sec[0]]

/* ---------- dates ---------- */
/** 2026-03-12 → 2026.03.12 ; a bare year stays a year. */
export const dot = (d: string) => d.replaceAll('-', '.')
export const recentWorks = (n: number) => [...WORKS].sort((a, b) => whenOf(b).localeCompare(whenOf(a))).slice(0, n)
const today = () => new Date().toLocaleDateString('sv') // YYYY-MM-DD, local time

/* ---------- storage (this browser only) ---------- */
function read<V>(key: string, fallback: V): V {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as V) : fallback
  } catch { return fallback }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage blocked: keep it in memory */ }
}

/* ---------- visitor counter: +1 once per browser session ---------- */
type Visits = { total: number; today: number; day: string }
let visits: Visits | null = null
export function getVisits(): Visits {
  if (visits) return visits
  const d = today()
  const v = read<Visits>('room-visits', { total: 0, today: 0, day: d })
  if (v.day !== d) { v.day = d; v.today = 0 }
  let fresh = true
  try {
    fresh = !sessionStorage.getItem('room-visited')
    sessionStorage.setItem('room-visited', '1')
  } catch { /* count this load */ }
  if (fresh) { v.total++; v.today++ }
  write('room-visits', v)
  return (visits = v)
}

/* ---------- notes: guestbook and per-work comments ---------- */
export type Note = { id: string; name: string; msg: string; at: string; sample?: true }

export const SAMPLE_NOTES: Note[] = [
  { id: 's1', name: '小满', msg: '新作品好可爱！哼声图谱那个视频我看了三遍。', at: '2026-11-12', sample: true },
  { id: 's2', name: 'Jonas', msg: 'Dropping by. The Goldberg recording is lovely, and I like that the room noise stayed in.', at: '2026-11-03', sample: true },
  { id: 's3', name: '阿梨', msg: '踩踩～下次一起去湖边拍照，我带胶卷。', at: '2026-10-28', sample: true },
  { id: 's4', name: 'Mei', msg: 'Warm Cup is still on my wishlist. Please make a second batch!', at: '2026-10-09', sample: true },
]

export const NAME_MAX = 20
export const MSG_MAX = 200

export function useNotes(key: string) {
  const [notes, setNotes] = useState<Note[]>(() => read<Note[]>(key, []))
  const save = (next: Note[]) => { setNotes(next); write(key, next) }
  return {
    notes,
    add: (name: string, msg: string) => {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
      save([{ id, name, msg, at: today() }, ...notes])
      write('room-name', name)
    },
    remove: (id: string) => save(notes.filter((n) => n.id !== id)),
  }
}
export const rememberedName = () => read<string>('room-name', '')
export const GUESTBOOK_KEY = 'room-guestbook'
