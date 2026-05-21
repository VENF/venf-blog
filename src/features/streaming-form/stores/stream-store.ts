import { create } from 'zustand'
import { parsePartialJson } from '../parser/partial-json-parser'
import type { ParseResult } from '../parser/partial-json-parser'

export interface StreamState {
  buffer: string
  parsedPartial: ParseResult | null
  push: (chunk: string) => void
  reset: () => void
}

export const useStreamStore = create<StreamState>((set, get) => ({
  buffer: '',
  parsedPartial: null,

  push: (chunk: string) => {
    const newBuffer = get().buffer + chunk
    const parsed = parsePartialJson(newBuffer)
    set({ buffer: newBuffer, parsedPartial: parsed })
  },

  reset: () => {
    set({ buffer: '', parsedPartial: null })
  },
}))
