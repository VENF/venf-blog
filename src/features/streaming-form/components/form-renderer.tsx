import { useFormStore } from '../stores/form-store'
import { DynamicField } from './dynamic-field'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface FormRendererProps {
  onSubmit: () => void
  formTitle?: string | null
  submitLabel?: string
  isStreaming?: boolean
}

export function FormRenderer({ onSubmit, formTitle, submitLabel, isStreaming }: FormRendererProps) {
  const fields = useFormStore((s) => s.fields)
  const isReady = fields.length > 0 && fields.every((f) => f.label != null)

  return (
    <div role="form" aria-label={formTitle ?? 'Streaming form'} className="flex flex-col gap-4">
      {formTitle ? (
        <p className="text-base font-medium">{formTitle}</p>
      ) : isStreaming ? (
        <Skeleton className="h-4 w-48" />
      ) : null}

      {fields.map((field) => (
        <DynamicField key={field.name} field={field} />
      ))}

      {isStreaming && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isReady && !isStreaming && (
        <Button type="button" onClick={onSubmit}>
          {submitLabel ?? 'Submit'}
        </Button>
      )}
    </div>
  )
}
