'use client'

import { useState } from 'react'
import { LiveWaveform } from '@/components/ui/live-waveform'
import type { CapturerState } from './types'

type Props = {
  capturerState: CapturerState
}

export function LiveCapturer({ capturerState }: Props) {
  const [mode] = useState<'static' | 'scrolling'>('static')

  const active = capturerState === 'capturing'
  const processing = capturerState === 'capturing'

  return (
    <div className="space-y-4 relative [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
      <LiveWaveform
        active={active}
        processing={processing}
        height={80}
        barWidth={3}
        barGap={2}
        mode={mode}
        fadeEdges={true}
        barColor="gray"
        historySize={120}
        fadeWidth={3}
        className="w-[100%]"
      />
    </div>
  )
}
