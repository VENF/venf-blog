import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug, getAllTags } from '@/lib/api'

describe('getAllPosts', () => {
  it('returns an array of posts', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
  })

  it('sorts posts by date descending', () => {
    const posts = getAllPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      )
    }
  })

  it('each post has required fields', () => {
    const posts = getAllPosts()
    for (const post of posts) {
      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('date')
      expect(post).toHaveProperty('tags')
      expect(Array.isArray(post.tags)).toBe(true)
    }
  })
})

describe('getPostBySlug', () => {
  it('returns a post for a valid slug', () => {
    const post = getPostBySlug('solid')
    expect(post).not.toBeNull()
    expect(post!.title).toBeTruthy()
    expect(post!.content).toBeTruthy()
  })

  it('returns null for an invalid slug', () => {
    expect(getPostBySlug('non-existent-post')).toBeNull()
  })
})

describe('getAllTags', () => {
  it('returns an array of unique tags', () => {
    const posts = getAllPosts()
    const tags = getAllTags(posts)
    expect(Array.isArray(tags)).toBe(true)
    expect(new Set(tags).size).toBe(tags.length)
  })
})
