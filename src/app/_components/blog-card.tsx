import Link from 'next/link'
import Image from 'next/image'
import DateFormatter from './date-formatter'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/interfaces/post'

type Props = {
  post: Post
}

export function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted/50"
    >
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <DateFormatter dateString={post.date} />
        </div>
        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
