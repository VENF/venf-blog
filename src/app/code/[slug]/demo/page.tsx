import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProjectBySlug } from '@/lib/projects'
import { ProjectDemoLoader } from '@/app/_components-code/project-demo-loader'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function DemoPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project || !project.demo) return notFound()

  return (
    <div className="min-h-dvh">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <Link
          href={`/code/${slug}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          {project.title}
        </Link>
      </div>
      <ProjectDemoLoader slug={slug} />
    </div>
  )
}
