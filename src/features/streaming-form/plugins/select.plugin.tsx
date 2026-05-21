import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Globe } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  globe: Globe,
}

function resolveIcon(name: string | undefined) {
  if (!name) return null
  const Icon = iconMap[name.toLowerCase()]
  if (!Icon) return null
  return <Icon className="size-4 text-muted-foreground" />
}

function SelectInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const variant = (field.metadata?.variant as string) ?? 'default'
  const icon = variant === 'icon' ? resolveIcon(field.metadata?.icon as string) : null

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <NativeSelect
          id={id}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={icon ? 'pl-8' : undefined}
        >
          <NativeSelectOption value="">{field.placeholder ?? 'Seleccionar...'}</NativeSelectOption>
          {(field.options ?? []).map((opt) => (
            <NativeSelectOption key={opt} value={opt}>
              {opt}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function SelectSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export const selectPlugin: FieldPlugin = {
  type: 'select',
  component: SelectInput,
  skeleton: SelectSkeleton,
  buildSchema: (def: FieldDef) => {
    const options = def.options ?? []
    if (options.length === 0) return z.string()
    const enumValues = options as [string, ...string[]]
    let schema = z.enum(enumValues)
    if (def.required) schema = schema as typeof schema
    return schema
  },
  defaultValue: '',
}
