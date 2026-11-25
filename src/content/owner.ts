import type { T } from './types'

/** A notice shown above the profile and on work pages. null hides it. */
export const SAMPLE_NOTE: T | null = null

export const OWNER = {
  name: 'Wanglei Shen',
  /** Shown on the contact card and, as "name | role | org", in the home page's browser tab. */
  role: 'MSc Student in Computer Science',
  org: 'ETH Zürich',
  /** Work address for the saved contact, as on a business card. Leave empty to leave it out. */
  address: { street: '', city: '', postcode: '', country: '' },
  /** Shown under the name on the home page. */
  nameZh: '沈王磊',
  /** The one short line on the first screen. */
  line: 'HCI, learning technology and machine learning.',
  bio: 'MSc Computer Science student at ETH Zürich, interested in HCI, learning technology and machine learning.',
  hello: "Hi, I'm Wanglei Shen.",
  about: [
    'I am an MSc student in Computer Science at ETH Zürich, interested in where HCI, learning technology and machine learning meet: how a system can read the state of someone who is learning, and how a complex idea can be shown so that it is understood at a glance.',
    'One recent project is EmotiMath: a finger-worn electrodermal sensor picks up the stress of math anxiety, and an AI tutor shifts between concrete, pictorial and symbolic representations in real time. It was our entry to the UIST 2026 Student Innovation Contest, is published in the UIST ’26 adjunct proceedings, and was demoed live in Detroit.',
    'In course projects I have built interactive web pages that explain eye tracking and algorithmic fairness, and at the TUM XR Value Creation Hackathon in November 2026 our team built Labsty, a VR lab-safety inspection for Meta Quest 3.',
  ] as T[],
  interests: [
    'Human–computer interaction',
    'Learning technology',
    'Biosignals and affective computing',
    'Machine learning',
    'Interactive explainers',
  ] as T[],
  /** Empty hides the email row. */
  email: 'washen@ethz.ch',
  /** Fill in each href. An empty href shows a note instead of a link. */
  links: [
    { label: 'GitHub', href: 'https://github.com/Belown' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wanglei-shen/' },
  ],
  cv: 'about/cv.pdf',
  portrait: 'about/portrait.jpg',
}

/** Education and experience, newest first. */
export const TIMELINE: { when: string; title: T; place: T; note?: T }[] = [
  {
    when: 'Mar 2026 –', title: 'MSc in Computer Science',
    place: 'ETH Zürich',
  },
  {
    when: 'Sep 2022 – Mar 2026', title: 'BSc in Computer Science',
    place: 'ETH Zürich',
  },
  // TODO: internships, work experience.
]

/** The owner's name as it appears in author lists; it is set in bold there. */
export const ME = 'Wanglei Shen'

/**
 * Publications, newest first. A link with `file` points into src/assets/; one with `href` points
 * anywhere; with neither, it shows as not yet added. An empty list hides the section.
 */
export const PUBLICATIONS: {
  authors: string[]; title: string; venue: string; year: number; award?: T; work?: string
  links: { label: string; href?: string; file?: string }[]
}[] = [
  {
    authors: ['Wanglei Shen', 'Laura Alisa Bock', 'Manusha Karunathilaka'], year: 2026, work: 'emotimath',
    title: 'EmotiMath: Biosignal-Driven Adaptive Representation in AI Math Tutoring',
    venue: 'Adjunct Proceedings of the 39th Annual ACM Symposium on User Interface Software and Technology (UIST Adjunct ’26)',
    links: [
      { label: 'PDF', file: 'works/emotimath/paper.pdf' },
      { label: 'DOI', href: 'https://doi.org/10.1145/3830397.3841316' },
      { label: 'Video', href: 'https://www.youtube.com/watch?v=Rc1iRpaRpB0' },
      { label: 'Code', href: 'https://github.com/EmotiMath' },
    ],
  },
]

/** An empty list hides the section. */
export const HONOURS: { year: number; title: T }[] = [
  // TODO
]
