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
