import { useCallback } from 'react'
import { fieldRegistry } from '../plugins/registry'
import { useFormStore } from '../stores/form-store'
import { FieldSkeleton } from './field-skeleton'
import type { FieldDef } from '../plugins/types'

interface DynamicFieldProps {
  field: FieldDef & { value?: unknown; error?: string }
}

export function DynamicField({ field }: DynamicFieldProps) {
  const setValue = useFormStore((s) => s.setValue)
  const plugin = fieldRegistry.get(field.type)

  const isComplete = field.label != null

  const handleChange = useCallback(
    (value: unknown) => {
      setValue(field.name, value)
    },
    [field.name, setValue]
  )

  if (!isComplete) {
    return <FieldSkeleton type={field.type} />
  }

  const Component = plugin.component
  return (
    <Component
      field={field}
      value={field.value ?? plugin.defaultValue}
      onChange={handleChange}
      error={field.error}
    />
  )
}
