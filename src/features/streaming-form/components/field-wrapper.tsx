import type { ReactNode } from 'react'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import type { FieldDef } from '../plugins/types'

interface FieldWrapperProps {
  field: FieldDef
  error?: string
  labelPosition?: 'top' | 'side'
  hideLabel?: boolean
  children: ReactNode
}

export function FieldWrapper({
  field,
  error,
  labelPosition = 'top',
  hideLabel = false,
  children,
}: FieldWrapperProps) {
  const autoId = useId()
  const labelId = field.name ? `${field.name}-label` : autoId

  if (labelPosition === 'side') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {children}
          <Label htmlFor={field.name} id={labelId}>
            {field.label}
          </Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {!hideLabel && field.label && (
        <Label htmlFor={field.name} id={labelId}>
          {field.label}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
