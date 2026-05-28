'use client'

import { RotateCcw } from 'lucide-react'
import type { CapturerState } from './types'

type Props = {
  capturerState: CapturerState
  elapsed: number
  onReset: () => void
}

function formatTimer(ms: number): string {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

export function TimerDisplay({ capturerState, elapsed, onReset }: Props) {
  if (capturerState === 'idle')
    return (
      <>
        <span className="text-sm tabular-nums text-muted-foreground">{formatTimer(elapsed)}</span>
      </>
    )

  return (
    <>
      <span className="text-sm tabular-nums text-muted-foreground">{formatTimer(elapsed)}</span>
      <button
        onClick={onReset}
        className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
      >
        <RotateCcw className="size-4 stroke-white/60" />
      </button>
    </>
  )
}
