// All content lives here.
// Files (images, video, audio, PDFs) go in src/assets/ at the path each placeholder shows.
// TODO marks what is still unknown; an empty list or field simply hides that part of the page.

/** A piece of text. */
export type T = string
export type SectionKey = 'research' | 'design' | 'art' | 'writing'

/** A notice shown above the profile and on work pages. null hides it. */
export const SAMPLE_NOTE: T | null = null

export const OWNER = {
  name: 'Wanglei Shen',
  /** Shown under the name on the home page. */
  nameZh: '沈王磊',
  /** The one short line on the first screen. */
  line: 'HCI, learning technology and machine learning.',
  bio: 'MSc Computer Science student at ETH Zürich working across HCI, learning technology and machine learning.',
  hello: "Hi, I'm Wanglei Shen.",
  about: [
    'I am an MSc student in Computer Science at ETH Zürich, working where HCI, learning technology and machine learning meet: how a system can read the state of someone who is learning, and how a complex idea can be shown so that it is understood at a glance.',
    'One recent project is EmotiMath: a finger-worn electrodermal sensor picks up the stress of math anxiety, and an AI tutor shifts between concrete, pictorial and symbolic representations in real time. It was our entry to the UIST 2026 Student Innovation Contest and was demoed live in Detroit.',
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
  email: '',
  /** Fill in each href. An empty href shows a note instead of a link. */
  links: [
    { label: 'GitHub', href: '' },
    { label: 'Google Scholar', href: '' },
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
  // TODO: e.g. the EmotiMath UIST 2026 adjunct paper, once the author list and DOI are in hand.
]

/** An empty list hides the section. */
export const HONOURS: { year: number; title: T }[] = [
  // TODO
]

export const SECTIONS: Record<SectionKey, { name: T; blurb: T }> = {
  research: { name: 'Research', blurb: 'Research projects, prototypes and course research.' },
  design: { name: 'Design & Engineering', blurb: 'Interactive systems, web pages and prototypes.' },
  art: { name: 'Art · Music', blurb: 'Music and other work that does not need to be useful.' },
  writing: { name: 'Writing', blurb: 'Essays and notes.' },
}
export const ABOUT_NAME: T = 'About'

/**
 * Photos: every image in src/assets/photos/ shows up on /photos, newest file name first,
 * so name files by date (2026-11-03-zurich.jpg). A caption is optional, keyed by file name.
 */
export const PHOTO_CAPTIONS: Record<string, string> = {
  // '2026-11-03-zurich.jpg': 'Zürich, early November',
}

/**
 * Random: short, unfiltered posts on /random, newest first. `image` is a path under src/assets/.
 * e.g. { date: '2026-11-24', text: 'Built a whole website instead of sleeping.', image: 'random/website.jpg' }
 */
export const RANDOM: { date: string; text: string; image?: string }[] = [
]

/** Shown, labelled as samples, only while RANDOM is empty. */
export const SAMPLE_POSTS: typeof RANDOM = [
  { date: '2026-11-24', text: 'Sample post. A one-line thought goes here: something noticed on the tram, a half-baked idea, a joke that only works at 2 a.m.' },
  { date: '2026-11-20', text: 'Sample post with a picture. A post can carry one image: a screenshot, a sketch, a meme.', image: 'random/2026-11-20.jpg' },
  { date: '2026-11-12', text: 'Sample post. Real posts will replace these three.' },
]

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
  /** Live pages and code, shown on the work page. */
  links?: { label: T; href: string }[]
  body: Block[]
}

const LIVE: T = 'Live site'
const CODE: T = 'Code'

const P = (text: string): Block => ({ type: 'p', text })
const H = (text: string): Block => ({ type: 'h', text })
const IMG = (file: string, ratio: string, cap: string): Block => ({ type: 'img', file, ratio, cap })
const REFS = (...items: string[]): Block => ({ type: 'refs', items })

export const WORKS: Work[] = [
  {
    slug: 'labsty', title: 'Labsty', sec: ['design'], year: 2026, date: '2026-11-22',
    venue: 'TUM XR Value Creation Hackathon 2026, Bad Tölz · team 404 Morning Not Found',
    summary: 'A seven-minute VR lab-safety inspection for Meta Quest 3',
    role: 'Unity development (team of five)',
    tools: 'Unity 6, C#, Meta Quest 3, Unity Localization',
    links: [
      { label: 'Devpost', href: 'https://devpost.com/software/404-morning-not-found' },
      { label: CODE, href: 'https://github.com/tobikenobix/Labsty' },
      { label: 'LinkedIn post', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7531032858241449986/' },
    ],
    body: [
      P('Labsty replaces lab-safety slides with a seven-minute, zero-risk inspection in virtual reality. A student enters their ID in a briefing room, practises the controls in a small practice room, then has seven minutes to find the hazards hidden in a chemistry lab and decide how to fix each one. At the end they get a report card: pass, retraining, or safety review.'),
      IMG('works/labsty/context.jpg', '16/9', 'The virtual chemistry lab on Meta Quest 3'),
      H('Context'),
      P('We built it in four days at the hackathon of Extended Reality for Value Creation in Businesses, a course run by the TUM School of Management and ETH Zürich, in Bad Tölz from 19 to 22 November 2026. The team pivoted on site from an earlier idea to lab safety, because the need was clearer and the impact stronger.'),
      H('How it works'),
      P('Three scenes. In the lobby the student picks a language (English, German, French or Italian) and their dominant hand. A tutorial walks through seven practice steps: teleport, turn, inspect a safe object, answer a hazard question, pick a dangerous answer on purpose, open the task panel and finish. Then the lab: point at an object and press the trigger to inspect it. A hazard opens a four-option question; a right answer resolves it, a wrong one gives a line of feedback.'),
      P('There are ten hazards. Four are safety-critical and appear in every run: a blocked emergency exit, an unlabelled bottle, a damaged power cable and improper chemical storage. Each hazard draws from a pool of questions, and hazards land at a random spot inside their own zone each run, so a second attempt is not a memory test.'),
      H('Scoring'),
      P('Finding a hazard is worth 3 points and a correct first answer 7, with a penalty for random clicking. Choosing a dangerous answer, or missing a safety-critical hazard, sends the student to a safety review whatever the score; a score under 80 means retraining. Every run is exported as JSON and CSV, so a lab manager can see who needs what.'),
      P('All interface panels are drawn as world-space sign plates in the style of ISO 7010 safety signs, and a left-handed mode mirrors the controls.'),
    ],
  },
  {
    slug: 'emotimath', title: 'EmotiMath', sec: ['research', 'design'], year: 2026, date: '2026-11-02',
    venue: 'UIST 2026 Student Innovation Contest',
    links: [
      { label: 'Project page', href: 'https://emotimath.github.io/DemoPage/' },
      { label: CODE, href: 'https://github.com/EmotiMath' },
    ],
    summary: 'An AI math tutor that reads math anxiety',
    role: 'HCI and learning technology (team of three)',
    tools: 'EmotiBit, Python, cvxEDA, WESAD, Claude API, Whisper, React Native',
    body: [
      P('EmotiMath is a math tutor that changes how it explains things based on signals from the body. The student wears an EmotiBit sensor on a finger; the system estimates frustration and cognitive load from electrodermal activity and decides whether to explain the next step with concrete objects, a picture, or symbols.'),
      IMG('works/emotimath/context.jpg', '16/9', 'The finger-worn EmotiBit and the tutor on a tablet'),
      H('Background'),
      P('For students with math anxiety, abstract notation such as x + 3 = 7 is a barrier in itself. Concreteness fading, from education research, moves step by step from concrete to pictorial to abstract. But today’s AI tutors cannot see non-verbal signals, so they cannot tell when to slow down and step back.'),
      H('Approach'),
      P('The sensor sits on a finger, where the electrodermal signal is strongest. A sliding window extracts the tonic level and skin-conductance responses; a classifier trained on the WESAD dataset estimates frustration and load. The tutor itself runs on the Claude API, and students can simply talk to it, with speech transcribed by Whisper.'),
      P('The controller works in both directions: under high load it falls back to a more concrete representation, and when the student is doing well it moves toward the abstract. To avoid breaking a train of thought, it only steps back at the end of a turn, never right after a correct answer and never in the middle of a question.'),
      { type: 'video', file: 'works/emotimath/demo.mp4', duration: '', cap: 'Project video' },
      H('What I learned'),
      P('The baseline has to be measured during an easy chat rather than silent rest, because talking itself changes the electrodermal signal. A correct answer does not mean the student is relaxed either: under load, a right answer can be a guess, so answers cannot be used to recalibrate the baseline.'),
      H('Outcome'),
      P('EmotiMath was our entry to the UIST 2026 Student Innovation Contest and was demoed live at the conference in Detroit in November 2026.'),
      REFS(
        'Mark H. Ashcraft. 2002. Math anxiety: Personal, educational, and cognitive consequences. Current Directions in Psychological Science 11, 5.',
        'Emily R. Fyfe, Nicole M. McNeil, Ji Y. Son, and Robert L. Goldstone. 2014. Concreteness fading in mathematics and science instruction: A systematic review. Educational Psychology Review 26, 1.',
        'Philip Schmidt, Attila Reiss, Robert Duerichen, Claus Marberger, and Kristof Van Laerhoven. 2018. Introducing WESAD, a multimodal dataset for wearable stress and affect detection. In Proc. ICMI ’18.',
        'Alberto Greco, Gaetano Valenza, Antonio Lanata, Enzo Pasquale Scilingo, and Luca Citi. 2016. cvxEDA: A convex optimization approach to electrodermal activity processing. IEEE Transactions on Biomedical Engineering 63, 4.',
      ),
    ],
  },
  {
    slug: 'eyetrack-explorer', title: 'EyeTrack Explorer', sec: ['design', 'writing'], year: 2026,
    venue: 'ETH Zürich · DIET course, individual blog',
    links: [
      { label: LIVE, href: 'https://belown.github.io/EyeTrack_Explorer/' },
      { label: CODE, href: 'https://github.com/Belown/EyeTrack_Explorer' },
    ],
    summary: 'An interactive web page that explains eye tracking',
    role: 'Solo project',
    body: [
      P('EyeTrack Explorer is an interactive web page about eye tracking, where readers drag and hover to try the ideas out for themselves instead of only reading about them.'),
      IMG('works/eyetrack-explorer/context.jpg', '16/9', 'Screenshot of the page'),
      H('Iteration'),
      P('The professor approved the content but found the interactive parts not intuitive enough: readers should know what to click without being told. So I gave every interactive element one consistent visual language, added hints such as “Drag to adjust” and “Hover to explore”, and removed hover effects from cards that do nothing, so they no longer suggest a false affordance.'),
    ],
  },
  {
    slug: 'omen', title: 'Θmen', sec: ['design'], year: 2026,
    venue: 'ETH Zürich · DIET course, team project',
    role: 'Chapter 1 and UI (team of five)',
    summary: 'An interactive detective story about AI bias and fairness',
    tools: 'React, TypeScript, Vite, React Router',
    links: [
      { label: LIVE, href: 'https://belown.github.io/omen-ai-fairness/' },
      { label: CODE, href: 'https://github.com/Belown/omen-ai-fairness' },
    ],
    body: [
      P('Θmen is an educational website about AI bias and fairness, told as a time-travel detective story. In the fictional city of Novus, an automated justice system that looks objective reaches a harmful verdict; players investigate and trace that outcome back through the points in the AI pipeline that shaped it.'),
      IMG('works/omen/context.jpg', '16/9', 'Landing page: the city of Novus and the case'),
      H('Who it is for'),
      P('It is written for learners meeting AI fairness for the first time, with no programming required. Playable scenarios, case-file evidence, assessments and reflection prompts make abstract ideas something you can inspect and discuss.'),
      H('Structure'),
      P('The site has a landing page that introduces the case, a pre- and post-assessment, three interactive chapters, teaching resources for the classroom and an about page. The chapters follow three places where bias enters: sampling bias (who is in the data and who is missing), fairness trade-offs (why different definitions of fairness conflict), and human feedback and alignment (how human preferences, labels and judgements shape model outputs).'),
      P('Together the chapters make one point: AI bias is rarely caused by a single broken model. It emerges from a chain of choices about data collection, fairness goals, system design and human feedback.'),
      H('Illustrations should look like real data'),
      P('The classifier-boundary illustration for the trade-off first separated the two groups of points cleanly, so the boundary looked decorative. Letting the groups overlap near the boundary, with about a tenth of the points on the wrong side, is what made the point visible: any real boundary mislabels someone, and the trade-off cannot be avoided.'),
    ],
  },
]

/** Sections that have at least one work; empty ones stay out of the navigation until they get one. */
export const SECTION_KEYS = (Object.keys(SECTIONS) as SectionKey[]).filter((k) => WORKS.some((w) => w.sec.includes(k)))

export const workBySlug = (slug?: string) => WORKS.find((w) => w.slug === slug)
export const worksIn = (k: SectionKey) => WORKS.filter((w) => w.sec.includes(k))
/** Date shown for a work: its own date, or its year. */
export const whenOf = (w: Work) => w.date ?? String(w.year)
