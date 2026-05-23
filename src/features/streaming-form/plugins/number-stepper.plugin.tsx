import { z } from 'zod'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { NumberField, Group, Input, Button } from 'react-aria-components'
import { FieldWrapper } from '../components/field-wrapper'

function NumberStepperInput({ field, value, onChange, error }: FieldProps) {
  const min = field.minLength ?? 0
  const max = field.maxLength ?? 100
  const step = (field.metadata?.step as number) ?? 1

  return (
    <FieldWrapper field={field} error={error}>
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
    </FieldWrapper>
  )
}

function NumberStepperSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex h-10 w-full items-center rounded-lg border border-muted bg-muted/20">
        <div className="flex h-full w-10 items-center justify-center border-r border-muted">
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Skeleton className="h-4 w-6" />
        </div>
        <div className="flex h-full w-10 items-center justify-center border-l border-muted">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
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
