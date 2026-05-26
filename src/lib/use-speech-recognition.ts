/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

declare class SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export type SpeechState = 'idle' | 'listening' | 'error'

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechState>('idle')
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const stateRef = useRef<SpeechState>('idle')
  const manualStopRef = useRef(false)

  const updateState = useCallback((s: SpeechState) => {
    stateRef.current = s
    setState(s)
  }, [])

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('SpeechRecognition no está disponible en este navegador')
      updateState('error')
      return
    }

    manualStopRef.current = false

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new (SpeechRecognition as any)() as SpeechRecognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-MX'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = ''
      let currentInterim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          currentInterim += result[0].transcript
        }
      }

      if (final) {
        setTranscript((prev) => prev + final)
      }
      setInterim(currentInterim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (manualStopRef.current) return
      if (event.error === 'no-speech') return
      setError(`Error: ${event.error}`)
      updateState('error')
    }

    recognition.onend = () => {
      if (!manualStopRef.current && stateRef.current === 'listening') {
        try {
          recognition.start()
        } catch {}
      }
    }

    recognition.start()
    recognitionRef.current = recognition
    updateState('listening')
  }, [updateState])

  const stop = useCallback(() => {
    manualStopRef.current = true
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    updateState('idle')
  }, [updateState])

  const reset = useCallback(() => {
    setTranscript('')
    setInterim('')
    setError(null)
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return { state, transcript, interim, error, isSupported, start, stop, reset }
}
