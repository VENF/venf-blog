import { describe, it, expect, vi } from 'vitest'
import { mockClearResponse } from '../mocks/analyzer-responses'
import { mockGeneratorStream } from '../mocks/generator-stream'

vi.mock('@/app/api/form-streamer/agents/generator', () => ({
  generateFormStream: vi.fn(),
}))

import { generateFormStream } from '@/app/api/form-streamer/agents/generator'

describe('generateFormStream', () => {
  it('produces a stream of JSON tokens from a valid analysis', async () => {
    vi.mocked(generateFormStream).mockImplementation(
      () =>
        ({
          textStream: mockGeneratorStream(),
        }) as unknown as ReturnType<typeof generateFormStream>
    )

    const result = generateFormStream(mockClearResponse)
    const tokens: string[] = []

    for await (const token of result.textStream) {
      tokens.push(token)
    }

    expect(tokens.length).toBeGreaterThan(0)
  })

  it('stream ends with complete, valid JSON', async () => {
    vi.mocked(generateFormStream).mockImplementation(
      () =>
        ({
          textStream: mockGeneratorStream(),
        }) as unknown as ReturnType<typeof generateFormStream>
    )

    const result = generateFormStream(mockClearResponse)
    const tokens: string[] = []

    for await (const token of result.textStream) {
      tokens.push(token)
    }

    const fullJson = tokens.join('')
    expect(() => JSON.parse(fullJson)).not.toThrow()

    const parsed = JSON.parse(fullJson)
    expect(parsed).toHaveProperty('title')
    expect(parsed).toHaveProperty('fields')
    expect(parsed).toHaveProperty('submitLabel')
    expect(Array.isArray(parsed.fields)).toBe(true)
  })

  it('stream respects field types from analysis', async () => {
    vi.mocked(generateFormStream).mockImplementation(
      () =>
        ({
          textStream: mockGeneratorStream(),
        }) as unknown as ReturnType<typeof generateFormStream>
    )

    const result = generateFormStream(mockClearResponse)
    const tokens: string[] = []

    for await (const token of result.textStream) {
      tokens.push(token)
    }

    const fullJson = tokens.join('')
    const parsed = JSON.parse(fullJson)

    const expectedTypes = mockClearResponse.fields.map((f) => f.type)
    const actualTypes = parsed.fields.map((f: { type: string }) => f.type)

    for (const type of actualTypes) {
      expect(expectedTypes).toContain(type)
    }

    const fieldNames = parsed.fields.map((f: { name: string }) => f.name)
    for (const field of mockClearResponse.fields) {
      expect(fieldNames).toContain(field.name)
    }
  })
})
