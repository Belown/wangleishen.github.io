import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import type { SectionKey } from './content'
import { useLang } from './i18n'
import { Icon } from './icons'
import { dot, MSG_MAX, NAME_MAX, rememberedName, tabLabel, type Note } from './lib'

/** A section sticker that links to that section. */
export function SecSticker({ k, also }: { k: SectionKey; also?: boolean }) {
  const { t, tr } = useLang()
  return (
    <Link to={`/${k}`} className={`sticker s-${k}`}>
      {also && <span>{tr('也在', 'also in')} </span>}{t(tabLabel(`/${k}`))}
    </Link>
  )
}

export function NoteForm({ id, onAdd, submit }: { id: string; onAdd: (name: string, msg: string) => void; submit: string }) {
  const { tr } = useLang()
  const [name, setName] = useState(rememberedName)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState<{ name?: string; msg?: string }>({})
  const [done, setDone] = useState(false)

  const send = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim(), m = msg.trim()
    const next = {
      name: n ? undefined : tr('先写个名字吧，昵称也可以。', 'Add a name first. A nickname is fine.'),
      msg: m ? undefined : tr('写点什么再贴上去吧。', 'Write something before posting.'),
    }
    setErr(next)
    setDone(false)
    if (next.name || next.msg) return
    onAdd(n, m)
    setMsg('')
    setDone(true)
  }

  const near = msg.length > MSG_MAX - 20
  return (
    <form className="note-form" onSubmit={send} noValidate>
      <div className="field">
        <label htmlFor={`${id}-name`}>{tr('名字', 'Name')}</label>
        <input id={`${id}-name`} value={name} maxLength={NAME_MAX} autoComplete="nickname"
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!err.name} aria-describedby={err.name ? `${id}-name-err` : `${id}-name-hint`} />
        {err.name
          ? <p className="err" id={`${id}-name-err`}>{err.name}</p>
          : <p className="hint" id={`${id}-name-hint`}>{tr(`最多 ${NAME_MAX} 个字`, `Up to ${NAME_MAX} characters`)}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-msg`}>{tr('想说的话', 'Your note')}</label>
        <textarea id={`${id}-msg`} value={msg} maxLength={MSG_MAX} rows={4}
          onChange={(e) => setMsg(e.target.value)}
          aria-invalid={!!err.msg} aria-describedby={`${id}-msg-count${err.msg ? ` ${id}-msg-err` : ''}`} />
        <div className="field-foot">
          {err.msg ? <p className="err" id={`${id}-msg-err`}>{err.msg}</p> : <span />}
          <span className={'count' + (near ? ' near' : '')} id={`${id}-msg-count`}>{msg.length}/{MSG_MAX}</span>
        </div>
      </div>
      <div className="form-foot">
        <button className="btn" type="submit"><Icon name="pencil" size={18} />{submit}</button>
        <span className="ok" role="status">{done && tr('贴好了！只存在这台浏览器里。', 'Posted! It stays in this browser only.')}</span>
      </div>
    </form>
  )
}

export function NoteList({ notes, onRemove, deleteLabel, compact }: {
  notes: Note[]; onRemove?: (id: string) => void; deleteLabel?: string; compact?: boolean
}) {
  const { tr } = useLang()
  return (
    <ul className={'notes' + (compact ? ' compact' : '')}>
      {notes.map((n) => (
        <li key={n.id} className={'note' + (n.sample ? ' sample' : ' mine')}>
          <div className="note-head">
            <b>{n.name}</b>
            <time dateTime={n.at}>{dot(n.at)}</time>
            {n.sample && <span className="tag-sample">{tr('示例', 'sample')}</span>}
          </div>
          <p>{n.msg}</p>
          {!n.sample && onRemove && (
            <button type="button" className="btn-ghost" onClick={() => onRemove(n.id)}>
              <Icon name="trash" size={16} />{deleteLabel}
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
