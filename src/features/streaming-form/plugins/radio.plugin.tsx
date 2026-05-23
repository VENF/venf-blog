import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { FieldWrapper } from '../components/field-wrapper'

function RadioInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  return (
    <FieldWrapper field={field} error={error}>
      <RadioGroup
        id={id}
        value={(value as string) ?? ''}
        onValueChange={(val) => onChange(val)}
        aria-invalid={!!error}
      >
        {(field.options ?? []).map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <RadioGroupItem value={opt} id={`${field.name}-${opt}`} />
            <Label htmlFor={`${field.name}-${opt}`} className="font-normal">
              {opt}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FieldWrapper>
  )
}

function RadioSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export const radioPlugin: FieldPlugin = {
  type: 'radio',
  component: RadioInput,
  skeleton: RadioSkeleton,
  buildSchema: (def: FieldDef) => {
    const options = def.options ?? []
    if (options.length === 0) return z.string()
    const enumValues = options as [string, ...string[]]
    let schema = z.enum(enumValues)
    if (def.required) schema = schema
    return schema
  },
  defaultValue: '',
}
