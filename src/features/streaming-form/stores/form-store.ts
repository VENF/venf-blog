import { create } from 'zustand'
import { z } from 'zod'
import { fieldRegistry } from '../plugins/registry'
import type { FieldDef } from '../plugins/types'
import { textPlugin } from '../plugins/text.plugin'

export interface FormField extends FieldDef {
  value: unknown
  error?: string
}

export interface FormState {
  fields: FormField[]
  upsertFields: (newFields: FieldDef[]) => void
  updateField: (name: string, partial: Partial<FieldDef>) => void
  buildSchema: () => z.ZodObject<Record<string, z.ZodType>>
  setValue: (name: string, value: unknown) => void
  setError: (name: string, error: string) => void
  reset: () => void
}

export const useFormStore = create<FormState>((set, get) => ({
  fields: [],

  upsertFields: (newFields: FieldDef[]) => {
    const existing = get().fields
    const fieldMap = new Map(existing.map((f) => [f.name, f]))

    for (const field of newFields) {
      if (!field.name || !field.type) continue

      if (fieldMap.has(field.name)) {
        const current = fieldMap.get(field.name)!
        fieldMap.set(field.name, {
          ...current,
          ...field,
          value: current.value,
          error: current.error,
        })
      } else {
        const plugin = fieldRegistry.has(field.type) ? fieldRegistry.get(field.type) : textPlugin
        fieldMap.set(field.name, { ...field, value: plugin.defaultValue })
      }
    }

    set({ fields: Array.from(fieldMap.values()) })
  },

  updateField: (name: string, partial: Partial<FieldDef>) => {
    const fields = get().fields.map((f) => {
      if (f.name !== name) return f
      return { ...f, ...partial }
    })
    set({ fields })
  },

  buildSchema: () => {
    const shape: Record<string, z.ZodType> = {}

    for (const field of get().fields) {
      try {
        const plugin = fieldRegistry.get(field.type)
        shape[field.name] = plugin.buildSchema(field)
      } catch {
        shape[field.name] = z.string()
      }
    }

    return z.object(shape)
  },

  setValue: (name: string, value: unknown) => {
    const fields = get().fields.map((f) => {
      if (f.name !== name) return f
      return { ...f, value, error: undefined }
    })
    set({ fields })
  },

  setError: (name: string, error: string) => {
    const fields = get().fields.map((f) => {
      if (f.name !== name) return f
      return { ...f, error }
    })
    set({ fields })
  },

  reset: () => {
    set({ fields: [] })
  },
}))
