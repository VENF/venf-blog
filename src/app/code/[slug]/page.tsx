import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getProjectBySlug } from '@/lib/projects'
import markdownToHtml from '@/lib/markdownToHtml'
import { Badge } from '@/components/ui/badge'
import { PostBody } from '@/app/_components/post-body'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) return notFound()

  const segments = project.readme ? await markdownToHtml(project.readme) : []

  return (
    <div className="min-h-dvh p-3 sm:p-5">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/code"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <article>
          <h1 className="text-3xl font-bold tracking-tighter mb-3">{project.title}</h1>
          <p className="text-muted-foreground mb-4">{project.description}</p>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {project.demo && (
            <Link
              href={`/code/${project.slug}/demo`}
              className="mb-8 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Ver demo
              <ExternalLink className="size-4" />
            </Link>
          )}

          {segments.length > 0 && (
            <div className="mt-8">
              <PostBody segments={segments} />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) return {}

  return {
    title: `${project.title} | venf`,
  }
}
