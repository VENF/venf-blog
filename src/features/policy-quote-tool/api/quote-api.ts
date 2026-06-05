import { http } from '@/lib/http'
import { AppError } from '@/lib/errors'
import type { PlansData, QuoteInput, QuoteOutput } from '../store/schemas'
import type { Result } from '@/lib/errors'

export async function fetchPlans(): Promise<Result<PlansData>> {
  try {
    const { data } = await http.get<PlansData>('/quoter/plans')
    return { ok: true, data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof AppError ? error : new AppError('Error desconocido'),
    }
  }
}

export async function submitQuote(input: QuoteInput): Promise<Result<QuoteOutput>> {
  try {
    const { data } = await http.post<QuoteOutput>('/quoter/quote', input)
    return { ok: true, data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof AppError ? error : new AppError('Error desconocido'),
    }
  }
}
