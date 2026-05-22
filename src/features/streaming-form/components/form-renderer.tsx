import { AnimatePresence, motion } from 'motion/react'
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
    <div
      role="form"
      aria-label={formTitle ?? 'Streaming form'}
      className="grid grid-cols-12 gap-4 space-y-1 p-[20px]"
    >
      <AnimatePresence mode="wait">
        {formTitle ? (
          <motion.p
            key="title"
            initial={{ filter: 'blur(4px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            exit={{ filter: 'blur(4px)', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="col-span-12 text-base font-medium"
          >
            {formTitle}
          </motion.p>
        ) : isStreaming ? (
          <motion.div
            key="title-sk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-12"
          >
            <Skeleton className="h-4 w-48" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {fields.map((field) => {
        const span = field.colSpan ?? 12
        return (
          <div key={field.name} style={{ gridColumn: `span ${span} / span ${span}` }}>
            <DynamicField field={field} />
          </div>
        )
      })}

      <AnimatePresence mode="wait">
        {isStreaming ? (
          <motion.div
            key="btn-sk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ gridColumn: 'span 12 / span 12' }}
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </motion.div>
        ) : isReady ? (
          <motion.div
            key="btn"
            initial={{ filter: 'blur(4px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            exit={{ filter: 'blur(4px)', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ gridColumn: 'span 12 / span 12' }}
            className="flex items-center justify-end"
          >
            <Button type="button" onClick={onSubmit} className="p-4">
              {submitLabel ?? 'Submit'}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
