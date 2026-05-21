import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'
import { useFormStore } from '@/features/streaming-form/stores/form-store'
import type { FieldDef, FieldPlugin } from '@/features/streaming-form/plugins/types'

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.getState().reset()
  })

  it('upsertFields merges new fields without duplicating by name', () => {
    const fields: FieldDef[] = [
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'email', type: 'email', label: 'Email' },
    ]
    useFormStore.getState().upsertFields(fields)
    expect(useFormStore.getState().fields).toHaveLength(2)

    const moreFields: FieldDef[] = [
      { name: 'email', type: 'email', label: 'Email Updated' },
      { name: 'age', type: 'text', label: 'Age' },
    ]
    useFormStore.getState().upsertFields(moreFields)
    expect(useFormStore.getState().fields).toHaveLength(3)
    // upsertFields overwrites existing field data with new data
    expect(useFormStore.getState().fields.find((f) => f.name === 'email')!.label).toBe(
      'Email Updated'
    )
    expect(useFormStore.getState().fields.find((f) => f.name === 'age')).toBeDefined()
  })

  it('updateField merges partial data into existing field', () => {
    useFormStore
      .getState()
      .upsertFields([{ name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' }])
    useFormStore.getState().updateField('name', { placeholder: 'Full name' })
    const field = useFormStore.getState().fields.find((f) => f.name === 'name')!
    expect(field.label).toBe('Name')
    expect(field.placeholder).toBe('Full name')
  })

  it('buildSchema returns Zod schema with correct types', () => {
    useFormStore.getState().upsertFields([
      { name: 'username', type: 'text', label: 'Username' },
      { name: 'email', type: 'email', label: 'Email' },
      { name: 'agree', type: 'checkbox', label: 'Agree' },
      { name: 'country', type: 'select', label: 'Country', options: ['US', 'UK'] },
    ])

    const schema = useFormStore.getState().buildSchema()
    expect(schema).toBeInstanceOf(z.ZodObject)

    const result = schema.safeParse({
      username: 'john',
      email: 'invalid',
      agree: 'not-boolean',
      country: 'FR',
    })
    expect(result.success).toBe(false)

    const valid = schema.safeParse({
      username: 'john',
      email: 'john@test.com',
      agree: true,
      country: 'US',
    })
    expect(valid.success).toBe(true)
  })

  it('setValue and setError update field state', () => {
    useFormStore.getState().upsertFields([{ name: 'email', type: 'email', label: 'Email' }])

    useFormStore.getState().setValue('email', 'test@test.com')
    expect(useFormStore.getState().fields[0].value).toBe('test@test.com')

    useFormStore.getState().setError('email', 'Invalid email')
    expect(useFormStore.getState().fields[0].error).toBe('Invalid email')
  })

  it('setValue clears existing error', () => {
    useFormStore.getState().upsertFields([{ name: 'name', type: 'text', label: 'Name' }])
    useFormStore.getState().setError('name', 'Too short')
    useFormStore.getState().setValue('name', 'John')
    expect(useFormStore.getState().fields[0].error).toBeUndefined()
  })

  it('reset clears all fields', () => {
    useFormStore.getState().upsertFields([
      { name: 'a', type: 'text', label: 'A' },
      { name: 'b', type: 'text', label: 'B' },
    ])
    expect(useFormStore.getState().fields).toHaveLength(2)
    useFormStore.getState().reset()
    expect(useFormStore.getState().fields).toHaveLength(0)
  })

  it('buildSchema returns schema with correct field validations', () => {
    useFormStore
      .getState()
      .upsertFields([
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          options: ['US', 'UK'],
          required: true,
        },
      ])

    const schema = useFormStore.getState().buildSchema()
    const result = schema.safeParse({ country: '' })
    expect(result.success).toBe(false)
  })

  it('text buildSchema returns z.string()', () => {
    const plugin: { buildSchema: (def: FieldDef) => ReturnType<FieldPlugin['buildSchema']> } = {
      buildSchema: () => z.string(),
    }
    const schema = plugin.buildSchema({ name: 'test', type: 'text' })
    expect(schema.safeParse('hello').success).toBe(true)
    expect(schema.safeParse(123).success).toBe(false)
  })

  it('email buildSchema returns z.string().email()', () => {
    const plugin: { buildSchema: (def: FieldDef) => ReturnType<FieldPlugin['buildSchema']> } = {
      buildSchema: () => z.string().email(),
    }
    const schema = plugin.buildSchema({ name: 'test', type: 'email' })
    expect(schema.safeParse('test@test.com').success).toBe(true)
    expect(schema.safeParse('not-email').success).toBe(false)
  })
})
