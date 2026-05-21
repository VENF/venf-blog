export interface FieldSpec {
  name: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  minLength?: number
  maxLength?: number
  pattern?: string
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
