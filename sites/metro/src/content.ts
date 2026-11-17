// All content lives here, in both languages. Everything is placeholder: replace it with your own.
// Files (images, video, audio, PDFs) go in src/assets/ at the path each placeholder shows.

export type T = { zh: string; en: string }
export type SectionKey = 'research' | 'design' | 'art' | 'writing'

export const OWNER = {
  name: { zh: '林雅', en: 'Ada Lin' },
  bio: { zh: '做可以拿在手里的东西：研究、设计、音乐和文字。', en: 'I make things you can hold: research, design, music and words.' },
  about: [
    {
      zh: '我在做软的、可触摸的界面：会回握你的织物，用水做的钟，等你准备好才到达的信。做研究之前我学的是产品设计，再之前，是钢琴。',
      en: 'I work on soft, tangible interfaces: textiles that squeeze back, clocks made of water, letters that wait until you are ready. Before research I trained as a product designer, and before that, as a pianist.',
    },
    {
      zh: '这个网站是我放东西的地方。论文、做过的东西、拍的照片、弹的曲子、写的字，都在这里，不分先后。',
      en: 'This site is where I keep things. Papers, objects, photographs, recordings and writing all live here, in no particular order of importance.',
    },
  ] as T[],
  email: 'hello@ada-lin.example',
  links: [
    { label: { zh: 'GitHub', en: 'GitHub' }, href: '' },
    { label: { zh: '照片', en: 'Photos' }, href: '' },
    { label: { zh: '简历 PDF', en: 'CV (PDF)' }, href: '' },
  ],
  portrait: 'about/portrait.jpg',
}

export const SECTIONS: Record<SectionKey, { name: T; blurb: T }> = {
  research: { name: { zh: '研究', en: 'Research' }, blurb: { zh: '关于触摸、声音和慢的论文与原型。', en: 'Papers and prototypes about touch, voice and slowness.' } },
  design: { name: { zh: '设计与工程', en: 'Design & Engineering' }, blurb: { zh: '里面有马达、水和陶土的东西，可以拿起来的东西。', en: 'Objects with motors, water and clay in them. Things you can pick up.' } },
  art: { name: { zh: '艺术·音乐·摄影', en: 'Art · Music · Photo' }, blurb: { zh: '不需要有用的作品：墨、光、长长的循环，还有钢琴。', en: 'Work that does not need to be useful: ink, light, long loops and the piano.' } },
  writing: { name: { zh: '写作', en: 'Writing' }, blurb: { zh: '随笔、笔记，和还没想明白的事。', en: 'Essays, notes and things I am still figuring out.' } },
}
export const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[]
export const ABOUT_NAME: T = { zh: '关于', en: 'About' }

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

export type Work = {
  slug: string
  title: T
  summary: T
  sec: SectionKey[] // first one is its home section; a second one means it belongs to both
  year: number
  date?: string // publication or posting date, YYYY-MM-DD
  role?: T
  tools?: T
  venue?: string
  body: Block[]
}

const P = (zh: string, en: string): Block => ({ type: 'p', text: { zh, en } })
const H = (zh: string, en: string): Block => ({ type: 'h', text: { zh, en } })

/** A standard case-study body, used unless a work writes its own. */
function caseBody(slug: string, q: T, extra: Block[] = []): Block[] {
  return [
    { type: 'p', text: { zh: `一切从一个问题开始：${q.zh}`, en: `It started with a question: ${q.en}` } },
    { type: 'img', file: `works/${slug}/context.jpg`, ratio: '16/9', cap: { zh: '最早的草图', en: 'The first sketch' } },
    H('过程', 'Process'),
    P('先画草图，再做泡沫模型，然后是一大堆做坏了的版本。', 'Sketches first, then foam, then a lot of versions that did not work.'),
    { type: 'gallery', folder: `works/${slug}`, count: 3, ratio: '4/3', cap: { zh: '过程，从左到右', en: 'Process, left to right' } },
    P('最后的版本经过了两轮修改，和一周在真实环境里的测试。', 'The final version went through two rounds of changes and a week of testing in a real setting.'),
    ...extra,
    H('结果', 'Outcome'),
    { type: 'img', file: `works/${slug}/final.jpg`, ratio: '3/2', cap: { zh: '完成的样子', en: 'The finished piece' } },
  ]
}

