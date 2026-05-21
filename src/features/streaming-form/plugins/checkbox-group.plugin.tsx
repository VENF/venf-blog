import { z } from 'zod'
import { useId, useCallback, useMemo } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'

function CheckboxGroupInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const selected = useMemo(() => (value as string[]) ?? [], [value])

  const handleToggle = useCallback(
    (opt: string) => {
      const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
      onChange(next)
    },
    [selected, onChange]
  )

  return (
    <div className="flex flex-col gap-2">
      <Label id={id}>{field.label}</Label>
      <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
        {(field.options ?? []).map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${field.name}-${opt}`}
              checked={selected.includes(opt)}
              onCheckedChange={() => handleToggle(opt)}
              aria-invalid={!!error}
            />
            <Label htmlFor={`${field.name}-${opt}`} className="font-normal">
              {opt}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function CheckboxGroupSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-[4px]" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-[4px]" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-[4px]" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  )
}

export const checkboxGroupPlugin: FieldPlugin = {
  type: 'checkbox-group',
  component: CheckboxGroupInput,
  skeleton: CheckboxGroupSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.array(z.string())
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: [],
}
