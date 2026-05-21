import { describe, it, expect, beforeEach } from 'vitest'
import { useStreamStore } from '@/features/streaming-form/stores/stream-store'

describe('streamStore', () => {
  beforeEach(() => {
    useStreamStore.getState().reset()
  })

  it('push(chunk) appends to buffer and triggers reparsing', () => {
    useStreamStore.getState().push('{"name": "John"}')
    const state = useStreamStore.getState()
    expect(state.buffer).toBe('{"name": "John"}')
    expect(state.parsedPartial).not.toBeNull()
    expect(state.parsedPartial!.isComplete).toBe(true)
  })

  it('parsedPartial updates when new data arrives', () => {
    useStreamStore.getState().push('{"name": "John", "age": 30')
    const state1 = useStreamStore.getState()
    expect(state1.parsedPartial!.isComplete).toBe(false)
    expect(state1.parsedPartial!.value).toEqual({ name: 'John', age: 30 })

    useStreamStore.getState().push(', "city": "NYC"}')
    const state2 = useStreamStore.getState()
    expect(state2.parsedPartial!.isComplete).toBe(true)
    expect(state2.parsedPartial!.value).toEqual({ name: 'John', age: 30, city: 'NYC' })
  })

  it('reset() clears buffer and parsed state', () => {
    useStreamStore.getState().push('{"test": "data"}')
    expect(useStreamStore.getState().buffer).not.toBe('')
    expect(useStreamStore.getState().parsedPartial).not.toBeNull()

    useStreamStore.getState().reset()
    const state = useStreamStore.getState()
    expect(state.buffer).toBe('')
    expect(state.parsedPartial).toBeNull()
  })

  it('multiple pushes accumulate correctly', () => {
    useStreamStore.getState().push('{"a"')
    useStreamStore.getState().push(': 1, "b"')
    useStreamStore.getState().push(': 2}')
    expect(useStreamStore.getState().buffer).toBe('{"a": 1, "b": 2}')
    expect(useStreamStore.getState().parsedPartial!.isComplete).toBe(true)
    expect(useStreamStore.getState().parsedPartial!.value).toEqual({ a: 1, b: 2 })
  })

  it('renders partial content when stream is incomplete', () => {
    useStreamStore.getState().push('{"name": "John", "city": "New')
    const state = useStreamStore.getState()
    expect(state.parsedPartial!.isComplete).toBe(false)
    expect(state.parsedPartial!.value).toEqual({ name: 'John' })
  })
})
