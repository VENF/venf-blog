import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormFlowStore } from '../stores/flow-store'
import { useStreamStore } from '../stores/stream-store'
import { useFormStore } from '../stores/form-store'
import { readSseStream } from '../helpers/read-sse-stream'
import type { FieldDef } from '../plugins/types'

interface UseStreamingFormOptions {
  mock?: boolean
}

interface FieldSpec {
  name: string
  type: string
  label?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  minLength?: number
  maxLength?: number
  pattern?: string
}

interface AnalyzerResponse {
  status: 'clear' | 'ambiguous'
  title?: string
  submitLabel?: string
  fields?: FieldSpec[]
  question?: string | null
  reasoning?: string | null
  context?: { knownFields: string[]; missingInfo: string[] } | null
}

const STATE_TIMEOUTS: Record<string, number> = {
  connecting: 15000,
  analyzing: 20000,
  generating: 60000,
  validating: 10000,
  submitting: 10000,
}

export function useStreamingForm(options?: UseStreamingFormOptions) {
  const mock = options?.mock ?? false
  const store = useFormFlowStore()
  const state = store.status
  const error = store.error
  const question = store.question
  const [globalError, setGlobalError] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const parsedPartial = useStreamStore((s) => s.parsedPartial)
  const pushChunk = useStreamStore((s) => s.push)
  const resetStream = useStreamStore((s) => s.reset)

  const fields = useFormStore((s) => s.fields)
  const upsertFields = useFormStore((s) => s.upsertFields)
  const buildSchema = useFormStore((s) => s.buildSchema)
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
        setGlobalError(`Timed out while in "${currentState}" state`)
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
    if (
      parsedPartial?.value &&
      typeof parsedPartial.value === 'object' &&
      !Array.isArray(parsedPartial.value)
    ) {
      const value = parsedPartial.value as Record<string, unknown>
      if (value.fields && Array.isArray(value.fields)) {
        upsertFields(value.fields as FieldDef[])
      }
    }
  }, [parsedPartial, upsertFields])

  const formTitle = useMemo(() => {
    if (!parsedPartial?.value || typeof parsedPartial.value !== 'object') return null
    const val = parsedPartial.value as Record<string, unknown>
    return typeof val.title === 'string' ? val.title : null
  }, [parsedPartial])

  const formSubmitLabel = useMemo(() => {
    if (!parsedPartial?.value || typeof parsedPartial.value !== 'object') return null
    const val = parsedPartial.value as Record<string, unknown>
    return typeof val.submitLabel === 'string' ? val.submitLabel : null
  }, [parsedPartial])

  const start = useCallback(
    async (prompt: string) => {
      resetStream()
      resetForm()
      setGlobalError(null)
      clearTimeout()
      store.start(prompt)

      try {
        const analyzeRes = await fetch(`/api/form-streamer/analyze${mock ? '?mock=true' : ''}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        })

        store.setConnected()

        if (!analyzeRes.ok) {
          const err = await analyzeRes.json().catch(() => ({ error: 'Analysis failed' }))
          store.setError(err.error ?? 'Analysis failed')
          return
        }

        const analysis: AnalyzerResponse = await analyzeRes.json()

        if (analysis.status !== 'clear') {
          store.setAmbiguous(
            analysis.question ?? 'Necesito más detalles.',
            analysis.context?.knownFields ?? [],
            analysis.context?.missingInfo ?? []
          )
          return
        }

        store.setClear()

        const generateRes = await fetch(`/api/form-streamer/generate${mock ? '?mock=true' : ''}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis }),
        })

        if (!generateRes.ok) {
          const err = await generateRes.json().catch(() => ({ error: 'Generation failed' }))
          store.setError(err.error ?? 'Generation failed')
          return
        }

        await readSseStream(generateRes.body!.getReader(), pushChunk)

        store.setStreamDone()
        store.setValid()
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unexpected error'
        store.setError(message)
      }
    },
    [mock, store, resetStream, resetForm, clearTimeout, pushChunk]
  )

  const schema = useMemo(() => {
    if (state !== 'interactive' && state !== 'submitting') return null
    return buildSchema()
  }, [state, buildSchema])

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {},
    mode: 'onSubmit',
  })

  const submit = useCallback(async () => {
    if (state !== 'interactive') return
    store.setSubmitting()
    const values = Object.fromEntries(useFormStore.getState().fields.map((f) => [f.name, f.value]))
    console.log('Form submitted:', values)
    store.setSuccess()
  }, [state, store])

  const answerFeedback = useCallback(
    async (feedback: string) => {
      store.sendFeedback()
      clearTimeout()
      setGlobalError(null)

      try {
        const enrichedPrompt = `${store.prompt}\n\nAI: ${store.question ?? ''}\nUser: ${feedback}`
        const analyzeRes = await fetch(`/api/form-streamer/analyze${mock ? '?mock=true' : ''}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: enrichedPrompt }),
        })

        store.setConnected()

        if (!analyzeRes.ok) {
          const err = await analyzeRes.json().catch(() => ({ error: 'Analysis failed' }))
          store.setError(err.error ?? 'Analysis failed')
          return
        }

        const analysis: AnalyzerResponse = await analyzeRes.json()

        if (analysis.status !== 'clear') {
          store.setAmbiguous(
            analysis.question ?? 'Necesito más detalles.',
            analysis.context?.knownFields ?? [],
            analysis.context?.missingInfo ?? []
          )
          return
        }

        store.setClear()

        const generateRes = await fetch(`/api/form-streamer/generate${mock ? '?mock=true' : ''}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis }),
        })

        if (!generateRes.ok) {
          const err = await generateRes.json().catch(() => ({ error: 'Generation failed' }))
          store.setError(err.error ?? 'Generation failed')
          return
        }

        await readSseStream(generateRes.body!.getReader(), pushChunk)

        store.setStreamDone()
        store.setValid()
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unexpected error'
        store.setError(message)
      }
    },
    [mock, store, clearTimeout, pushChunk]
  )

  const retry = useCallback(() => {
    resetStream()
    resetForm()
    setGlobalError(null)
    clearTimeout()
    store.retry()
  }, [store, resetStream, resetForm, clearTimeout])

  return {
    state,
    error,
    question,
    fields,
    form,
    globalError,
    formTitle,
    formSubmitLabel,
    start,
    answerFeedback,
    submit,
    retry,
  }
}
