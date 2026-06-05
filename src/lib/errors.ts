export class AppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'AppError'
  }

  toResponse(): Response {
    return Response.json({ message: this.message }, { status: 500 })
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.name = 'ApiError'
  }

  toResponse(): Response {
    const body: Record<string, unknown> = { message: this.message }
    if (this.code) body.code = this.code
    if (this.details) body.details = this.details
    return Response.json(body, { status: this.status })
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError }
