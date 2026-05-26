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
  'streaming-translate': dynamic(
    () =>
      import('./streaming-translate/streaming-translate-demo').then(
        (m) => m.StreamingTranslateDemo
      ),
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
