import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Post } from '@/interfaces/post'

type Props = {
  currentSlug: string
  allPosts: Post[]
}

export function PostNavigation({ currentSlug, allPosts }: Props) {
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const idx = sorted.findIndex((p) => p.slug === currentSlug)
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null
  const next = idx > 0 ? sorted[idx - 1] : null

  return (
    <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="group flex flex-col items-start gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="size-3" />
            Previous
          </span>
          <span className="text-sm font-medium group-hover:text-foreground transition-colors line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRight className="size-3" />
          </span>
          <span className="text-sm font-medium group-hover:text-foreground transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
