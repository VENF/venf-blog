'use client'

import { useState, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

export default function FormEngine() {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const handleSync = useCallback(async () => {
    abortRef.current?.abort()

    const abort = new AbortController()
    abortRef.current = abort

    setText('')
    setError(null)
    setDone(false)
    setStreaming(true)

    try {
      const res = await fetch('/api/form-streamer?mock=true', { signal: abort.signal })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          const line = part.trim()
          if (!line || !line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') {
            setDone(true)
            continue
          }
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (parsed.error) {
              setError(parsed.error)
              setDone(true)
              return
            }
            if (content) setText((prev) => prev + content)
          } catch {
            /* skip incomplete lines */
          }
        }
      }

      setDone(true)
    } catch (e) {
      if (abort.signal.aborted) return
      setError(e instanceof Error ? e.message : 'Error desconocido')
      setDone(true)
    } finally {
      setStreaming(false)
    }
  }, [])

  const buttonLabel = error ? '↻ Retry' : done ? '✓ Synced' : streaming ? 'Streaming...' : 'Sync'

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold">Form Stream</h2>

      <button
        type="button"
        disabled={streaming}
        onClick={handleSync}
        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 cursor-pointer"
      >
        {streaming && <Loader2 className="size-4 animate-spin" />}
        {buttonLabel}
      </button>

      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md w-full text-center">
          {error}
        </p>
      )}

      {text && (
        <pre
          ref={preRef}
          className="w-full bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[60vh] border"
        >
          <code>{text}</code>
          {!done && <span className="animate-pulse">▊</span>}
        </pre>
      )}

      {!text && !streaming && !error && (
        <p className="text-muted-foreground text-sm">Presiona Sync para generar un formulario</p>
      )}
    </div>
  )
}
