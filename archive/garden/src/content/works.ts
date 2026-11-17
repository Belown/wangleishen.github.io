import type { SectionKey } from './site'

export type Work = {
  slug: string
  title: string
  section: SectionKey
  summary: string
  year: number
  venue: string // conference for research, type for everything else
  question: string
  role: string
  team: string
  tools: string
  authors?: string // research only, "Ada Lin" is highlighted
  award?: string
  beta?: boolean
  duration?: string // music
  track?: string // id in tracks.ts
  model?: boolean // show a 3D viewer (src/assets/works/<slug>/model.glb)
  demo?: 'mood' | 'tree'
  /** Optional overrides of the section's default case-study text. */
  process?: [string, string]
  outcome?: string
  quote?: [string, string]
}

export const WORKS: Work[] = [
  { slug: 'softfold', title: 'Softfold', section: 'research', summary: 'Pneumatic textile that answers touch', venue: 'CHI 2026', year: 2026,
    question: 'what if a sleeve could squeeze back when you squeeze it?', role: 'Lead researcher', team: 'with M. Aoki, J. Brand, R. Okafor',
    tools: 'Silicone casting, Arduino, Unity', model: true, track: 'softfold-hum', authors: 'Ada Lin, Mei Aoki, Jonas Brand, Rui Okafor' },
  { slug: 'hum-atlas', title: 'Hum Atlas', section: 'research', summary: 'Mapping the voice onto the skin', venue: 'UIST 2025', year: 2025,
    question: 'can you feel the shape of your own voice?', role: 'First author', team: 'with T. Varga, L. Chen', tools: 'Python, vibrotactile arrays',
    award: 'Best Paper Award', authors: 'Ada Lin, Tamás Varga, Lin Chen' },
  { slug: 'slow-mail', title: 'Slow Mail', section: 'research', summary: 'Letters that arrive when you are ready', venue: 'DIS 2024', year: 2024,
    question: 'what would email look like if it respected your mood?', role: 'Co-author', team: 'with S. Haddad', tools: 'React Native, diary study',
    authors: 'Sara Haddad, Ada Lin' },
  { slug: 'tidal-clock', title: 'Tidal Clock', section: 'design', summary: 'Brass, water and one moon cycle', venue: 'Object', year: 2025,
    question: 'could a clock show time the way the sea does?', role: 'Designer & maker', team: 'Solo', tools: 'Brass, borosilicate, stepper motor', model: true },
  { slug: 'paper-synth', title: 'Paper Synth', section: 'design', summary: 'A sequencer folded from one sheet', venue: 'Instrument', year: 2024,
    question: 'how cheap can an instrument be and still feel precious?', role: 'Designer & engineer', team: 'with K. Ito', tools: 'Conductive ink, ESP32' },
  { slug: 'warm-cup', title: 'Warm Cup', section: 'design', summary: 'Ceramic that holds heat like a hand', venue: 'Product', year: 2023,
    question: 'what does it feel like to be handed tea by someone who loves you?', role: 'Product designer', team: 'Studio project', tools: 'Slip casting, thermal simulation' },
  { slug: 'night-garden', title: 'Night Garden', section: 'art', summary: 'Projection, 12-minute loop', venue: 'Installation', year: 2025,
    question: 'what does a garden dream about?', role: 'Artist', team: 'Sound by R. Okafor', tools: 'TouchDesigner, three projectors', track: 'night-garden' },
  { slug: 'small-hours', title: 'Small Hours', section: 'art', summary: 'Ink on rice paper, nine sheets', venue: 'Series', year: 2023,
    question: 'what is left of a night you could not sleep?', role: 'Artist', team: 'Solo', tools: 'Sumi ink, xuan paper' },
  { slug: 'goldberg-aria', title: 'Goldberg Aria', section: 'music', summary: 'Bach, BWV 988, studio recording', venue: 'Piano', year: 2025, duration: '3:52',
    track: 'goldberg', question: 'how slowly can the aria be played before it falls apart?', role: 'Pianist', team: 'Recorded by L. Chen', tools: 'Steinway B, two AKG C414' },
  { slug: 'gymnopedie', title: 'Gymnopédie No. 1', section: 'music', summary: 'Satie, live in Zürich', venue: 'Piano', year: 2024, duration: '3:18',
    track: 'gymnopedie', question: 'can a room full of strangers hold one quiet piece together?', role: 'Pianist', team: 'Live recording', tools: 'Hall piano, room mics' },
  { slug: 'mood-weather', title: 'Mood Weather', section: 'experiments', summary: "Today's forecast for your feelings", venue: 'Web toy', year: 2026,
    demo: 'mood', beta: true, question: 'what if feelings had a forecast?', role: 'Everything', team: 'Solo', tools: 'TypeScript' },
  { slug: 'which-tree', title: 'Which tree are you?', section: 'experiments', summary: 'A daily quiz with one answer per day', venue: 'Web toy', year: 2025,
    demo: 'tree', beta: true, question: 'what would a horoscope written by a botanist say?', role: 'Everything', team: 'Solo', tools: 'TypeScript' },
  { slug: 'cropkit', title: 'Cropkit', section: 'experiments', summary: 'Crop photos by describing them', venue: 'Tool', year: 2024,
    question: 'can you crop a photo with a sentence?', role: 'Everything', team: 'Solo', tools: 'Python, a vision model' },
  { slug: 'teapot-no-2', title: 'Teapot No. 2', section: 'experiments', summary: 'The Utah teapot, thrown in clay', venue: 'Object', year: 2023,
    question: 'what does the most-rendered object in graphics feel like in the hand?', role: 'Maker', team: 'Solo', tools: 'Stoneware, 3D-printed former' },
]

export const workBySlug = (slug?: string) => WORKS.find((w) => w.slug === slug)

/** Default case-study text per section, used when a work does not override it. */
export const SECTION_COPY: Record<SectionKey, { process: [string, string]; outcome: string; quote: [string, string] }> = {
  research: {
    process: ['We started with a week of bodystorming, then built three prototypes, each one softer than the last.',
      'A within-subjects study (n = 18) compared the final prototype with a rigid baseline. People held the soft one longer and described it in warmer words.'],
    outcome: 'Published at {venue}. The prototype now lives in the lab demo cabinet, slightly deflated.',
    quote: ['It felt like the sleeve was listening.', 'Participant 7'],
  },
  design: {
    process: ['Sketches first, then foam, then a lot of brass that did not work.', 'The final version went through two rounds of machining and one week of testing on a café counter.'],
    outcome: 'Shown at Design Days {year}. A small batch is planned.',
    quote: ['I keep picking it up for no reason.', 'A café regular'],
  },
  art: {
    process: ['It began as one page of notes and a single photograph.', 'The piece was made over three months, mostly at night, with the window open.'],
    outcome: 'Exhibited in {year}. A print edition is available on request.',
    quote: ['I stayed for the whole loop. Twice.', 'A visitor'],
  },
  music: {
    process: ['Recorded in one afternoon, in two takes.', 'There are no edits between sections, and the room noise stays in.'],
    outcome: 'Released in {year}.',
    quote: ['You can hear the snow outside.', 'A listener'],
  },
  experiments: {
    process: ['Built in a weekend to answer one question.', 'It is still in beta and probably always will be.'],
    outcome: 'Still online. Visited by about 40 people a day, mostly the same 40.',
    quote: ['Why is this so accurate?', 'A user, at 1 am'],
  },
}
