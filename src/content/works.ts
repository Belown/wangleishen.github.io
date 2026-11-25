import { SECTIONS } from './sections'
import type { Block, SectionKey, T, Work } from './types'

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
      { label: 'Demo video', href: 'https://www.youtube.com/watch?v=L2NQEc2XW90' },
      { label: 'APK (Meta Quest 3)', href: 'https://drive.google.com/drive/folders/1s6aAPIAGR54X01kFwhztC496xoYbdZ0z' },
      { label: 'Devpost', href: 'https://devpost.com/software/404-morning-not-found' },
      { label: CODE, href: 'https://github.com/tobikenobix/Labsty' },
      { label: 'LinkedIn post', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7531032858241449986/' },
    ],
    body: [
      P('Labsty replaces lab-safety slides with a seven-minute, zero-risk inspection in virtual reality. A student enters their ID in a briefing room, practises the controls in a small practice room, then has seven minutes to find the hazards hidden in a chemistry lab and decide how to fix each one. At the end they get a report card: pass, retraining, or safety review.'),
      { type: 'youtube', id: 'L2NQEc2XW90', cap: 'Demo video' },
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
    paper: {
      title: 'EmotiMath: Biosignal-Driven Adaptive Representation in AI Math Tutoring',
      authors: [
        { name: 'Wanglei Shen', aff: [1] },
        { name: 'Laura Alisa Bock', aff: [1, 2] },
        { name: 'Manusha Karunathilaka', aff: [3] },
      ],
      affiliations: ['ETH Zürich', 'UniDistance Suisse', 'Singapore Management University'],
      mentors: [
        { name: 'April Wang', aff: 'ETH Zürich', href: 'https://aprilwang.me/' },
        { name: 'Julia Chatain', aff: 'CHLX, UniDistance Suisse', href: 'https://juliachatain.com/' },
        { name: 'Jiannan Li', aff: 'Singapore Management University', href: 'https://jchrisli.github.io/' },
      ],
      venue: 'UIST Adjunct ’26 · Student Innovation Contest · Detroit, MI, USA',
      doi: '10.1145/3830397.3841316',
      pdf: 'works/emotimath/paper.pdf',
      abstract: 'Students with math anxiety often struggle when mathematics is presented in abstract symbolic form. While human tutors can detect non-verbal signs of frustration and adapt instruction accordingly, AI tutors typically respond only to explicit verbal cues. We present EmotiMath, a voice-first, tablet-based math tutor that estimates students’ cognitive load from EmotiBit physiological signals and adapts the lesson along the concrete–pictorial–abstract continuum. A hysteretic controller prompts a speech-to-speech tutor to step one level back when cognitive load remains high or move forward when it remains low; the tutor executes or declines each request based on the student’s responses. Validated offline on two public corpora with subject-grouped splits, the load model reaches 0.718 AUC on the working-memory task closest to arithmetic, where chance is 0.5, and 0.796 pooled, where corpus identity alone already reaches 0.588.',
      bibtex: `@inproceedings{shen2026emotimath,
  author = {Shen, Wanglei and Bock, Laura Alisa and Karunathilaka, Manusha},
  title = {EmotiMath: Biosignal-Driven Adaptive Representation in AI Math Tutoring},
  year = {2026},
  isbn = {979-8-4007-2855-6},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3830397.3841316},
  booktitle = {Adjunct Proceedings of the 39th Annual ACM Symposium on User Interface Software and Technology},
  numpages = {5},
  keywords = {physiological sensing, concreteness fading, adaptive tutoring, math anxiety, wearable biosignals, EmotiBit},
  location = {Detroit, MI, USA},
  series = {UIST Adjunct '26}
}`,
    },
    links: [
      { label: 'Project page', href: 'https://emotimath.github.io/DemoPage/' },
      { label: 'Demo video', href: 'https://www.youtube.com/watch?v=Rc1iRpaRpB0' },
      { label: 'Poster', file: 'works/emotimath/poster.pdf' },
      { label: CODE, href: 'https://github.com/EmotiMath' },
    ],
    summary: 'A voice-first math tutor that adapts to the learner’s biosignals',
    role: 'First author (team of three)',
    tools: 'EmotiBit, BrainFlow, Python, scikit-learn, OpenAI Realtime API, React Native',
    body: [
      P('EmotiMath is a voice-first, tablet-based math tutor for students with math anxiety. A fingertip-worn EmotiBit streams physiological signals while the learner talks through a lesson; the system estimates cognitive load and moves the lesson along the concrete–pictorial–abstract ladder: back a step when load stays high, forward when it settles.'),
      IMG('works/emotimath/figure-1.png', '1584/584', 'Figure 1 of the paper. The controller (blue) cannot move the lesson: it sends a hidden advance or retreat request that the speech-to-speech tutor (orange) may decline, and the level actually reached is fed back (dashed).'),
      H('Background'),
      P('For students with math anxiety, abstract notation such as x + 3 = 7 is a barrier in itself. Concreteness fading presents a concept with real objects first, then pictures, then symbols [1]; read as a scaffolding ladder, it should restore support when the learner falters and withdraw it as they succeed [2]. That needs the learner’s state in real time. Human tutors read it from non-verbal cues, but AI tutors respond only to what is said.'),
      P('Math anxiety does leave a physiological trace: it raises electrodermal activity [3] while consuming the working memory that arithmetic needs [4]. Tutoring platforms adapt on interaction features that arrive only after the fact, and affect-aware tutors answer with motivational messages that leave the explanation untouched. EmotiMath adapts the representation instead.'),
      H('How it works'),
      P('The learner talks to the tutor through a tablet that shows one picture at a time, while the EmotiBit [5] streams to a laptop. The backend holds one OpenAI Realtime speech-to-speech conversation and turns its tool calls into changes of level. The tutor leads slow breathing during a 45-second calibration, opens on the concrete picture, and moves on only once the learner has shown they understand the current level.'),
      P('Two design choices define the loop. It is symmetric: physiology proposes in both directions, retreating on sustained arousal and advancing when it settles, where affect-aware tutors act only on distress. And it is advisory: the controller cannot touch the screen, only file a hidden request that the tutor may decline. The retreat note instructs; the advance note only permits, because being calm is not the same as being ready.'),
      H('Affect pipeline'),
      P('Features come from trailing 10-second windows stepped every 5 seconds. Three are model inputs: tonic EDA referenced to the learner’s own first 45 seconds, temperature slope and accelerometer RMS. A logistic regression with isotonic calibration maps them to the probability of overload, and a finite-state controller smooths it, holds one of three levels within the band [0.33, 0.70], and keeps each level for at least 20 seconds.'),
      IMG('works/emotimath/figure-2.png', '1480/646', 'Figure 2 of the paper. A schematic session: overload probability against the shipped band, with two advances and one retreat. The trace is drawn, not recorded; the band, smoothing, patience and dwell are the shipped controller’s.'),
      H('Results'),
      P('Validated offline on WESAD [6] and MAUS [7] (36 subjects, 13,701 windows, subject-grouped cross-validation), the load model reaches 0.796 AUC pooled and 0.718 on MAUS, the working-memory task closest to arithmetic, where chance is 0.5; pooled, corpus identity alone already reaches 0.588. At the shipped band, 85% of retreats land inside an overload block (47 of 55) and 69% of overload episodes draw one (25 of 36).'),
      { type: 'youtube', id: 'Rc1iRpaRpB0', cap: 'Demo video' },
      H('What it cannot claim yet'),
      P('The paper is explicit about its limits. The estimate is effectively one channel: tonic EDA alone reaches 0.789. It follows task difficulty rather than distress, so it cannot separate productive struggle [8] from overload. And every number comes from other hardware, not from the EmotiBit we ship. A retreat is therefore a bid for a simpler picture after sustained arousal, nothing stronger; the next step is to run the loop with a real learner.'),
      H('Poster and booth card'),
      P('At the Student Innovation Contest booth, a 762 × 1016 mm poster summarised the project, and an A5 card walked visitors through the live demo: wear the EmotiBit, sit through a short calibration, pick a lesson, and watch the picture adapt. The back of the card links to the project page.'),
      { type: 'gallery', folder: 'works/emotimath/poster-set', count: 3, ratio: 'auto', cap: 'The poster (762 × 1016 mm; the full PDF is under Poster at the top of the page), and the front and back of the A5 booth card. Click an image to open it at full size.' },
      H('Outcome'),
      P('EmotiMath was our entry to the UIST 2026 Student Innovation Contest. It is published in the UIST ’26 adjunct proceedings and was demoed live at the conference in Detroit in November 2026. The system, its prompts and the affect model are open source.'),
      REFS(
        'E. R. Fyfe, N. M. McNeil, J. Y. Son, and R. L. Goldstone. 2014. Concreteness Fading in Mathematics and Science Instruction: a Systematic Review. Educational Psychology Review 26, 1, 9–25. doi:10.1007/s10648-014-9249-3',
        'Janneke van de Pol, Monique Volman, and Jos Beishuizen. 2010. Scaffolding in Teacher–Student Interaction: A Decade of Research. Educational Psychology Review 22, 3, 271–296. doi:10.1007/s10648-010-9127-6',
        'R. G. Pizzie and D. J. M. Kraemer. 2021. The Association Between Emotion Regulation, Physiological Arousal, and Performance in Math Anxiety. Frontiers in Psychology 12. doi:10.3389/fpsyg.2021.639448',
        'M. H. Ashcraft. 2002. Math anxiety: Personal, educational, and cognitive consequences. Current Directions in Psychological Science 11, 5, 181–185. doi:10.1111/1467-8721.00196',
        'Sean M. Montgomery, Nitin Nair, Phoebe Chen, and Suzanne Dikker. 2023. Introducing EmotiBit, an open-source multi-modal sensor for measuring research-grade physiological signals. Science Talks 6. doi:10.1016/j.sctalk.2023.100181',
        'Philip Schmidt, Attila Reiss, Robert Duerichen, Claus Marberger, and Kristof Van Laerhoven. 2018. Introducing WESAD, a Multimodal Dataset for Wearable Stress and Affect Detection. In Proceedings of ICMI ’18, 400–408. doi:10.1145/3242969.3242985',
        'Wei-Kai Beh, Yu-Hsin Wu, and An-Yeu Wu. 2021. MAUS: A Dataset for Mental Workload Assessment on N-back Task Using Wearable Sensor. arXiv:2111.02561',
        'S. D’Mello and A. Graesser. 2012. Dynamics of affective states during complex learning. Learning and Instruction 22, 2, 145–157. doi:10.1016/j.learninstruc.2011.10.001',
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
