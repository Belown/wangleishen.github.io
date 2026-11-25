import type { SectionKey, T } from './types'

export const SECTIONS: Record<SectionKey, { name: T; blurb: T }> = {
  research: { name: 'Research', blurb: 'Research projects, prototypes and course research.' },
  design: { name: 'Design & Engineering', blurb: 'Interactive systems, web pages and prototypes.' },
  art: { name: 'Art · Music', blurb: 'Music and other work that does not need to be useful.' },
  writing: { name: 'Writing', blurb: 'Essays and notes.' },
}
export const ABOUT_NAME: T = 'About'
