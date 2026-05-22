import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Mail } from 'lucide-react'

function EmailInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
      <InputGroup className="h-10!">
        <InputGroupAddon align="inline-start">
          <Mail className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type="email"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          className="!h-10"
        />
      </InputGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function EmailSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
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
