import { Metadata } from 'next'
import { getAllPosts } from '@/lib/api'
import { createBlogSearchIndex } from '@/lib/search'
import { BlogPageClient } from '@/app/_components/blog-page-client'

export const metadata: Metadata = {
  title: 'Blog | venf',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const { indexJson, records } = createBlogSearchIndex(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      tags: p.tags || [],
    }))
  )

  return (
    <div className="min-h-dvh p-3 sm:p-5">
      <div className="mx-auto max-w-6xl">
        <BlogPageClient posts={posts} indexJson={indexJson} records={records} />
      </div>
    </div>
  )
}
