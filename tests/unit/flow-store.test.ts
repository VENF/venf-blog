import { describe, it, expect, beforeEach } from 'vitest'
import { useFormFlowStore } from '@/features/streaming-form/stores/flow-store'

function resetStore() {
  useFormFlowStore.setState({
    status: 'idle',
    prompt: '',
    error: null,
    question: null,
    knownFields: [],
    missingInfo: [],
  })
}

describe('FormFlowStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('starts in idle state', () => {
    expect(useFormFlowStore.getState().status).toBe('idle')
  })

  it('start transitions to connecting', () => {
    useFormFlowStore.getState().start('create a contact form')
    expect(useFormFlowStore.getState().status).toBe('connecting')
  })

  it('start sets prompt and resets error', () => {
    useFormFlowStore.getState().start('create a login form')
    const s = useFormFlowStore.getState()
    expect(s.prompt).toBe('create a login form')
    expect(s.error).toBeNull()
  })

  it('start is no-op when not idle', () => {
    useFormFlowStore.getState().start('first')
    useFormFlowStore.getState().start('second')
    expect(useFormFlowStore.getState().prompt).toBe('first')
    expect(useFormFlowStore.getState().status).toBe('connecting')
  })

  it('setConnected transitions to analyzing', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    expect(useFormFlowStore.getState().status).toBe('analyzing')
  })

  it('setClear transitions to generating', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    expect(useFormFlowStore.getState().status).toBe('generating')
  })

  it('setAmbiguous transitions to waiting_feedback', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setAmbiguous('What field types?', ['name'], ['types'])
    expect(useFormFlowStore.getState().status).toBe('waiting_feedback')
  })

  it('setAmbiguous sets question, knownFields and missingInfo', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setAmbiguous('What types?', ['email'], ['field types'])
    const s = useFormFlowStore.getState()
    expect(s.question).toBe('What types?')
    expect(s.knownFields).toEqual(['email'])
    expect(s.missingInfo).toEqual(['field types'])
  })

  it('sendFeedback transitions to analyzing and clears question', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setAmbiguous('What fields?', [], ['fields'])
    useFormFlowStore.getState().sendFeedback()
    const s = useFormFlowStore.getState()
    expect(s.status).toBe('analyzing')
    expect(s.question).toBeNull()
  })

  it('setStreamDone transitions to validating', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()
    expect(useFormFlowStore.getState().status).toBe('validating')
  })

  it('setValid transitions to interactive', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()
    useFormFlowStore.getState().setValid()
    expect(useFormFlowStore.getState().status).toBe('interactive')
  })

  it('setInvalid transitions to error', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()
    useFormFlowStore.getState().setInvalid('invalid fields')
    expect(useFormFlowStore.getState().status).toBe('error')
    expect(useFormFlowStore.getState().error).toBe('invalid fields')
  })

  it('setSubmitting transitions to submitting', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()
    useFormFlowStore.getState().setValid()
    useFormFlowStore.getState().setSubmitting()
    expect(useFormFlowStore.getState().status).toBe('submitting')
  })

  it('setSuccess transitions to complete', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setStreamDone()
    useFormFlowStore.getState().setValid()
    useFormFlowStore.getState().setSubmitting()
    useFormFlowStore.getState().setSuccess()
    expect(useFormFlowStore.getState().status).toBe('complete')
  })

  it('setError works from any state', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setError('connection lost')
    expect(useFormFlowStore.getState().status).toBe('error')
    expect(useFormFlowStore.getState().error).toBe('connection lost')
  })

  it('retry transitions from error to idle and clears error', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setConnected()
    useFormFlowStore.getState().setClear()
    useFormFlowStore.getState().setError('connection lost')
    expect(useFormFlowStore.getState().status).toBe('error')

    useFormFlowStore.getState().retry()
    expect(useFormFlowStore.getState().status).toBe('idle')
  })

  it('setClear is no-op from wrong state', () => {
    useFormFlowStore.getState().setClear()
    expect(useFormFlowStore.getState().status).toBe('idle')
  })

  it('ignores invalid transition chains', () => {
    useFormFlowStore.getState().start('test')
    useFormFlowStore.getState().setValid()
    // should not transition from connecting to interactive
    expect(useFormFlowStore.getState().status).not.toBe('interactive')
    expect(useFormFlowStore.getState().status).toBe('connecting')
  })

  it('initializes context with default values', () => {
    const s = useFormFlowStore.getState()
    expect(s.status).toBe('idle')
    expect(s.prompt).toBe('')
    expect(s.error).toBeNull()
    expect(s.question).toBeNull()
    expect(s.knownFields).toEqual([])
    expect(s.missingInfo).toEqual([])
  })
})
