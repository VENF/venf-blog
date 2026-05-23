import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { FieldWrapper } from '../components/field-wrapper'

function TextareaInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const variant = (field.metadata?.variant as string) ?? 'basic'

  if (variant === 'character-limit') {
    const max = field.maxLength ?? 500
    const current = ((value as string) ?? '').length
    return (
      <FieldWrapper field={field} error={error}>
        <Textarea
          id={id}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          maxLength={max}
          className="min-h-[120px]"
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground tabular-nums">
            {current} / {max}
          </span>
        </div>
      </FieldWrapper>
    )
  }

  return (
    <FieldWrapper field={field} error={error}>
      <Textarea
        id={id}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-invalid={!!error}
        className="min-h-[120px]"
      />
    </FieldWrapper>
  )
}

function TextareaSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="min-h-[120px] w-full" />
    </div>
  )
}

export const textareaPlugin: FieldPlugin = {
  type: 'textarea',
  component: TextareaInput,
  skeleton: TextareaSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.string()
    if (def.minLength !== undefined) schema = schema.min(def.minLength)
    if (def.maxLength !== undefined) schema = schema.max(def.maxLength)
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: '',
}
