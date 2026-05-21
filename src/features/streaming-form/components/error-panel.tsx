'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ErrorPanelProps {
  error: string
  onRetry: () => void
}

export function ErrorPanel({ error, onRetry }: ErrorPanelProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}
