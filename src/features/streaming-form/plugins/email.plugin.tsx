import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

function EmailInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        type="email"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function EmailSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export const emailPlugin: FieldPlugin = {
  type: 'email',
  component: EmailInput,
  skeleton: EmailSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.string().email()
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: '',
}
