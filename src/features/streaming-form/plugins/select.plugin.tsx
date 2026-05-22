import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
      <Select value={(value as string) ?? ''} onValueChange={(val) => onChange(val)}>
        <SelectTrigger id={id} className="w-full h-10" aria-invalid={!!error}>
          {icon && <span className="mr-1">{icon}</span>}
          <SelectValue placeholder={field.placeholder ?? 'Seleccionar...'} />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function SelectSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
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
