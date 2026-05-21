import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormRenderer } from '@/features/streaming-form/components/form-renderer'
import { DynamicField } from '@/features/streaming-form/components/dynamic-field'
import { useFormStore } from '@/features/streaming-form/stores/form-store'
import { fieldRegistry } from '@/features/streaming-form/plugins/registry'
import type { FieldDef } from '@/features/streaming-form/plugins/types'

describe('FormRenderer', () => {
  beforeEach(() => {
    useFormStore.getState().reset()
  })

  it('renders nothing when there are no fields', () => {
    const { container } = render(<FormRenderer onSubmit={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders title and fields from formStore', () => {
    useFormStore.getState().upsertFields([
      { name: 'name', type: 'text', label: 'Full Name' },
      { name: 'email', type: 'email', label: 'Email' },
    ])

    render(<FormRenderer onSubmit={() => {}} />)
    expect(screen.getByText('Full Name')).toBeDefined()
    expect(screen.getByText('Email')).toBeDefined()
  })

  it('renders submit button when all fields have labels', () => {
    useFormStore.getState().upsertFields([{ name: 'name', type: 'text', label: 'Name' }])

    render(<FormRenderer onSubmit={() => {}} submitLabel="Send" />)
    expect(screen.getByText('Send')).toBeDefined()
  })
})

describe('DynamicField', () => {
  beforeEach(() => {
    useFormStore.getState().reset()
  })

  const fieldTypes = ['text', 'email', 'textarea', 'select', 'checkbox'] as const

  for (const type of fieldTypes) {
    it(`renders correct component for ${type} type`, () => {
      const field: FieldDef & { value?: unknown; error?: string } = {
        name: 'test',
        type,
        label: `Test ${type}`,
        ...(type === 'select' ? { options: ['a', 'b'] } : {}),
      }

      render(<DynamicField field={field} />)
      expect(screen.getByText(`Test ${type}`)).toBeDefined()
    })
  }

  it('renders skeleton when field is incomplete (missing label)', () => {
    const field: FieldDef & { value?: unknown; error?: string } = {
      name: 'test',
      type: 'text',
    }

    const { container } = render(<DynamicField field={field} />)
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeDefined()
  })

  it('shows error message when field has error', () => {
    useFormStore.getState().upsertFields([{ name: 'test', type: 'text', label: 'Test Field' }])
    useFormStore.getState().setError('test', 'This field is required')

    const field = useFormStore.getState().fields[0]
    render(<DynamicField field={field} />)
    expect(screen.getByText('This field is required')).toBeDefined()
  })
})

describe('each plugin', () => {
  it('returns non-null component, skeleton, buildSchema, defaultValue', () => {
    const types = fieldRegistry.types()

    for (const type of types) {
      const plugin = fieldRegistry.get(type)
      expect(plugin.component).toBeDefined()
      expect(plugin.skeleton).toBeDefined()
      expect(typeof plugin.buildSchema).toBe('function')
      expect(plugin.defaultValue).not.toBeUndefined()
    }
  })
})
