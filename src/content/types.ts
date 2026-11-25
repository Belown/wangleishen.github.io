/** A piece of text. */
export type T = string
export type SectionKey = 'research' | 'design' | 'art' | 'writing'

export type Block =
  | { type: 'p'; text: T }
  | { type: 'h'; text: T }
  | { type: 'img'; file: string; ratio?: string; cap?: T }
  | { type: 'gallery'; folder: string; count: number; ratio?: string; cap?: T }
  | { type: 'video'; file: string; duration: string; cap?: T }
  | { type: 'audio'; file: string; title: T }
  | { type: 'quote'; text: T; cite: T }
  | { type: 'pdf'; file: string; title: T; pages: number }
  | { type: 'embed'; service: string; title: T }
  | { type: 'refs'; items: string[] }
  /** A YouTube video by its id (the v= part of the link), embedded without tracking cookies. */
  | { type: 'youtube'; id: string; cap?: T }

export type Work = {
  slug: string
  title: T
  summary: T
  sec: SectionKey[] // first one is its home section; a second one means it belongs to both
  year: number
  date?: string // publication or posting date, YYYY-MM-DD
  role?: T
  tools?: T
  venue?: T
  /** Live pages, code and files, shown on the work page. `file` is a path under src/assets/. */
  links?: { label: T; href?: string; file?: string }[]
  /** A work that is a paper: its page opens with the paper's title block and ends with the citation. */
  paper?: Paper
  body: Block[]
}

/**
 * `aff` numbers point into `affiliations` (1-based). `pdf` is a file under src/assets/.
 * Anything left out shows as "coming soon" (links) or is hidden (abstract, BibTeX).
 */
export type Paper = {
  title: string
  authors: { name: string; aff: number[] }[]
  affiliations: string[]
  mentors?: { name: string; aff: string; href?: string }[]
  venue: string
  doi?: string
  pdf?: string
  abstract?: string
  bibtex?: string
}
