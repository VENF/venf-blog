import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockClearResponse, mockAmbiguousResponse } from '../mocks/analyzer-responses'

vi.mock('@/app/api/form-streamer/agents/analyzer', () => ({
  analyzePrompt: vi.fn(),
}))

import { analyzePrompt } from '@/app/api/form-streamer/agents/analyzer'

describe('analyzePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns clear status for a clear prompt', async () => {
    vi.mocked(analyzePrompt).mockResolvedValueOnce(mockClearResponse)

    const result = await analyzePrompt('Create a contact form with name, email, and message fields')

    expect(result.status).toBe('clear')
    expect(result.title).toBeTruthy()
    expect(result.fields.length).toBeGreaterThan(0)
    expect(result.fields[0]).toHaveProperty('name')
    expect(result.fields[0]).toHaveProperty('type')
    expect(result.fields[0]).toHaveProperty('label')
  })

  it('returns ambiguous status for an ambiguous prompt', async () => {
    vi.mocked(analyzePrompt).mockResolvedValueOnce(mockAmbiguousResponse)

    const result = await analyzePrompt('Create a form with name and email')

    expect(result.status).toBe('ambiguous')
    expect(result.question).toBeTruthy()
  })

  it('ambiguous response includes knownFields and missingInfo', async () => {
    vi.mocked(analyzePrompt).mockResolvedValueOnce(mockAmbiguousResponse)

    const result = await analyzePrompt('Create a form with name and email')

    expect(result.context!.knownFields).toBeDefined()
    expect(result.context!.missingInfo).toBeDefined()
    expect(Array.isArray(result.context!.knownFields)).toBe(true)
    expect(Array.isArray(result.context!.missingInfo)).toBe(true)
  })

  it('returns ambiguous for empty prompt', async () => {
    vi.mocked(analyzePrompt).mockResolvedValueOnce(mockAmbiguousResponse)

    const result = await analyzePrompt('')

    expect(result.status).toBe('ambiguous')
    expect(result.question).toBeTruthy()
    expect(result.question!.length).toBeGreaterThan(0)
  })

  it('clear response contains valid field types', async () => {
    vi.mocked(analyzePrompt).mockResolvedValueOnce(mockClearResponse)

    const result = await analyzePrompt('Create a form with text and email fields')
    const validTypes = ['text', 'email', 'textarea', 'select', 'checkbox']

    for (const field of result.fields) {
      expect(validTypes).toContain(field.type)
    }
  })
})