export const WORKS: Work[] = [
  {
    slug: 'softfold', title: { zh: '软褶', en: 'Softfold' }, sec: ['research', 'design'], year: 2026, date: '2026-03-12', venue: 'CHI 2026',
    summary: { zh: '一种会回握你的气动织物', en: 'A pneumatic textile that squeezes back' },
    role: { zh: '主要研究者', en: 'Lead researcher' }, tools: { zh: '硅胶浇注、Arduino', en: 'Silicone casting, Arduino' },
    body: caseBody('softfold', { zh: '如果袖子能在你握它的时候回握你呢？', en: 'what if a sleeve could squeeze back when you squeeze it?' }, [
      { type: 'video', file: 'works/softfold/demo.mp4', duration: '0:42', cap: { zh: '握住、停留、松开', en: 'Squeeze, hold, release' } },
      { type: 'pdf', file: 'works/softfold/paper.pdf', title: { zh: '论文全文', en: 'Full paper' }, pages: 10 },
    ]),
  },
  {
    slug: 'hum-atlas', title: { zh: '哼声图谱', en: 'Hum Atlas' }, sec: ['research', 'art'], year: 2025, date: '2025-09-20', venue: 'UIST 2025',
    summary: { zh: '把声音的形状映射到皮肤上', en: 'Mapping the shape of a voice onto the skin' },
    role: { zh: '第一作者', en: 'First author' }, tools: { zh: 'Python、振动阵列', en: 'Python, vibrotactile arrays' },
    body: caseBody('hum-atlas', { zh: '你能摸到自己声音的形状吗？', en: 'can you feel the shape of your own voice?' }, [
      { type: 'audio', file: 'audio/hum-atlas.mp3', title: { zh: '一段哼唱和它的振动', en: 'A hum and its vibration' } },
      { type: 'pdf', file: 'works/hum-atlas/paper.pdf', title: { zh: '论文全文', en: 'Full paper' }, pages: 12 },
    ]),
  },
  {
    slug: 'slow-mail', title: { zh: '慢信', en: 'Slow Mail' }, sec: ['research'], year: 2024, date: '2024-06-02', venue: 'DIS 2024',
    summary: { zh: '等你准备好了才送到的信', en: 'Letters that arrive when you are ready' },
    role: { zh: '合作作者', en: 'Co-author' }, tools: { zh: '日记研究、手机应用', en: 'Diary study, mobile app' },
    body: caseBody('slow-mail', { zh: '如果电子邮件尊重你的心情，会是什么样子？', en: 'what would email look like if it respected your mood?' }),
  },
  {
    slug: 'tidal-clock', title: { zh: '潮汐钟', en: 'Tidal Clock' }, sec: ['design'], year: 2025,
    summary: { zh: '黄铜、水和一个月亮周期', en: 'Brass, water and one moon cycle' },
    role: { zh: '设计与制作', en: 'Designer and maker' }, tools: { zh: '黄铜、硼硅玻璃、步进电机', en: 'Brass, borosilicate glass, stepper motor' },
    body: caseBody('tidal-clock', { zh: '钟能不能像海一样告诉你时间？', en: 'could a clock tell time the way the sea does?' }),
  },
  {
    slug: 'paper-synth', title: { zh: '纸合成器', en: 'Paper Synth' }, sec: ['design'], year: 2024,
    summary: { zh: '一张纸折出来的音序器', en: 'A sequencer folded from one sheet' },
    role: { zh: '设计与工程', en: 'Design and engineering' }, tools: { zh: '导电墨水、ESP32', en: 'Conductive ink, ESP32' },
    body: caseBody('paper-synth', { zh: '一件乐器能有多便宜，又还让人觉得珍贵？', en: 'how cheap can an instrument be and still feel precious?' }, [
      { type: 'audio', file: 'audio/paper-synth.mp3', title: { zh: '纸合成器的一段录音', en: 'A recording of the Paper Synth' } },
    ]),
  },
  {
    slug: 'warm-cup', title: { zh: '暖杯', en: 'Warm Cup' }, sec: ['design'], year: 2023,
    summary: { zh: '像一只手一样保温的陶杯', en: 'A ceramic cup that holds heat like a hand' },
    role: { zh: '产品设计', en: 'Product design' }, tools: { zh: '注浆成型、热模拟', en: 'Slip casting, thermal simulation' },
    body: caseBody('warm-cup', { zh: '被爱你的人递一杯茶，是什么感觉？', en: 'what does it feel like to be handed tea by someone who loves you?' }),
  },
  {
    slug: 'night-garden', title: { zh: '夜园', en: 'Night Garden' }, sec: ['art', 'design'], year: 2025, date: '2025-03-07',
    summary: { zh: '投影装置，十二分钟循环', en: 'A projection installation on a 12-minute loop' },
    role: { zh: '艺术家', en: 'Artist' }, tools: { zh: 'TouchDesigner、三台投影仪', en: 'TouchDesigner, three projectors' },
    body: caseBody('night-garden', { zh: '一座花园会梦见什么？', en: 'what does a garden dream about?' }, [
      { type: 'video', file: 'works/night-garden/loop.mp4', duration: '12:00', cap: { zh: '完整循环', en: 'The full loop' } },
    ]),
  },
  {
    slug: 'small-hours', title: { zh: '夜半', en: 'Small Hours' }, sec: ['art'], year: 2023,
    summary: { zh: '宣纸上的墨，九张', en: 'Ink on rice paper, nine sheets' },
    role: { zh: '艺术家', en: 'Artist' }, tools: { zh: '墨、宣纸', en: 'Ink, rice paper' },
    body: caseBody('small-hours', { zh: '一个睡不着的夜晚，最后还剩下什么？', en: 'what is left of a night you could not sleep?' }),
  },
  {
    slug: 'goldberg-aria', title: { zh: '哥德堡咏叹调', en: 'Goldberg Aria' }, sec: ['art'], year: 2025,
    summary: { zh: '巴赫，BWV 988，录音室录音', en: 'Bach, BWV 988, a studio recording' },
    role: { zh: '钢琴', en: 'Piano' },
    body: [
      { type: 'audio', file: 'audio/goldberg-aria.mp3', title: { zh: '哥德堡咏叹调', en: 'Goldberg Aria' } },
      P('一个下午录完，两遍。段落之间没有剪辑，房间里的声音也都留着。', 'Recorded in one afternoon, in two takes. No edits between sections, and the room noise stays in.'),
      { type: 'embed', service: 'YouTube', title: { zh: '演奏视频', en: 'Performance video' } },
    ],
  },
  {
    slug: 'lake-frames', title: { zh: '湖上十二帧', en: 'Twelve Frames of a Lake' }, sec: ['art'], year: 2024,
    summary: { zh: '同一片湖，一年里的十二个早晨', en: 'One lake, twelve mornings across a year' },
    role: { zh: '摄影', en: 'Photography' }, tools: { zh: '胶片相机', en: 'Film camera' },
    body: [
      P('每个月的第一个早晨，同一个位置，同一个角度。', 'The first morning of every month, from the same spot, at the same angle.'),
      { type: 'gallery', folder: 'works/lake-frames', count: 12, ratio: '3/2', cap: { zh: '一月到十二月', en: 'January to December' } },
    ],
  },
  {
    slug: 'soft-machines', title: { zh: '软机器，硬情绪', en: 'Soft machines, hard feelings' }, sec: ['writing', 'research'], year: 2026, date: '2026-10-02',
    summary: { zh: '当机器软到可以回握你时，会发生什么变化', en: 'What changes when a machine is soft enough to hold you back' },
    body: [
      P('开始做硅胶的时候，我以为会学到关于材料的事。结果学到更多的是耐心。一个软的执行器要四秒钟才能充满，在这四秒里，你会注意到自己的呼吸。',
        'When I started working with silicone, I expected to learn about materials. I learned more about patience. A soft actuator takes four seconds to fill, and in those four seconds you notice your own breathing.'),
      H('默认是硬的', 'Hard by default'),
      P('我们在屏幕上摸到的几乎所有东西，都被设计成在手指下面一动不动。这很有用，也很孤单。没有东西回推，也没有东西让步。',
        'Almost everything we touch on a screen is designed to stay the same under the finger. That is useful, and it is also lonely. Nothing pushes back, nothing gives way.'),
      { type: 'img', file: 'works/soft-machines/bench.jpg', ratio: '16/9', cap: { zh: '第二个原型，充了一半气', en: 'The second prototype, half inflated' } },
      { type: 'quote', text: { zh: '能被捏的机器，也就是能被安慰的机器。', en: 'A machine that can be squeezed is a machine that can be comforted.' }, cite: { zh: '实验室笔记，2026 年 3 月', en: 'Lab notebook, March 2026' } },
      H('软要求我们什么', 'What softness asks of us'),
      P('它要求更慢的研究、更长的实验和更多的茶。它要求我们把犹豫也当成数据。下面是第一只袖子成功那天夜里录的一段话：',
        'It asks for slower studies, longer sessions and more tea. It asks us to report hesitation as data. Here is the memo I recorded on the night the first sleeve worked:'),
      { type: 'audio', file: 'audio/voice-memo.mp3', title: { zh: '凌晨三点的语音备忘', en: 'Voice memo, 3 am' } },
      P('我还不知道这会走到哪里。但我知道，我想继续做可以拿在手里的东西。', 'I do not know yet where this goes. I do know that I want to keep making things you can hold.'),
    ],
  },
  {
    slug: 'mood-weather', title: { zh: '心情天气', en: 'Mood Weather' }, sec: ['writing', 'design'], year: 2026, date: '2026-05-14',
    summary: { zh: '给心情做的天气预报，一个小玩具', en: 'A weather forecast for your feelings, a small toy' },
    body: [
      P('每天早上，它给你一条“心情预报”：大致晴朗，下午四点后有零星的怀旧。', 'Every morning it gives you a forecast for your feelings: mostly calm, with scattered nostalgia after 4 pm.'),
      { type: 'img', file: 'works/mood-weather/screenshot.png', ratio: '16/10', cap: { zh: '今天的预报', en: "Today's forecast" } },
      P('做它只花了一个周末。它大概会一直是测试版。', 'It took a weekend to build. It will probably stay in beta forever.'),
    ],
  },
  {
    slug: 'slow-interfaces', title: { zh: '慢界面小宣言', en: 'A small manifesto for slow interfaces' }, sec: ['writing'], year: 2024, date: '2024-12-30',
    summary: { zh: '一年的最后一天写下的七句话', en: 'Seven sentences written on the last day of the year' },
    body: [
      P('一、界面应该可以等待。', '1. An interface should be able to wait.'),
      P('二、通知是请求，不是命令。', '2. Notifications are a request, not an order.'),
      P('三、沉默也是一种有效的输出。', '3. Silence is a valid output.'),
      P('四、你触摸的东西，也应该触摸你。', '4. Things you touch should touch back.'),
      P('五、速度是一个设置，不是一种美德。', '5. Speed is a setting, not a virtue.'),
      P('六、给手留出位置。', '6. Leave room for the hand.'),
      P('七、让停下来变得容易。', '7. Make it easy to stop.'),
    ],
  },
  {
    slug: 'notes-from-uist', title: { zh: 'UIST 笔记', en: 'Notes from UIST' }, sec: ['writing'], year: 2025, date: '2025-10-21',
    summary: { zh: '五天，三百个演示，和一个没想到的奖', en: 'Five days, three hundred demos, and one award I did not expect' },
    body: [
      P('最好的演示都是安静的。一只只在你快要掉东西时才振动的手套；一把在你呼吸变慢时会往后靠几度的椅子。',
        'The best demos were the quiet ones. A glove that only vibrated when you were about to drop something. A chair that leaned back a few degrees when your breathing slowed.'),
      { type: 'img', file: 'works/notes-from-uist/hall.jpg', ratio: '3/2', cap: { zh: '演示大厅', en: 'The demo hall' } },
      P('我带回来一本写满问题的笔记本，还有给明年的一条规矩：少带幻灯片，多带东西。', 'I came back with a notebook full of questions and one rule for next year: bring fewer slides and more objects.'),
    ],
  },
]

export const workBySlug = (slug?: string) => WORKS.find((w) => w.slug === slug)
export const worksIn = (k: SectionKey) => WORKS.filter((w) => w.sec.includes(k))
/** Date shown for a work: its own date, or its year. */
export const whenOf = (w: Work) => w.date ?? String(w.year)
