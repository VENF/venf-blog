'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { TTSSegment } from './ tts'

export type AudioPlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

function estimateDuration(text: string, speed: number): number {
  const words = text.split(/\s+/).length
  return (words / 150) * (1 / speed) * 60
}

function findSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    voices.find((v) => v.lang.startsWith('es') && v.localService) ||
    voices.find((v) => v.lang.startsWith('es')) ||
    null
  )
}

export function useTTS() {
  const [state, setState] = useState<AudioPlayerState>('idle')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [speed, setSpeedState] = useState(1)

  const segmentsRef = useRef<TTSSegment[]>([])
  const stateRef = useRef<AudioPlayerState>('idle')
  const currentSegmentRef = useRef(0)
  const startTimeRef = useRef(0)
  const pausedAtRef = useRef(0)
  const durationRef = useRef(0)
  const speedRef = useRef(1)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speakSegmentRef = useRef<(index: number) => void>(undefined)

  const updateState = useCallback((newState: AudioPlayerState) => {
    stateRef.current = newState
    setState(newState)
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrentTime((pausedAtRef.current + Date.now() - startTimeRef.current) / 1000)
    }, 100)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const speakSegment = useCallback(
    (index: number) => {
      const segments = segmentsRef.current
      if (index >= segments.length) {
        stopTimer()
        updateState('paused')
        return
      }

      currentSegmentRef.current = index
      const segment = segments[index]

      const utterance = new SpeechSynthesisUtterance(segment.text)
      utterance.lang = 'es-MX'
      utterance.rate = speedRef.current
      if (voiceRef.current) utterance.voice = voiceRef.current

      const segDuration = estimateDuration(segment.text, speedRef.current)

      utterance.onstart = () => {
        startTimeRef.current = Date.now()
      }

      utterance.onend = () => {
        pausedAtRef.current += segDuration * 1000
        speakSegmentRef.current?.(index + 1)
      }

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') return
        setError(`Error de voz: ${e.error}`)
        updateState('error')
      }

      window.speechSynthesis.speak(utterance)
    },
    [updateState, stopTimer]
  )

  const speakSegmentImpl = speakSegment
  useEffect(() => {
    speakSegmentRef.current = speakSegmentImpl
  }, [speakSegmentImpl])

  const load = useCallback(
    (segments: TTSSegment[]) => {
      stopTimer()
      window.speechSynthesis.cancel()

      if (!segments.length) return

      segmentsRef.current = segments
      currentSegmentRef.current = 0
      pausedAtRef.current = 0
      startTimeRef.current = 0

      const totalDuration = segments.reduce(
        (acc, s) => acc + estimateDuration(s.text, speedRef.current),
        0
      )
      durationRef.current = totalDuration
      setDuration(totalDuration)
      setCurrentTime(0)
      setError(null)
      updateState('paused')

      if (!voiceRef.current) {
        const voices = window.speechSynthesis.getVoices()
        const found = findSpanishVoice(voices)
        voiceRef.current = found
      }
    },
    [updateState, stopTimer]
  )

  const play = useCallback(() => {
    if (!segmentsRef.current.length) return

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      startTimeRef.current = Date.now()
      startTimer()
      updateState('playing')
      return
    }

    if (currentSegmentRef.current < segmentsRef.current.length) {
      startTimeRef.current = Date.now()
      startTimer()
      updateState('playing')
      speakSegment(currentSegmentRef.current)
    }
  }, [updateState, startTimer, speakSegment])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    stopTimer()
    pausedAtRef.current += Date.now() - startTimeRef.current
    updateState('paused')
  }, [updateState, stopTimer])

  const toggle = useCallback(() => {
    if (stateRef.current === 'playing') pause()
    else play()
  }, [play, pause])

  const seek = useCallback(
    (time: number) => {
      stopTimer()
      window.speechSynthesis.cancel()

      setCurrentTime(time)
      pausedAtRef.current = time * 1000
      startTimeRef.current = 0

      const segments = segmentsRef.current
      let accumulated = 0
      let target = segments.length - 1
      for (let i = 0; i < segments.length; i++) {
        const segDuration = estimateDuration(segments[i].text, speedRef.current)
        if (accumulated + segDuration >= time) {
          target = i
          break
        }
        accumulated += segDuration
      }
      currentSegmentRef.current = target

      if (stateRef.current === 'playing') {
        startTimer()
        speakSegment(target)
      }
    },
    [startTimer, speakSegment, stopTimer]
  )

  const setSpeed = useCallback(
    (newSpeed: number) => {
      const wasPlaying = stateRef.current === 'playing'
      const currentPos =
        (pausedAtRef.current + (wasPlaying ? Date.now() - startTimeRef.current : 0)) / 1000

      stopTimer()
      window.speechSynthesis.cancel()

      speedRef.current = newSpeed
      setSpeedState(newSpeed)

      const segments = segmentsRef.current
      const newTotal = segments.reduce((acc, s) => acc + estimateDuration(s.text, newSpeed), 0)
      durationRef.current = newTotal
      setDuration(newTotal)

      pausedAtRef.current = currentPos * 1000
      startTimeRef.current = 0

      let accumulated = 0
      let target = segments.length - 1
      for (let i = 0; i < segments.length; i++) {
        const segDuration = estimateDuration(segments[i].text, newSpeed)
        if (accumulated + segDuration >= currentPos) {
          target = i
          break
        }
        accumulated += segDuration
      }
      currentSegmentRef.current = target

      if (wasPlaying) {
        startTimer()
        speakSegment(target)
      }
    },
    [startTimer, speakSegment, stopTimer]
  )

  const cleanup = useCallback(() => {
    stopTimer()
    window.speechSynthesis.cancel()
    segmentsRef.current = []
    currentSegmentRef.current = 0
    pausedAtRef.current = 0
    startTimeRef.current = 0
    durationRef.current = 0
    updateState('idle')
    setCurrentTime(0)
    setDuration(0)
    setError(null)
  }, [updateState, stopTimer])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const synth = window.speechSynthesis

    const loadVoices = () => {
      const voices = synth.getVoices()
      if (!voiceRef.current) {
        const found = findSpanishVoice(voices)
        voiceRef.current = found
      }
    }

    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices)
      cleanup()
    }
  }, [cleanup])

  return {
    state,
    currentTime,
    duration,
    error,
    speed,
    load,
    play,
    pause,
    toggle,
    seek,
    setSpeed,
    cleanup,
  }
}
