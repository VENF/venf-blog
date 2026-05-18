import { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import { ProjectCard } from '@/app/_components-code/project-card'

export const metadata: Metadata = {
  title: 'Código | venf',
}

export default function CodigoPage() {
  const projects = getAllProjects()

  return (
    <div className="min-h-dvh p-3 sm:p-5">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tighter">Código</h1>
        <p className="mb-8 text-muted-foreground">Interactive demos and experiments.</p>
        {projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">No projects yet.</p>
        )}
      </div>
    </div>
  )
}
