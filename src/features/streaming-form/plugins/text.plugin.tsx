import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Search, Mail, User, Globe, Link, Calendar, Clock } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  mail: Mail,
  user: User,
  globe: Globe,
  link: Link,
  calendar: Calendar,
  clock: Clock,
}

function resolveIcon(name: string | undefined) {
  if (!name) return null
  const Icon = iconMap[name.toLowerCase()]
  if (!Icon) return null
  return <Icon className="size-4" />
}

function ErrorBlock({ error }: { error?: string }) {
  if (!error) return null
  return <p className="text-sm text-destructive">{error}</p>
}

function TextInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const variant = (field.metadata?.variant as string) ?? 'basic'

  if (variant === 'error') {
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={true}
          className="h-10"
        />
        <p className="text-sm text-destructive">{error ?? 'Invalid value'}</p>
      </div>
    )
  }

  if (variant === 'icon-start' || variant === 'icon-end') {
    const isStart = variant === 'icon-start'
    const icon = resolveIcon(field.metadata?.icon as string)
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={id}>{field.label}</Label>
        <InputGroup className="h-10!">
          {isStart && icon && <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>}
          <InputGroupInput
            id={id}
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className="!h-10"
          />
          {!isStart && icon && <InputGroupAddon align="inline-end">{icon}</InputGroupAddon>}
        </InputGroup>
        <ErrorBlock error={error} />
      </div>
    )
  }

  if (variant === 'addons') {
    const startAddon = field.metadata?.startAddon as string | undefined
    const endAddon = field.metadata?.endAddon as string | undefined
    const startButton = field.metadata?.startButton as string | undefined
    const endButton = field.metadata?.endButton as string | undefined
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={id}>{field.label}</Label>
        <InputGroup className="h-10!">
          {(startAddon || startButton) && (
            <InputGroupAddon align="inline-start">
              {startButton ? (
                <InputGroupButton size="xs" variant="ghost">
                  {startButton}
                </InputGroupButton>
              ) : (
                <span className="text-muted-foreground text-xs">{startAddon}</span>
              )}
            </InputGroupAddon>
          )}
          <InputGroupInput
            id={id}
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className="!h-10"
          />
          {(endAddon || endButton) && (
            <InputGroupAddon align="inline-end">
              {endButton ? (
                <InputGroupButton size="xs" variant="ghost">
                  {endButton}
                </InputGroupButton>
              ) : (
                <span className="text-muted-foreground text-xs">{endAddon}</span>
              )}
            </InputGroupAddon>
          )}
        </InputGroup>
        <ErrorBlock error={error} />
      </div>
    )
  }

  if (variant === 'button') {
    const buttonLabel = (field.metadata?.buttonLabel as string) ?? 'Submit'
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={id}>{field.label}</Label>
        <InputGroup className="h-10!">
          <InputGroupInput
            id={id}
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className="!h-10"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" variant="default">
              {buttonLabel}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <ErrorBlock error={error} />
      </div>
    )
  }

  if (variant === 'character-limit') {
    const max = field.maxLength ?? 100
    const current = ((value as string) ?? '').length
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          maxLength={max}
          className="h-10"
        />
        <div className="flex justify-between">
          <ErrorBlock error={error} />
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {current} / {max}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-invalid={!!error}
        className="h-10"
      />
      <ErrorBlock error={error} />
    </div>
  )
}

function TextSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export const textPlugin: FieldPlugin = {
  type: 'text',
  component: TextInput,
  skeleton: TextSkeleton,
  buildSchema: (def: FieldDef) => {
    let schema = z.string()
    if (def.minLength !== undefined) schema = schema.min(def.minLength)
    if (def.maxLength !== undefined) schema = schema.max(def.maxLength)
    if (def.pattern !== undefined) schema = schema.regex(new RegExp(def.pattern))
    if (def.required) schema = schema.min(1, 'Required')
    return schema
  },
  defaultValue: '',
}
