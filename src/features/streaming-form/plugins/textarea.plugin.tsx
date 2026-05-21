import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

function TextareaInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const variant = (field.metadata?.variant as string) ?? 'basic'

  if (variant === 'character-limit') {
    const max = field.maxLength ?? 500
    const current = ((value as string) ?? '').length
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          maxLength={max}
        />
        <div className="flex justify-between">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {current} / {max}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      <Textarea
        id={id}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-invalid={variant === 'error' ? true : !!error}
      />
      {(variant === 'error' || error) && (
        <p className="text-sm text-destructive">{error ?? 'Invalid value'}</p>
      )}
    </div>
  )
}

function TextareaSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="min-h-16 w-full" />
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
