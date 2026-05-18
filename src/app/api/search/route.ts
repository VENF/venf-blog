import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/api'
import { buildSearchIndex, searchPosts } from '@/lib/search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const posts = getAllPosts()
  const records = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    tags: p.tags || [],
  }))

  const index = buildSearchIndex(records)
  const results = searchPosts(index, q)

  return NextResponse.json(results)
}
