'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (!active) return

    const startTime = Date.now() - elapsedRef.current
    const id = setInterval(() => {
      elapsedRef.current = Date.now() - startTime
      setElapsed(elapsedRef.current)
    }, 100)
    return () => clearInterval(id)
  }, [active])

  const resetTimer = useCallback(() => {
    setElapsed(0)
    elapsedRef.current = 0
  }, [])

  return { elapsed, resetTimer }
}
