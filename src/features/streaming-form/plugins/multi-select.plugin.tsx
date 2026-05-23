import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import MultipleSelector, { type Option } from '@/components/ui/multi-select'
import { FieldWrapper } from '../components/field-wrapper'

function MultiSelectInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const selected = (value as string[]) ?? []
  const options: Option[] = (field.options ?? []).map((opt) => ({ value: opt, label: opt }))
  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const maxSelected = (field.metadata?.maxSelected as number) ?? 0
  const creatable = (field.metadata?.creatable as boolean) ?? false

  return (
    <FieldWrapper field={field} error={error}>
      <MultipleSelector
        inputProps={{ id }}
        value={selectedOptions}
        defaultOptions={options}
        onChange={(opts) => onChange(opts.map((o) => o.value))}
        placeholder={field.placeholder ?? 'Seleccionar opciones...'}
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">Sin resultados</p>}
        maxSelected={maxSelected > 0 ? maxSelected : Number.MAX_SAFE_INTEGER}
        creatable={creatable}
        className="w-full"
      />
    </FieldWrapper>
  )
}

function MultiSelectSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-muted bg-muted/20 px-3 py-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export const multiSelectPlugin: FieldPlugin = {
  type: 'multi-select',
  component: MultiSelectInput,
  skeleton: MultiSelectSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.array(z.string())
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: [],
}
