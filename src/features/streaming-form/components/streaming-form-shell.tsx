'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useStreamingForm } from '../hooks/use-streaming-form'
import { FormRenderer } from './form-renderer'
import { PromptPanel } from './prompt-panel'
import { StatusBar } from './status-bar'
import { ErrorPanel } from './error-panel'
import { FeedbackPanel } from './feedback-panel'
import { Card, CardContent } from '@/components/ui/card'

interface StreamingFormShellProps {
  initialPrompt?: string
  mock?: boolean
}

export function StreamingFormShell({ initialPrompt, mock }: StreamingFormShellProps) {
  const {
    state,
    error,
    question,
    formTitle,
    formSubmitLabel,
    submit,
    start,
    retry,
    globalError,
    answerFeedback,
  } = useStreamingForm({ mock })
  const [prompt, setPrompt] = useState(initialPrompt ?? '')
  const hasStarted = useRef(false)

  useEffect(() => {
    if (initialPrompt && !hasStarted.current) {
      hasStarted.current = true
      start(initialPrompt)
    }
  }, [initialPrompt, start])

  const handleStart = useCallback(() => {
    if (!prompt.trim()) return
    start(prompt.trim())
  }, [prompt, start])

  const handleFeedback = useCallback(
    (feedback: string) => {
      answerFeedback(feedback)
    },
    [answerFeedback]
  )

  const showForm =
    state === 'generating' ||
    state === 'validating' ||
    state === 'interactive' ||
    state === 'submitting' ||
    state === 'complete'

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-2">
      <StatusBar
        state={state}
        message={globalError && state !== 'error' ? globalError : undefined}
      />

      {globalError && state !== 'error' && <ErrorPanel error={globalError} onRetry={retry} />}

      <PromptPanel
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleStart}
        disabled={!prompt.trim()}
        submitLabel={state === 'idle' ? 'Generate Form' : 'Try Again'}
        message={state === 'error' ? (error ?? 'An error occurred') : null}
        messageVariant={state === 'error' ? 'destructive' : undefined}
      />

      {state === 'waiting_feedback' && question && (
        <FeedbackPanel question={question} onSubmit={handleFeedback} />
      )}

      <Card>
        <CardContent>
          <FormRenderer
            onSubmit={submit}
            formTitle={formTitle}
            submitLabel={formSubmitLabel ?? undefined}
            isStreaming={state === 'generating'}
          />
        </CardContent>
      </Card>
    </div>
  )
}
