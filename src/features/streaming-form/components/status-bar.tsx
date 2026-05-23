'use client'
import { useFormFlowDisplay } from '../hooks/use-form-flow-display'
import type { FlowStatus } from '../stores/flow-store'

interface StatusBarProps {
  state: FlowStatus
  message?: string
  fieldIndex?: number
  fieldCount?: number | null
}

export function StatusBar({ state, message, fieldIndex = 0, fieldCount }: StatusBarProps) {
  const { badgeInfo, statusMessage } = useFormFlowDisplay(state)

  return (
    <div className="relative bg-[#000] p-5">
      <div className="flex items-center justify-center gap-3">
        <badgeInfo.icon size={24} stop={badgeInfo.stop} color={badgeInfo.color} />
        <span className="text-sm text-muted-foreground">{message ?? statusMessage}</span>
      </div>
      {state === 'generating' && fieldIndex > 0 && (
        <div className="mt-2 text-center text-xs text-muted-foreground/60">
          {fieldCount ? `Campo ${fieldIndex} de ${fieldCount}` : `Campo ${fieldIndex}...`}
        </div>
      )}
    </div>
  )
}
