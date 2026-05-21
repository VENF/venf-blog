'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface FeedbackPanelProps {
  question: string
  onSubmit: (feedback: string) => void
}

export function FeedbackPanel({ question, onSubmit }: FeedbackPanelProps) {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = useCallback(() => {
    if (!feedback.trim()) return
    onSubmit(feedback.trim())
    setFeedback('')
  }, [feedback, onSubmit])

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm">{question}</p>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe más detalles..."
          rows={3}
        />
        <Button onClick={handleSubmit} disabled={!feedback.trim()}>
          Enviar respuesta
        </Button>
      </CardContent>
    </Card>
  )
}
