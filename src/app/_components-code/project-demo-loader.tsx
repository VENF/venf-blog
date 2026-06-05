'use client'

import dynamic from 'next/dynamic'

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      Cargando…
    </div>
  )
}

const demos: Record<string, React.ComponentType> = {
  'policy-quote-tool': dynamic(
    () => import('../../features/policy-quote-tool/view/quoter-view').then((m) => m.QuoterPage),
    { loading: Loading }
  ),
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
    <div className="flex items-center justify-center">
      <DemoComponent />
    </div>
  )
}
