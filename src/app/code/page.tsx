import { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Código | venf',
}

export default function CodePage() {
  const projects = getAllProjects()

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
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/code/${project.slug}`}
            className="my-2 inline-block hover:text-muted-foreground"
          >
            {project.slug}
          </Link>
        ))}
      </div>
    </div>
  )
}
