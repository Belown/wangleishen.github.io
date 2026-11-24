/**
 * Drop-in assets: put a file in src/assets/ at the path a placeholder shows
 * (e.g. src/assets/works/softfold/cover.jpg) and the placeholder becomes the real thing.
 * Images may use any of jpg/jpeg/png/webp/avif/gif regardless of the extension shown.
 */
const files = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,svg,mp4,webm,mov,mp3,m4a,wav,ogg,pdf}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i

export function asset(path: string): string | undefined {
  const key = '/src/assets/' + path
  if (files[key]) return files[key]
  if (!IMAGE.test(path)) return undefined
  const base = key.replace(IMAGE, '')
  const hit = Object.keys(files).find((k) => k.replace(IMAGE, '') === base && IMAGE.test(k))
  return hit && files[hit]
}
