import type { MDXContent } from 'mdx/types'

export type PostMeta = { title: string; date: string; read: number; tags: string[]; lede: string }
export type Post = PostMeta & { slug: string; Body: MDXContent }

// Every .mdx file in ./posts is a journal post; its file name is the URL slug.
const modules = import.meta.glob<{ default: MDXContent; meta: PostMeta }>('./posts/*.mdx', { eager: true })

export const POSTS: Post[] = Object.entries(modules)
  .map(([path, m]) => ({ slug: path.split('/').pop()!.replace(/\.mdx$/, ''), ...m.meta, Body: m.default }))
  .sort((a, b) => b.date.localeCompare(a.date))

export const postBySlug = (slug?: string) => POSTS.find((p) => p.slug === slug)
