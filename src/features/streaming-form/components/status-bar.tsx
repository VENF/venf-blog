'use client'
import { useFormFlowDisplay } from '../hooks/use-form-flow-display'
import type { FlowStatus } from '../stores/flow-store'

interface StatusBarProps {
  state: FlowStatus
  message?: string
}

export function StatusBar({ state, message }: StatusBarProps) {
  const { badgeInfo, statusMessage } = useFormFlowDisplay(state)

  return (
    <div className="bg-[#000] relative top-[0px] p-5">
      <div className="flex items-center justify-center gap-3">
        <badgeInfo.icon size={24} stop={badgeInfo.stop} color={badgeInfo.color} />
        <span className="text-sm text-muted-foreground">{message ?? statusMessage}</span>
      </div>
    </div>
  )
}
