import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import MultipleSelector, { type Option } from '@/components/ui/multi-select'

function MultiSelectInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const selected = (value as string[]) ?? []
  const options: Option[] = (field.options ?? []).map((opt) => ({ value: opt, label: opt }))
  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const maxSelected = (field.metadata?.maxSelected as number) ?? 0
  const creatable = (field.metadata?.creatable as boolean) ?? false

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function MultiSelectSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="min-h-10 w-full rounded-md" />
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
