import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

const projectsDir = join(process.cwd(), '_projects')

export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  demo: boolean
}

export type ProjectWithReadme = Project & {
  readme: string
}

function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDir)) return []
  return fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function parseMeta(slug: string): Project | null {
  const metaPath = join(projectsDir, slug, 'meta.md')
  if (!fs.existsSync(metaPath)) return null

  // @ts-expect-error — gray-matter types don't include `date` but it works at runtime
  const { data } = matter.read(metaPath, { date: false })

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    tags: data.tags || [],
    date: data.date || '',
    demo: Boolean(data.demo),
  }
}

export function getProjectBySlug(slug: string): ProjectWithReadme | null {
  const meta = parseMeta(slug)
  if (!meta) return null

  const readmePath = join(projectsDir, slug, 'readme.md')
  const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : ''

  return { ...meta, readme }
}

export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs()
  const projects = slugs
    .map(parseMeta)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return projects
}
