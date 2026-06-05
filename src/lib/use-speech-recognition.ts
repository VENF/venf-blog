/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from 'react'

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

const BACKOFF_DELAYS = [300, 1000, 2000, 4000]
const MAX_BACKOFF = 8000
const SESSION_TIMEOUT = 5 * 60 * 1000

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechState>('idle')
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSupported = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    () => false
  )

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const stateRef = useRef<SpeechState>('idle')
  const manualStopRef = useRef(false)
  const retryCountRef = useRef(0)
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateState = useCallback((s: SpeechState) => {
    stateRef.current = s
    setState(s)
  }, [])

  const clearTimeouts = useCallback(() => {
    if (restartTimeoutRef.current !== null) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }
    if (sessionTimeoutRef.current !== null) {
      clearTimeout(sessionTimeoutRef.current)
      sessionTimeoutRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    manualStopRef.current = true
    clearTimeouts()
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    updateState('idle')
  }, [updateState, clearTimeouts])

  const stopRef = useRef(stop)
  useEffect(() => {
    stopRef.current = stop
  }, [stop])

  const start = useCallback(() => {
    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionConstructor) {
      setError('SpeechRecognition no está disponible en este navegador')
      updateState('error')
      return
    }

    manualStopRef.current = false
    retryCountRef.current = 0
    clearTimeouts()

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new (SpeechRecognitionConstructor as any)() as SpeechRecognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-MX'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      retryCountRef.current = 0

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
      if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado. Concede permisos desde la barra de direcciones.')
      } else {
        setError(`Error: ${event.error}`)
      }
      updateState('error')
    }

    recognition.onend = () => {
      if (manualStopRef.current || stateRef.current !== 'listening') return

      const delayIndex = Math.min(retryCountRef.current, BACKOFF_DELAYS.length - 1)
      const delay = Math.min(BACKOFF_DELAYS[delayIndex], MAX_BACKOFF)
      retryCountRef.current += 1

      restartTimeoutRef.current = setTimeout(() => {
        try {
          recognition.start()
        } catch {
          updateState('error')
        }
      }, delay)
    }

    recognition.start()
    recognitionRef.current = recognition
    updateState('listening')

    sessionTimeoutRef.current = setTimeout(() => {
      stopRef.current()
    }, SESSION_TIMEOUT)
  }, [updateState, clearTimeouts])

  const reset = useCallback(() => {
    setTranscript('')
    setInterim('')
    setError(null)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeouts()
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [clearTimeouts])

  return { state, transcript, interim, error, isSupported, start, stop, reset }
}
