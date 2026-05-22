import { useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { fieldRegistry } from '../plugins/registry'
import { useFormStore } from '../stores/form-store'
import { FieldSkeleton } from './field-skeleton'
import type { FieldDef } from '../plugins/types'

interface DynamicFieldProps {
  field: FieldDef & { value?: unknown; error?: string }
}

export function DynamicField({ field }: DynamicFieldProps) {
  const setValue = useFormStore((s) => s.setValue)
  const plugin = fieldRegistry.get(field.type)

  const isComplete = field.label != null

  const handleChange = useCallback(
    (value: unknown) => {
      setValue(field.name, value)
    },
    [field.name, setValue]
  )

  return (
    <AnimatePresence mode="wait">
      {isComplete ? (
        <motion.div
          key="input"
          initial={{ filter: 'blur(4px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          exit={{ filter: 'blur(4px)', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <plugin.component
            field={field}
            value={field.value ?? plugin.defaultValue}
            onChange={handleChange}
            error={field.error}
          />
        </motion.div>
      ) : (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FieldSkeleton type={field.type} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
