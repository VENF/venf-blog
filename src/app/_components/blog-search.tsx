'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function BlogSearch({ value, onChange }: Props) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timer)
  }, [local, onChange])

  return (
    <div className="relative mb-6">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search posts..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
