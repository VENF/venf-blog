'use client'

import dynamic from 'next/dynamic'

const demos: Record<string, React.ComponentType> = {
  example: dynamic(() => import('@projects/example/page'), {
    loading: () => (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Loading demo...
      </div>
    ),
  }),
}

type Props = {
  slug: string
}

export function ProjectDemoLoader({ slug }: Props) {
  const DemoComponent = demos[slug]
  if (!DemoComponent) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Demo not found for this project.
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <DemoComponent />
    </div>
  )
}
