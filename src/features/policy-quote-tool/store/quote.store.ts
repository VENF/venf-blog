import { create } from 'zustand'
import { QuoteOutput } from './schemas'

interface QuoteStore {
  result: QuoteOutput | null
  error: string | null
  loading: boolean
  setResult: (result: QuoteOutput | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  result: null,
  error: null,
  loading: false,
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ result: null, error: null, loading: false }),
}))
