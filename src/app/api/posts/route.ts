import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const tag = searchParams.get('tag')

  let posts = getAllPosts()

  if (year) {
    posts = posts.filter((p) => p.date.startsWith(year))
  }

  if (tag) {
    posts = posts.filter((p) => p.tags?.includes(tag))
  }
  const body = posts.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...rest } = p
    return rest
  })

  return NextResponse.json(body)
}
