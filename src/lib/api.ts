import { Post } from '@/interfaces/post'
import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

const postsDirectory = join(process.cwd(), '_posts')

function walkDir(dir: string, prefix = ''): string[] {
  const slugs: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name)
  })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isFile() && entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.md$/, '')
      slugs.push(prefix ? `${prefix}/${slug}` : slug)
    } else if (entry.isDirectory()) {
      slugs.push(...walkDir(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name))
    }
  }

  return slugs
}

export function getPostSlugs() {
  return walkDir(postsDirectory)
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')

  const directPath = join(postsDirectory, `${realSlug}.md`)
  if (fs.existsSync(directPath)) {
    const fileContents = fs.readFileSync(directPath, 'utf8')
    const { data, content } = matter(fileContents)
    return { ...data, slug: realSlug, content } as Post
  }

  return null
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export type TreeNode = {
  title: string
  href: string | null
  items?: TreeNode[]
}

export function buildTree(posts: Post[]): TreeNode[] {
  const sorted = [...posts].sort((a, b) => (a.date > b.date ? -1 : 1))

  const folderSet = new Set<string>()
  for (const post of sorted) {
    const segments = post.slug.split('/')
    for (let i = 0; i < segments.length - 1; i++) {
      folderSet.add(segments.slice(0, i + 1).join('/'))
    }
  }

  function childrenFor(parentPath: string): TreeNode[] {
    const nodes: TreeNode[] = []
    const prefix = parentPath ? parentPath + '/' : ''

    const childFolders = new Set<string>()
    for (const folderPath of folderSet) {
      if (folderPath.startsWith(prefix)) {
        const rest = folderPath.slice(prefix.length)
        const first = rest.split('/')[0]
        if (first && !rest.includes('/')) {
          childFolders.add(first)
        }
      }
    }

    for (const name of [...childFolders].sort()) {
      const fullPath = prefix + name
      const children = childrenFor(fullPath)
      const title = name.charAt(0).toUpperCase() + name.slice(1)
      nodes.push({ title, href: null, items: children })
    }

    for (const post of sorted) {
      if (parentPath && !post.slug.startsWith(prefix)) continue
      if (!parentPath && post.slug.includes('/')) continue

      const rest = parentPath ? post.slug.slice(prefix.length) : post.slug
      if (rest.includes('/')) continue

      nodes.push({ title: post.title, href: `/posts/${post.slug}` })
    }

    return nodes
  }

  return childrenFor('')
}
