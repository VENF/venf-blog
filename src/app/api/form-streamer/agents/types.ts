export const FIELD_TYPES = [
  'text',
  'email',
  'textarea',
  'select',
  'checkbox',
  'password',
  'otp',
  'radio',
  'checkbox-group',
  'switch',
  'slider',
  'multi-select',
  'phone',
  'masked-time',
  'number-stepper',
  'card-details',
] as const

export type FieldType = (typeof FIELD_TYPES)[number]

export interface FieldSpec {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  minLength?: number
  maxLength?: number
  pattern?: string
  colSpan?: number
}

export interface AnalyzerOutput {
  status: 'clear' | 'ambiguous'
  title: string
  submitLabel: string
  fields: FieldSpec[]
  question: string | null
  reasoning: string | null
  context: {
    knownFields: string[]
    missingInfo: string[]
  } | null
}
