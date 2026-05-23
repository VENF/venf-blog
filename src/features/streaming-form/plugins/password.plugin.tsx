import { z } from 'zod'
import { useId, useState } from 'react'
import type { FieldPlugin, FieldProps } from './types'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye, EyeOff, Check, X, Lock } from 'lucide-react'
import { FieldWrapper } from '../components/field-wrapper'

function getStrength(value: string): number {
  let score = 0
  if (value.length >= 12) score += 20
  if (/[A-Z]/.test(value)) score += 20
  if (/[a-z]/.test(value)) score += 20
  if (/[0-9]/.test(value)) score += 20
  if (/[^A-Za-z0-9]/.test(value)) score += 20
  return score
}

function getStrengthColor(score: number): string {
  if (score <= 20) return 'bg-red-500'
  if (score <= 40) return 'bg-orange-500'
  if (score <= 60) return 'bg-yellow-500'
  if (score <= 80) return 'bg-lime-500'
  return 'bg-green-500'
}

const requirements = [
  { label: 'Mínimo 12 caracteres', test: (v: string) => v.length >= 12 },
  { label: 'Mayúscula (A-Z)', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Minúscula (a-z)', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Número (0-9)', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Carácter especial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

function PasswordInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const val = (value as string) ?? ''
  const strength = getStrength(val)

  return (
    <FieldWrapper field={field} error={error}>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2">
          <Lock className="size-4 text-muted-foreground" />
        </span>
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={val}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          className="pl-8 pr-9 h-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2"
          tabIndex={-1}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {val.length > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${getStrengthColor(strength)}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      )}
      {val.length > 0 && (
        <ul className="flex flex-col gap-1">
          {requirements.map((req) => {
            const met = req.test(val)
            return (
              <li
                key={req.label}
                className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}
              >
                {met ? <Check className="size-3" /> : <X className="size-3" />}
                {req.label}
              </li>
            )
          })}
        </ul>
      )}
    </FieldWrapper>
  )
}

function PasswordSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-1.5 w-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export const passwordPlugin: FieldPlugin = {
  type: 'password',
  component: PasswordInput,
  skeleton: PasswordSkeleton,
  buildSchema: () => {
    let schema = z.string().min(12, 'Mínimo 12 caracteres')
    schema = schema.regex(/[A-Z]/, 'Debe contener mayúscula')
    schema = schema.regex(/[a-z]/, 'Debe contener minúscula')
    schema = schema.regex(/[0-9]/, 'Debe contener número')
    schema = schema.regex(/[^A-Za-z0-9]/, 'Debe contener carácter especial')
    return schema
  },
  defaultValue: '',
}
