'use client'

import { StreamingFormShell } from '@/features/streaming-form/components/streaming-form-shell'

export default function FormStreamerDemo() {
  return (
    <div className="w-full h-full">
      <StreamingFormShell mock />
    </div>
  )
}
