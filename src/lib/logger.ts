type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogPayload = {
  message: string
  type?: string
  data?: unknown
}

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const ANSI: Record<LogLevel, string> = {
  debug: '\x1b[35m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
}

const CSS: Record<LogLevel, string> = {
  debug: 'color:#a855f7',
  info: 'color:#22c55e',
  warn: 'color:#eab308',
  error: 'color:#ef4444;font-weight:bold',
}

const RESET = '\x1b[0m'

const isServer = typeof window === 'undefined'

function resolveMinLevel(): number {
  if (process.env.NODE_ENV === 'production') {
    const override = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined
    if (override && override in LEVELS) return LEVELS[override]
    return LEVELS.warn
  }
  return LEVELS.debug
}

const minLevel = resolveMinLevel()

function ts(): string {
  return new Date().toISOString()
}

function serialize(data: unknown): unknown {
  if (data instanceof Error) {
    const result: Record<string, unknown> = {
      name: data.name,
      message: data.message,
      stack: data.stack,
    }
    if (data.cause) result.cause = serialize(data.cause)
    return result
  }
  return data
}

function log(level: LogLevel, { message, type, data }: LogPayload) {
  if (LEVELS[level] < minLevel) return

  const timestamp = ts()
  const tag = type ? ` [${type}]` : ''
  const prefix = `[${timestamp}] [${level.toUpperCase()}]${tag}`
  const payload = data !== undefined ? serialize(data) : undefined

  const args: unknown[] = []

  if (isServer) {
    args.push(`${ANSI[level]}${prefix}${RESET} ${message}`)
  } else {
    args.push(`%c${prefix}%c ${message}`, CSS[level], '')
  }

  if (payload !== undefined) args.push(payload)

  console[level](...args)
}

export const logger = {
  debug: (payload: LogPayload) => log('debug', payload),
  info: (payload: LogPayload) => log('info', payload),
  warn: (payload: LogPayload) => log('warn', payload),
  error: (payload: LogPayload) => log('error', payload),
}
