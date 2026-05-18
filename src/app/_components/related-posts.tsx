import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/interfaces/post'
import DateFormatter from './date-formatter'

type Props = {
  currentSlug: string
  tags: string[]
  allPosts: Post[]
}

export function RelatedPosts({ currentSlug, tags, allPosts }: Props) {
  const related = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      matchCount: tags.filter((t) => p.tags?.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.matchCount - a.matchCount || new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-6">
      <h2 className="mb-4 text-lg font-semibold">Related Posts</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            {post.coverImage && (
              <div className="relative mb-2 aspect-video overflow-hidden rounded-md">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            )}
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-foreground transition-colors">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              <DateFormatter dateString={post.date} />
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
