import { AppError, type Result } from './errors'
import { logger } from './logger'

export type { Result }

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  if (error instanceof Error) return new AppError(error.message, { cause: error })
  return new AppError('An unexpected error occurred')
}

export function apiRoute(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req) => {
    try {
      return await handler(req)
    } catch (error) {
      if (error instanceof AppError) return error.toResponse()
      logger.error({
        type: 'api',
        message: 'Unhandled error in API route',
        data: error,
      })
      return new AppError('Internal server error').toResponse()
    }
  }
}

export async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (error) {
    return { ok: false, error: toAppError(error) }
  }
}
