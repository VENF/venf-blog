import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/projects'

type Props = {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/code/${project.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border p-5 transition-colors hover:bg-muted/50"
    >
      <div>
        <h3 className="text-base font-semibold group-hover:text-foreground transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </div>
      {project.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  )
}
