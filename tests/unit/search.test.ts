import { describe, it, expect } from 'vitest'
import { buildSearchIndex, searchPosts, type SearchRecord } from '@/lib/search'

const mockPosts: SearchRecord[] = [
  {
    slug: 'post-1',
    title: 'React Hooks Guide',
    excerpt: 'Learn hooks',
    date: '2023-01-01',
    tags: ['react', 'hooks'],
  },
  {
    slug: 'post-2',
    title: 'TypeScript Tips',
    excerpt: 'Advanced TS',
    date: '2024-01-01',
    tags: ['typescript'],
  },
  {
    slug: 'post-3',
    title: 'Hexagonal Architecture',
    excerpt: 'Clean architecture',
    date: '2023-06-01',
    tags: ['architecture', 'react'],
  },
]

describe('buildSearchIndex', () => {
  it('returns a fuse instance and records', () => {
    const result = buildSearchIndex(mockPosts)
    expect(result).toHaveProperty('fuse')
    expect(result).toHaveProperty('records')
    expect(result.records).toEqual(mockPosts)
  })
})

describe('searchPosts', () => {
  const index = buildSearchIndex(mockPosts)

  it('returns all posts on empty query', () => {
    const results = searchPosts(index, '')
    expect(results).toHaveLength(3)
  })

  it('filters by title', () => {
    const results = searchPosts(index, 'React')
    expect(results).toHaveLength(2)
    expect(results.every((r) => r.slug.startsWith('post-'))).toBe(true)
  })

  it('filters by year', () => {
    const results = searchPosts(index, '', { year: '2023' })
    expect(results).toHaveLength(2)
    expect(results.every((r) => r.date.startsWith('2023'))).toBe(true)
  })

  it('filters by tag', () => {
    const results = searchPosts(index, '', { tags: ['typescript'] })
    expect(results).toHaveLength(1)
    expect(results[0].slug).toBe('post-2')
  })

  it('composes year and tag filters with AND logic', () => {
    const results = searchPosts(index, '', { year: '2023', tags: ['react'] })
    expect(results).toHaveLength(2)
  })
})
