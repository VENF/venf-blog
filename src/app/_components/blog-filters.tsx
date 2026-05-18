'use client'

import { cn } from '@/lib/utils'

type Props = {
  years: string[]
  tags: string[]
  selectedYear: string | null
  selectedTag: string | null
  onYearChange: (year: string | null) => void
  onTagChange: (tag: string | null) => void
}

export function BlogFilters({
  years,
  tags,
  selectedYear,
  selectedTag,
  onYearChange,
  onTagChange,
}: Props) {
  if (years.length === 0 && tags.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap gap-6">
      {years.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Year</span>
          <button
            onClick={() => onYearChange(null)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              !selectedYear
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Todos
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(selectedYear === year ? null : year)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                selectedYear === year
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Tag</span>
          <button
            onClick={() => onTagChange(null)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              !selectedTag
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Todos
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(selectedTag === tag ? null : tag)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                selectedTag === tag
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
