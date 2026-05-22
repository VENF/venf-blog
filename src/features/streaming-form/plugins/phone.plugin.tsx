import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PhoneInput } from '@/components/ui/phone-input'

function PhoneField({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
      <PhoneInput
        id={id}
        value={(value as string) ?? ''}
        onChange={(val) => onChange(val ?? '')}
        placeholder={field.placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function PhoneSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export const phonePlugin: FieldPlugin = {
  type: 'phone',
  component: PhoneField,
  skeleton: PhoneSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.string()
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: '',
}
