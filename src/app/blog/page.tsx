import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/api'
//import { createBlogSearchIndex } from '@/lib/search'

export const metadata: Metadata = {
  title: 'Blog | venf',
}

export default function BlogPage() {
  const posts = getAllPosts()
  /*const { indexJson, records } = createBlogSearchIndex(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      tags: p.tags || [],
    }))
  )*/
  return (
    <div className="min-h-dvh p-3 sm:p-5">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mt-[48px] flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </div>
      <div className="mx-auto max-w-6xl flex flex-col mt-10">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="my-2 inline-block hover:text-muted-foreground"
          >
            {post.slug}
          </Link>
        ))}
      </div>
    </div>
  )
}
//<BlogPageClient posts={posts} indexJson={indexJson} records={records} />
