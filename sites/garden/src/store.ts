import { create } from 'zustand'

export type Time = 'dawn' | 'noon' | 'dusk' | 'night'
export const TIMES: Time[] = ['dawn', 'noon', 'dusk', 'night']
export type ViewKey = 'home' | 'works' | 'lost'
export type LightboxItem = { file: string; url?: string; ratio: string; caption?: string }

type State = {
  time: Time
  setTime: (t: Time) => void
  termOpen: boolean
  setTerm: (open: boolean) => void
  view: ViewKey | null // terminal `view` override while on the garden
  setView: (v: ViewKey | null) => void
  rakeNonce: number
  rake: () => void
  toast: { msg: string; id: number } | null
  showToast: (msg: string) => void
  lightbox: { items: LightboxItem[]; i: number } | null
  openLightbox: (items: LightboxItem[], i: number) => void
  stepLightbox: (d: number) => void
  closeLightbox: () => void
  audio: { id: string | null; elapsed: number; length: number }
}

const prefersDark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches

export const useStore = create<State>((set) => ({
  time: prefersDark ? 'night' : 'noon',
  setTime: (time) => set({ time }),
  termOpen: typeof innerWidth !== 'undefined' && innerWidth >= 700,
  setTerm: (termOpen) => set({ termOpen }),
  view: null,
  setView: (view) => set({ view }),
  rakeNonce: 0,
  rake: () => set((s) => ({ rakeNonce: s.rakeNonce + 1 })),
  toast: null,
  showToast: (msg) => set({ toast: { msg, id: Date.now() } }),
  lightbox: null,
  openLightbox: (items, i) => set({ lightbox: { items, i } }),
  stepLightbox: (d) =>
    set((s) => (s.lightbox ? { lightbox: { ...s.lightbox, i: (s.lightbox.i + d + s.lightbox.items.length) % s.lightbox.items.length } } : {})),
  closeLightbox: () => set({ lightbox: null }),
  audio: { id: null, elapsed: 0, length: 0 },
}))

export const toast = (msg: string) => useStore.getState().showToast(msg)
