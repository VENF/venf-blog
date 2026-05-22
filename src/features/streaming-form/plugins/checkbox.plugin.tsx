import { z } from 'zod'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

function CheckboxInput({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.name}
          checked={(value as boolean) ?? false}
          onCheckedChange={(checked) => onChange(!!checked)}
          aria-invalid={!!error}
        />
        <Label htmlFor={field.name}>{field.label}</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function CheckboxSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-4 rounded-[4px]" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export const checkboxPlugin: FieldPlugin = {
  type: 'checkbox',
  component: CheckboxInput,
  skeleton: CheckboxSkeleton,
  buildSchema: (def: FieldDef) => {
    if (def.required) {
      return z.boolean().refine((v) => v === true, 'Required')
    }
    return z.boolean()
  },
  defaultValue: false,
}
