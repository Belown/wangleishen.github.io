// Everything personal lives in src/content. Edit freely; links left empty show a "add your link" note.

export const SITE = {
  name: 'Ada Lin',
  nameLocal: '林 雅',
  tagline: 'Making quiet things you can hold.',
  bio: 'I am a researcher, designer and pianist. I make the intangible parts of being human into things you can hold.',
  bioMore:
    'I work on soft and tangible interfaces: textiles that squeeze back, clocks made of water, letters that wait. Before research I trained as a product designer, and before that as a pianist.',
  now: 'Visiting researcher · Zürich / Cambridge MA',
  email: 'hello@ada-lin.example',
  cv: 'docs/cv.pdf',
  portfolio: 'docs/design-portfolio.pdf',
  links: {
    Scholar: '',
    GitHub: '',
    Instagram: '',
    YouTube: '',
    Bilibili: '',
  } as Record<string, string>,
}

export type SectionKey = 'research' | 'design' | 'art' | 'music' | 'experiments'

export const SECTIONS: Record<SectionKey, { name: string; intro: string }> = {
  research: { name: 'Research', intro: 'Papers and prototypes about touch, voice and slowness. Most were built in the lab, broken in user studies, then rebuilt.' },
  design: { name: 'Design & Engineering', intro: 'Objects with motors, water and clay in them. Things you can pick up.' },
  art: { name: 'Fine Art', intro: 'Work that does not need to be useful: ink, light and long loops.' },
  music: { name: 'Music', intro: 'Classical piano, recorded at home and sometimes on stage.' },
  experiments: { name: 'Experiments', intro: 'Small things made in a weekend. Some are silly on purpose.' },
}
export const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[]

export const NEWS: [string, string][] = [
  ['2026-10', 'Softfold accepted at CHI 2026. See you in Barcelona.'],
  ['2026-06', 'Started as a visiting researcher at a tangible media lab.'],
  ['2025-09', 'Hum Atlas received a Best Paper Award at UIST 2025.'],
  ['2025-03', 'Night Garden opened, running every evening for one month.'],
  ['2024-11', 'Played Satie for a full hall in Zürich and forgot one repeat.'],
]

export const TEACHING: [string, string][] = [
  ['2026', 'Soft Interfaces Studio, guest critic'],
  ['2025', 'Physical Computing, teaching assistant'],
  ['2024', 'Piano for Designers, a weekend workshop'],
]

export const COLLABORATORS = ['lab-one', 'university', 'studio', 'museum', 'orchestra', 'foundation']

export const FRIENDS: { name: string; what: string; url: string }[] = [
  { name: 'Mei Aoki', what: 'textiles', url: '' },
  { name: 'Jonas Brand', what: 'robotics', url: '' },
  { name: 'Rui Okafor', what: 'sound', url: '' },
  { name: 'Lin Chen', what: 'recording', url: '' },
  { name: 'Sara Haddad', what: 'HCI', url: '' },
  { name: 'Kenji Ito', what: 'instruments', url: '' },
]

export const READING: [string, string][] = [
  ['1933', "Jun'ichirō Tanizaki, In Praise of Shadows"],
  ['1977', 'Christopher Alexander et al., A Pattern Language'],
  ['1997', 'Hiroshi Ishii & Brygg Ullmer, Tangible Bits'],
  ['2007', 'Kenya Hara, Designing Design'],
]

export const ALBUM_RATIOS = ['3/4', '4/3', '1/1', '4/5', '3/2', '3/4', '1/1', '4/3', '2/3']

export const MOODS = [
  'Mostly calm, with scattered nostalgia after 4 pm.',
  'Clear skies. A good day to start the thing you have been avoiding.',
  'Light drizzle of self-doubt, clearing by evening.',
  'A warm front of curiosity moving in from the west.',
  'Fog until lunch. Do not make decisions before coffee.',
  'High pressure over the inbox. Shelter in a long walk.',
]

export const TREES = [
  'a ginkgo: old, patient, a little smelly in autumn.',
  'a birch: you peel easily, but you grow back.',
  'an olive: slow, salty and generous.',
  'a Japanese maple: you are showing off, and it is working.',
  'a pine: green no matter what the weather says.',
  'a willow: soft on the outside, with deep roots.',
  'a cherry: brief and unforgettable.',
]
