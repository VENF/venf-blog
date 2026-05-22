'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStreamingForm } from '../hooks/use-streaming-form'
import { FormRenderer } from './form-renderer'
import { PromptPanel } from './prompt-panel'
import { StatusBar } from './status-bar'
import { FeedbackPanel } from './feedback-panel'

interface StreamingFormShellProps {
  initialPrompt?: string
}

const blurTransition = {
  initial: { filter: 'blur(8px)' as const, opacity: 0 },
  animate: { filter: 'blur(0px)' as const, opacity: 1 },
  exit: { filter: 'blur(8px)' as const, opacity: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
} as const

export function StreamingFormShell({ initialPrompt }: StreamingFormShellProps) {
  const { state, error, question, formTitle, formSubmitLabel, submit, start, answerFeedback } =
    useStreamingForm()
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

  const contentKey = showForm
    ? 'form'
    : state === 'waiting_feedback' && question
      ? 'feedback'
      : 'prompt'

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-2">
      <StatusBar state={state} />

      <AnimatePresence mode="wait">
        {contentKey === 'form' && (
          <motion.div key="form" {...blurTransition}>
            <div className="p-5 rounded-2xl dark:bg-[#1A1A1A] dark:shadow-lg dark:border-3 dark:border-[#0C0C0C]">
              <FormRenderer
                onSubmit={submit}
                formTitle={formTitle}
                submitLabel={formSubmitLabel ?? undefined}
                isStreaming={state === 'generating'}
              />
            </div>
          </motion.div>
        )}

        {contentKey === 'feedback' && (
          <motion.div key="feedback" {...blurTransition}>
            <FeedbackPanel question={question!} onSubmit={handleFeedback} />
          </motion.div>
        )}

        {contentKey === 'prompt' && (
          <motion.div key="prompt" {...blurTransition}>
            <PromptPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleStart}
              disabled={!prompt.trim()}
              submitLabel={state === 'idle' ? 'Generate Form' : 'Try Again'}
              message={state === 'error' ? (error ?? 'An error occurred') : null}
              messageVariant={state === 'error' ? 'destructive' : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
