import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { PhoneInput } from '@/components/ui/phone-input'
import { FieldWrapper } from '../components/field-wrapper'

function PhoneField({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <FieldWrapper field={field} error={error}>
      <PhoneInput
        id={id}
        value={(value as string) ?? ''}
        onChange={(val) => onChange(val ?? '')}
        placeholder={field.placeholder}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  )
}

function PhoneSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-muted bg-muted/20 px-3">
        <Skeleton className="h-5 w-8 rounded-sm" />
        <Skeleton className="h-4 w-1 rounded-full" />
        <Skeleton className="h-4 flex-1" />
      </div>
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
