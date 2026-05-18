'use client'

import { useMemo, useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import type { SearchRecord } from '@/lib/search'
import type { Post } from '@/interfaces/post'
import { BlogSearch } from './blog-search'
import { BlogFilters } from './blog-filters'
import { BlogCard } from './blog-card'
import { cn } from '@/lib/utils'

type Props = {
  posts: Post[]
  indexJson: string
  records: SearchRecord[]
}

const PER_PAGE = 9

export function BlogPageClient({ posts, indexJson, records }: Props) {
  const [query, setQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const fuse = useMemo(() => {
    const parsedIndex = Fuse.parseIndex<SearchRecord>(JSON.parse(indexJson))
    return new Fuse(
      records,
      {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'tags', weight: 1.5 },
          { name: 'excerpt', weight: 1 },
        ],
        threshold: 0.4,
      },
      parsedIndex
    )
  }, [indexJson, records])

  const years = useMemo(() => {
    const set = new Set(posts.map((p) => p.date.slice(0, 4)))
    return Array.from(set).sort().reverse()
  }, [posts])

  const allTags = useMemo(() => {
    const set = new Set(posts.flatMap((p) => p.tags || []))
    return Array.from(set).sort()
  }, [posts])

  const postMap = useMemo(() => {
    const map = new Map<string, Post>()
    for (const p of posts) map.set(p.slug, p)
    return map
  }, [posts])

  const filtered = useMemo(() => {
    let slugs: string[] = query
      ? fuse.search(query).map((r) => r.item.slug)
      : records.map((r) => r.slug)

    if (selectedYear) {
      slugs = slugs.filter((slug) => {
        const post = postMap.get(slug)
        return post && post.date.startsWith(selectedYear)
      })
    }

    if (selectedTag) {
      slugs = slugs.filter((slug) => {
        const post = postMap.get(slug)
        return post && (post.tags || []).includes(selectedTag)
      })
    }

    const result = slugs.map((slug) => postMap.get(slug)).filter(Boolean) as Post[]
    return result
  }, [query, selectedYear, selectedTag, fuse, records, postMap])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const handleQueryChange = useCallback((val: string) => {
    setQuery(val)
    setPage(1)
  }, [])

  const handleYearChange = useCallback((year: string | null) => {
    setSelectedYear(year)
    setPage(1)
  }, [])

  const handleTagChange = useCallback((tag: string | null) => {
    setSelectedTag(tag)
    setPage(1)
  }, [])

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tighter">Blog</h1>
      <p className="mb-8 text-muted-foreground">Thoughts, notes, and explorations.</p>

      <BlogSearch value={query} onChange={handleQueryChange} />

      <BlogFilters
        years={years}
        tags={allTags}
        selectedYear={selectedYear}
        selectedTag={selectedTag}
        onYearChange={handleYearChange}
        onTagChange={handleTagChange}
      />

      {paginated.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">No posts found.</p>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={cn(
                'flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                n === safePage
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {n}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
