import { useMemo, useCallback, useEffect, useRef } from 'react'
import { useFormFlowStore } from '../stores/flow-store'
import { useStreamStore } from '../stores/stream-store'
import { useFormStore } from '../stores/form-store'
import { readSseStream } from '../helpers/read-sse-stream'
import type { FieldDef } from '../plugins/types'
import type { AnalyzerOutput } from '@/app/api/form-streamer/agents/types'

const STATE_TIMEOUTS: Record<string, number> = {
  connecting: 30000,
  analyzing: 20000,
  generating: 60000,
  validating: 10000,
  submitting: 10000,
}

export function useStreamingForm() {
  const store = useFormFlowStore()
  const state = store.status
  const error = store.error
  const question = store.question
  const timeoutRef = useRef<number | null>(null)

  const parsedPartial = useStreamStore((s) => s.parsedPartial)
  const pushChunk = useStreamStore((s) => s.push)
  const resetStream = useStreamStore((s) => s.reset)

  const fields = useFormStore((s) => s.fields)
  const upsertFields = useFormStore((s) => s.upsertFields)
  const resetForm = useFormStore((s) => s.reset)

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setupTimeout = useCallback(
    (currentState: string) => {
      clearTimeout()
      const ms = STATE_TIMEOUTS[currentState]
      if (!ms) return

      timeoutRef.current = window.setTimeout(() => {
        store.setError(`Request timed out after ${ms / 1000}s`)
      }, ms)
    },
    [clearTimeout, store]
  )

  useEffect(() => {
    if (state !== 'error' && state !== 'complete' && state !== 'idle') {
      setupTimeout(state)
    } else {
      clearTimeout()
    }
  }, [state, setupTimeout, clearTimeout])

  useEffect(() => {
    const val = parsedPartial?.value
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const value = val as Record<string, unknown>
      if (value.fields && Array.isArray(value.fields)) {
        upsertFields(value.fields as FieldDef[])
      }
    }
  }, [parsedPartial, upsertFields])

  const parsedValue = useMemo(() => {
    const val = parsedPartial?.value
    if (!val || typeof val !== 'object' || Array.isArray(val)) return null
    return val as Record<string, unknown>
  }, [parsedPartial])

  const formTitle = useMemo(() => {
    return parsedValue && typeof parsedValue.title === 'string' ? parsedValue.title : null
  }, [parsedValue])

  const formSubmitLabel = useMemo(() => {
    return parsedValue && typeof parsedValue.submitLabel === 'string'
      ? parsedValue.submitLabel
      : null
  }, [parsedValue])

  const runPipeline = useCallback(
    async (prompt: string) => {
      const res = await fetch('/api/form-streamer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      store.setConnected()

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Analysis failed' }))
        store.setError(err.error ?? 'Analysis failed')
        return
      }

      if (res.headers.get('Content-Type')?.includes('application/json')) {
        const analysis: AnalyzerOutput = await res.json()
        store.setAmbiguous(
          analysis.question ?? 'Necesito más detalles.',
          analysis.context?.knownFields ?? [],
          analysis.context?.missingInfo ?? []
        )
        return
      }

      store.setClear()
      await readSseStream(res.body!.getReader(), pushChunk)
      store.setStreamDone()
      store.setValid()
    },
    [store, pushChunk]
  )

  const start = useCallback(
    async (prompt: string) => {
      resetStream()
      resetForm()
      clearTimeout()
      store.start(prompt)

      try {
        await runPipeline(prompt)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unexpected error'
        store.setError(message)
      }
    },
    [store, resetStream, resetForm, clearTimeout, runPipeline]
  )

  const answerFeedback = useCallback(
    async (feedback: string) => {
      store.sendFeedback()
      clearTimeout()
      const enrichedPrompt = `${store.prompt}\n\nAI: ${store.question ?? ''}\nUser: ${feedback}`

      try {
        await runPipeline(enrichedPrompt)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unexpected error'
        store.setError(message)
      }
    },
    [store, clearTimeout, runPipeline]
  )

  const submit = useCallback(async () => {
    if (state !== 'interactive') return
    store.setSubmitting()
    const values = Object.fromEntries(useFormStore.getState().fields.map((f) => [f.name, f.value]))
    console.log('Form submitted:', values)
    store.setSuccess()
  }, [state, store])

  const retry = useCallback(() => {
    resetStream()
    resetForm()
    clearTimeout()
    store.retry()
  }, [store, resetStream, resetForm, clearTimeout])

  return {
    state,
    error,
    question,
    fields,
    formTitle,
    formSubmitLabel,
    start,
    answerFeedback,
    submit,
    retry,
  }
}
