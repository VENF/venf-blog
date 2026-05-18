'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type TocEntry = {
  id: string
  text: string
  level: number
}

type Props = {
  entries: TocEntry[]
}

export function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (entries.length === 0) return

    observerRef.current = new IntersectionObserver(
      (observedEntries) => {
        for (const entry of observedEntries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    )

    for (const { id } of entries) {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <nav
      className="mb-8 flex flex-wrap gap-1.5 border-b border-border pb-3"
      aria-label="Table of contents"
    >
      {entries.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            level === 3 && 'ml-2',
            activeId === id
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {text}
        </a>
      ))}
    </nav>
  )
}
