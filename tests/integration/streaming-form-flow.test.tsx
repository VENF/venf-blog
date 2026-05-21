import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormFlowStore } from '@/features/streaming-form/stores/flow-store'
import { useStreamStore } from '@/features/streaming-form/stores/stream-store'
import { useFormStore } from '@/features/streaming-form/stores/form-store'
import { FormRenderer } from '@/features/streaming-form/components/form-renderer'
import { DynamicField } from '@/features/streaming-form/components/dynamic-field'
import { fieldRegistry } from '@/features/streaming-form/plugins/registry'

function resetAll() {
  useFormFlowStore.setState({
    status: 'idle',
    prompt: '',
    error: null,
    question: null,
    knownFields: [],
    missingInfo: [],
  })
  useStreamStore.getState().reset()
  useFormStore.getState().reset()
}

describe('Form Flow Integration', () => {
  beforeEach(() => {
    resetAll()
  })

  it('full flow: idle → connecting → analyzing → generating → validating → interactive → submitting → complete', () => {
    const store = useFormFlowStore.getState()
    expect(store.status).toBe('idle')

    store.start('create a contact form')
    expect(useFormFlowStore.getState().status).toBe('connecting')

    useFormFlowStore.getState().setConnected()
    expect(useFormFlowStore.getState().status).toBe('analyzing')

    useFormFlowStore.getState().setClear()
    expect(useFormFlowStore.getState().status).toBe('generating')

    useFormFlowStore.getState().setStreamDone()
    expect(useFormFlowStore.getState().status).toBe('validating')

    useFormFlowStore.getState().setValid()
    expect(useFormFlowStore.getState().status).toBe('interactive')

    useFormFlowStore.getState().setSubmitting()
    expect(useFormFlowStore.getState().status).toBe('submitting')

    useFormFlowStore.getState().setSuccess()
    expect(useFormFlowStore.getState().status).toBe('complete')
  })

  it('full ambiguity flow: ambiguous → feedback → analyzing → generating → interactive', () => {
    useFormFlowStore.getState().start('create a form')
    useFormFlowStore.getState().setConnected()

    useFormFlowStore.getState().setAmbiguous('What field types?', ['name'], ['types'])
    expect(useFormFlowStore.getState().status).toBe('waiting_feedback')
    expect(useFormFlowStore.getState().question).toBe('What field types?')
    expect(useFormFlowStore.getState().knownFields).toEqual(['name'])

    useFormFlowStore.getState().sendFeedback()
    expect(useFormFlowStore.getState().status).toBe('analyzing')
    expect(useFormFlowStore.getState().question).toBeNull()

    useFormFlowStore.getState().setClear()
    expect(useFormFlowStore.getState().status).toBe('generating')

    useFormFlowStore.getState().setStreamDone()
    useFormFlowStore.getState().setValid()
    expect(useFormFlowStore.getState().status).toBe('interactive')
  })

  it('multiple ambiguity rounds can cycle', () => {
    useFormFlowStore.getState().start('form')
    useFormFlowStore.getState().setConnected()

    useFormFlowStore.getState().setAmbiguous('What fields?', [], ['fields'])
    expect(useFormFlowStore.getState().status).toBe('waiting_feedback')

    useFormFlowStore.getState().sendFeedback()
    expect(useFormFlowStore.getState().status).toBe('analyzing')

    useFormFlowStore.getState().setAmbiguous('What types?', ['name'], ['types'])
    expect(useFormFlowStore.getState().status).toBe('waiting_feedback')

    useFormFlowStore.getState().sendFeedback()
    expect(useFormFlowStore.getState().status).toBe('analyzing')

    useFormFlowStore.getState().setClear()
    expect(useFormFlowStore.getState().status).toBe('generating')
  })

  it('error recovery: error → retry → idle → start', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()

    useFormFlowStore.getState().setError('connection lost')
    expect(useFormFlowStore.getState().status).toBe('error')
    expect(useFormFlowStore.getState().error).toBe('connection lost')

    useFormFlowStore.getState().retry()
    expect(useFormFlowStore.getState().status).toBe('idle')

    useFormFlowStore.getState().start('retry form')
    expect(useFormFlowStore.getState().status).toBe('connecting')
  })

  it('invalid JSON validation: validating → INVALID → error → retry', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()

    useFormFlowStore.getState().setInvalid('invalid field types')
    expect(useFormFlowStore.getState().status).toBe('error')
    expect(useFormFlowStore.getState().error).toBe('invalid field types')

    useFormFlowStore.getState().retry()
    expect(useFormFlowStore.getState().status).toBe('idle')
  })

  it('FormRenderer renders all 5 field types correctly', () => {
    useFormStore.getState().upsertFields([
      { name: 'text_field', type: 'text', label: 'Text Field' },
      { name: 'email_field', type: 'email', label: 'Email Field' },
      { name: 'textarea_field', type: 'textarea', label: 'Textarea Field' },
      { name: 'select_field', type: 'select', options: ['a', 'b'], label: 'Select Field' },
      { name: 'checkbox_field', type: 'checkbox', label: 'Checkbox Field' },
    ])

    render(<FormRenderer onSubmit={() => {}} submitLabel="Submit All" />)

    expect(screen.getByText('Text Field')).toBeDefined()
    expect(screen.getByText('Email Field')).toBeDefined()
    expect(screen.getByText('Textarea Field')).toBeDefined()
    expect(screen.getByText('Select Field')).toBeDefined()
    expect(screen.getByText('Checkbox Field')).toBeDefined()
    expect(screen.getByText('Submit All')).toBeDefined()
  })

  it('fields appear progressively as stream data arrives', () => {
    expect(useFormStore.getState().fields).toHaveLength(0)

    useFormStore
      .getState()
      .upsertFields([{ name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' }])
    expect(useFormStore.getState().fields).toHaveLength(1)

    useFormStore.getState().upsertFields([{ name: 'email', type: 'email', label: 'Email' }])
    expect(useFormStore.getState().fields).toHaveLength(2)
  })
})
