import { z } from 'zod'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

function SwitchInput({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          id={field.name}
          checked={(value as boolean) ?? false}
          onCheckedChange={(checked) => onChange(checked)}
          aria-invalid={!!error}
        />
        <Label htmlFor={field.name}>{field.label}</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function SwitchSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-[18.4px] w-[32px] rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export const switchPlugin: FieldPlugin = {
  type: 'switch',
  component: SwitchInput,
  skeleton: SwitchSkeleton,
  buildSchema: (def: FieldDef) => {
    if (def.required) {
      return z.boolean().refine((v) => v === true, 'Required')
    }
    return z.boolean()
  },
  defaultValue: false,
}
