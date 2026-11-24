import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { T } from './content'

export type Lang = 'zh' | 'en' | 'both'
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'zh', setLang: () => {} })

const KEY = 'site-lang'
function initial(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'zh' || v === 'en' || v === 'both') return v
  } catch { /* storage blocked */ }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial)
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
    try { localStorage.setItem(KEY, lang) } catch { /* storage blocked */ }
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

/**
 * Text helpers for the current language.
 * t(): one string ("中文 / English" in bilingual mode). pri()/sec(): the primary string, and the
 * secondary one only in bilingual mode, for layouts that set the two languages differently.
 */
export function useLang() {
  const { lang, setLang } = useContext(LangCtx)
  const t = (o: T) => (lang === 'zh' ? o.zh : lang === 'en' ? o.en : `${o.zh} / ${o.en}`)
  const pri = (o: T) => (lang === 'en' ? o.en : o.zh)
  const sec = (o: T) => (lang === 'both' ? o.en : null)
  /** Inline literal for UI strings: tr('中文', 'English'). */
  const tr = (zh: string, en: string) => t({ zh, en })
  return { lang, setLang, t, pri, sec, tr }
}

/** Primary text with the other language set smaller beside or under it in bilingual mode. */
export function Bi({ text, className }: { text: T; className?: string }) {
  const { pri, sec } = useLang()
  const s = sec(text)
  return (
    <span className={className}>
      {pri(text)}
      {s && <span className="bi-sec" lang="en"> {s}</span>}
    </span>
  )
}

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'zh', label: '中' },
  { id: 'en', label: 'EN' },
  { id: 'both', label: '中/EN' },
]
