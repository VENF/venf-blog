import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'

export type SearchRecord = {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
}

const fuseOptions = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'tags', weight: 1.5 },
    { name: 'excerpt', weight: 1 },
  ],
  threshold: 0.4,
}

export function buildSearchIndex(posts: SearchRecord[]) {
  return { fuse: new Fuse(posts, fuseOptions), records: posts }
}

export type SearchResult = ReturnType<typeof buildSearchIndex>

export type SearchFilters = {
  year?: string | null
  tags?: string[] | null
}

export function searchPosts(
  { fuse, records }: SearchResult,
  query: string,
  filters?: SearchFilters
): SearchRecord[] {
  let results: SearchRecord[] = query
    ? fuse.search(query).map((r: FuseResult<SearchRecord>) => r.item)
    : [...records]

  if (filters?.year) {
    results = results.filter((r: SearchRecord) => r.date.startsWith(filters.year!))
  }

  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((r: SearchRecord) =>
      filters.tags!.some((t: string) => r.tags.includes(t))
    )
  }

  return results
}

export type BlogSearchData = {
  indexJson: string
  records: SearchRecord[]
}

export function createBlogSearchIndex(posts: SearchRecord[]): BlogSearchData {
  const index = Fuse.createIndex(fuseOptions.keys, posts)
  return { indexJson: JSON.stringify(index.toJSON()), records: posts }
}
