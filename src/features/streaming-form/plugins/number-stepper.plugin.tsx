import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { NumberField, Group, Input, Button } from 'react-aria-components'

function NumberStepperInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const min = field.minLength ?? 0
  const max = field.maxLength ?? 100
  const step = (field.metadata?.step as number) ?? 1

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
      <NumberField
        aria-label={field.label}
        value={(value as number) ?? min}
        onChange={(val) => onChange(val)}
        minValue={min}
        maxValue={max}
        step={step}
        isInvalid={!!error}
        className="flex flex-col gap-1"
      >
        <Group className="border-input focus-within:border-ring focus-within:ring-ring/50 flex h-10 w-full items-center rounded-lg border transition-[color,box-shadow] focus-within:ring-[3px]">
          <Button
            slot="decrement"
            className="text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-full items-center justify-center border-r px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            −
          </Button>
          <Input className="h-full flex-1 bg-transparent px-2.5 text-sm text-center outline-none" />
          <Button
            slot="increment"
            className="text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-full items-center justify-center border-l px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            +
          </Button>
        </Group>
      </NumberField>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function NumberStepperSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export const numberStepperPlugin: FieldPlugin = {
  type: 'number-stepper',
  component: NumberStepperInput,
  skeleton: NumberStepperSkeleton,
  buildSchema: (def: FieldDef) => {
    const min = def.minLength ?? 0
    const max = def.maxLength ?? 100
    let schema = z.number().min(min).max(max)
    if (def.required) schema = schema
    return schema
  },
  defaultValue: 0,
}
