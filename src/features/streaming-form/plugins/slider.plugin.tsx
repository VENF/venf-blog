import { z } from 'zod'
import { useId, useState } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'

function SliderInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const mode = (field.metadata?.mode as string) ?? 'single'
  const min = field.minLength ?? 0
  const max = field.maxLength ?? 100
  const step = (field.metadata?.step as number) ?? 1
  const range = Array.isArray(value) ? (value as [number, number]) : [min, max]
  const [local, setLocal] = useState(range)

  if (mode === 'range') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-sm font-medium">
            {field.label}
          </Label>
          <span className="text-sm font-medium tabular-nums">
            ${local[0]} — ${local[1]}
          </span>
        </div>
        <Slider
          id={id}
          className="py-4"
          value={local}
          onValueChange={(v) => {
            setLocal(v as [number, number])
            onChange(v)
          }}
          min={min}
          max={max}
          step={step}
          aria-label={field.label}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  const val = (value as number) ?? min

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {field.label}
        </Label>
        <span className="text-sm font-medium tabular-nums">{val}</span>
      </div>
      <Slider
        id={id}
        className="py-4"
        value={[val]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        aria-label={field.label}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function SliderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-1 w-full" />
    </div>
  )
}

export const sliderPlugin: FieldPlugin = {
  type: 'slider',
  component: SliderInput,
  skeleton: SliderSkeleton,
  buildSchema: (def: FieldDef) => {
    const mode = (def.metadata?.mode as string) ?? 'single'
    const min = def.minLength ?? 0
    const max = def.maxLength ?? 100
    if (mode === 'range') {
      return z.tuple([z.number().min(min).max(max), z.number().min(min).max(max)])
    }
    return z.number().min(min).max(max)
  },
  defaultValue: 0,
}
