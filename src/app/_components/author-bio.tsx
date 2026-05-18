import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { Author } from '@/interfaces/author'

type Props = {
  author: Author
}

export function AuthorBio({ author }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
      <Avatar size="lg">
        <AvatarImage src={author?.picture ?? ''} alt={author?.name ?? 'default'} />
        <AvatarFallback>{author?.name.charAt(0) ?? 'default'}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">{author?.name ?? 'default'}</p>
        <p className="text-xs text-muted-foreground">
          Software engineer &amp; writer. Building things that matter.
        </p>
        <a
          href="https://github.com/venf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          @venf
        </a>
      </div>
    </div>
  )
}
