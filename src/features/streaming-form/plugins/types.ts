import type { ComponentType } from 'react'
import type { ZodType } from 'zod'

export interface FieldDef {
  name: string
  type: string
  label?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  minLength?: number
  maxLength?: number
  pattern?: string
  metadata?: Record<string, unknown>
}

export interface FieldProps {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
  error?: string
}

export interface FieldPlugin {
  type: string
  component: ComponentType<FieldProps>
  skeleton: ComponentType<Record<string, unknown>>
  buildSchema: (def: FieldDef) => ZodType
  defaultValue: unknown
}
