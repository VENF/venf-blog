import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Mail } from 'lucide-react'
import { FieldWrapper } from '../components/field-wrapper'

function EmailInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <FieldWrapper field={field} error={error}>
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
    </FieldWrapper>
  )
}

function EmailSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex h-10 w-full items-center gap-0 rounded-lg border border-muted bg-muted/20 px-3">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="ml-2 h-4 flex-1" />
      </div>
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
