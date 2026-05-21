import { describe, it, expect } from 'vitest'
import { parsePartialJson } from '@/features/streaming-form/parser/partial-json-parser'

describe('parsePartialJson', () => {
  it('parses complete JSON and returns isComplete: true', () => {
    const input = JSON.stringify({
      title: 'Contact Form',
      fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Send',
    })

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(true)
    expect(result.value).toEqual({
      title: 'Contact Form',
      fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Send',
    })
  })

  it('discards incomplete string values, keeps complete pairs', () => {
    const input = '{"name": "John", "age": 30, "city": "New'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({ name: 'John', age: 30 })
  })

  it('keeps complete array items, drops incomplete ones', () => {
    const input = '[1, 2, 3, '

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual([1, 2, 3])
  })

  it('keeps complete nested objects, drops partial inner fields', () => {
    const input = '{"user": {"name": "John", "age": 30}, "meta": {"visi'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({
      user: { name: 'John', age: 30 },
    })
  })

  it('truncates unterminated strings to last complete string', () => {
    const input = '{"greeting": "hello, world'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({})
  })

  it('returns empty object for empty string input', () => {
    const result = parsePartialJson('')

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({})
  })

  it('returns empty object for whitespace-only input', () => {
    const result = parsePartialJson('   \n  \t  ')

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({})
  })

  it('sanitizes trailing comma and parses successfully', () => {
    const input = '{"a": 1, "b": 2,}'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({ a: 1, b: 2 })
  })

  it('handles escaped characters inside strings without breaking', () => {
    const input = '{"text": "line1\\nline2\\ttab", "num": 42'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({ text: 'line1\nline2\ttab', num: 42 })
  })

  it('works same as single buffer with multiple chunks accumulated', () => {
    const chunk1 = '{"name": "John", "age"'
    const chunk2 = ': 30, "city": "New York"}'
    const accumulated = chunk1 + chunk2

    const singleResult = parsePartialJson(accumulated)

    expect(singleResult.isComplete).toBe(true)
    expect(singleResult.value).toEqual({
      name: 'John',
      age: 30,
      city: 'New York',
    })
  })

  it('returns array with only complete objects when some are partial', () => {
    const input = '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}, {"id": 3'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })

  it('handles boolean and null values correctly', () => {
    const input = '{"active": true, "data": null, "count": 0'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({ active: true, data: null, count: 0 })
  })

  it('handles empty object in buffer', () => {
    const result = parsePartialJson('{}')

    expect(result.isComplete).toBe(true)
    expect(result.value).toEqual({})
  })

  it('handles empty array in buffer', () => {
    const result = parsePartialJson('[]')

    expect(result.isComplete).toBe(true)
    expect(result.value).toEqual([])
  })

  it('recovers from incomplete array with nested objects', () => {
    const input = '[{"a": 1}, {"a": 2}, {"a": 3'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('handles deeply nested partial structure', () => {
    const input = '{"level1": {"level2": {"level3": {"key": "value", "partial'

    const result = parsePartialJson(input)

    expect(result.isComplete).toBe(false)
    expect(result.value).toEqual({
      level1: {
        level2: {
          level3: { key: 'value' },
        },
      },
    })
  })
})
