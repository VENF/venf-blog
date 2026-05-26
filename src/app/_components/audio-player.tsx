'use client'

import { useCallback, useState } from 'react'
import { Play, Pause, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { useTTS } from '@/lib/use-tts'
import { cn } from '@/lib/utils'
import type { TTSSegment } from '@/lib/tts'
import { Button } from '@/components/ui/button'

type Props = {
  segments: TTSSegment[]
  title: string
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ segments }: Props) {
  const [speedOpen, setSpeedOpen] = useState(false)

  const { state, currentTime, duration, error, speed, load, play, toggle, setSpeed } = useTTS()

  const handlePlay = useCallback(() => {
    load(segments)
    play()
  }, [segments, load, play])

  const handleToggle = useCallback(() => {
    if (state === 'idle' || state === 'paused') {
      handlePlay()
    } else {
      toggle()
    }
  }, [state, handlePlay, toggle])

  return (
    <div className="mt-4 rounded-lg p-1">
      <div className="flex items-center justify-between gap-3">
        <Button
          onClick={handleToggle}
          disabled={state === 'loading'}
          className="rounded-full size-8 cursor-pointer"
          aria-label={state === 'playing' ? 'Pausar' : 'Reproducir'}
        >
          {state === 'loading' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : state === 'playing' ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current ml-0.5" />
          )}
        </Button>

        <div className="">
          <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span className="opacity-50">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="relative shrink-0">
          <Button className="cursor-pointer" onClick={() => setSpeedOpen(!speedOpen)} size="sm">
            {speed}×
            {speedOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </Button>
          {speedOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSpeedOpen(false)} />
              <div className="absolute bottom-full right-0 z-50 mb-1 min-w-16 overflow-hidden rounded-lg border bg-popover p-1 shadow-md">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSpeed(s)
                      setSpeedOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-center rounded-md px-3 py-1.5 text-xs transition-colors',
                      s === speed
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
