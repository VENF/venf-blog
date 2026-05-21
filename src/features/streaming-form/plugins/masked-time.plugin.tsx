import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useMaskInput } from 'use-mask-input'

function MaskedTimeInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const inputRef = useMaskInput({ mask: '99:99:99' })

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        ref={inputRef}
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? 'HH:MM:ss'}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function MaskedTimeSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export const maskedTimePlugin: FieldPlugin = {
  type: 'masked-time',
  component: MaskedTimeInput,
  skeleton: MaskedTimeSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato inválido (HH:MM:ss)')
    if (def.required) schema = schema
    return schema
  },
  defaultValue: '',
}
