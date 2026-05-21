export interface ParseResult {
  value: unknown
  isComplete: boolean
}

export function parsePartialJson(buffer: string): ParseResult {
  const trimmed = buffer.trim()

  if (trimmed.length === 0) {
    return { value: {}, isComplete: false }
  }

  try {
    const value = JSON.parse(trimmed)
    return { value, isComplete: true }
  } catch {
    // Fall through to partial parsing
  }

  const sanitized = sanitizePartialJson(trimmed)

  try {
    const value = JSON.parse(sanitized)
    return { value, isComplete: false }
  } catch {
    return extractPartialStructure(trimmed)
  }
}

interface WalkResult {
  depth: number
  inString: boolean
  escape: boolean
  typeStack: ('{' | '[')[]
  rootType: 'object' | 'array' | null
}

function walkState(input: string): WalkResult {
  const result: WalkResult = {
    depth: 0,
    inString: false,
    escape: false,
    typeStack: [],
    rootType: null,
  }

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (result.escape) {
      result.escape = false
      continue
    }

    if (result.inString) {
      if (ch === '\\') {
        result.escape = true
      } else if (ch === '"') {
        result.inString = false
      }
      continue
    }

    if (ch === '"') {
      result.inString = true
      continue
    }

    if (result.rootType === null) {
      if (ch === '{') {
        result.rootType = 'object'
        result.depth = 1
        result.typeStack.push('{')
      } else if (ch === '[') {
        result.rootType = 'array'
        result.depth = 1
        result.typeStack.push('[')
      }
      continue
    }

    if (ch === '{') {
      result.depth++
      result.typeStack.push('{')
    } else if (ch === '}') {
      result.depth--
      if (result.typeStack.length > 0) result.typeStack.pop()
    } else if (ch === '[') {
      result.depth++
      result.typeStack.push('[')
    } else if (ch === ']') {
      result.depth--
      if (result.typeStack.length > 0) result.typeStack.pop()
    }
  }

  return result
}

function sanitizePartialJson(input: string): string {
  let result = input
  const state = walkState(input)

  if (state.inString) {
    result = truncateIncompletePair(input)
  }

  result = removeTrailingComma(result)

  const currentState = walkState(result)

  if (
    currentState.rootType === 'array' &&
    currentState.depth > 0 &&
    lastItemIsIncompleteStructure(result)
  ) {
    result = truncateLastArrayItem(result)
  }

  const finalState = walkState(result)

  for (let i = finalState.typeStack.length - 1; i >= 0; i--) {
    result += finalState.typeStack[i] === '{' ? '}' : ']'
  }

  return result
}

function truncateIncompletePair(input: string): string {
  const lastQuote = input.lastIndexOf('"')
  if (lastQuote <= 0) return input.replace(/,\s*$/g, '')

  let at = lastQuote
  while (at > 0) {
    at--
    if (input[at] === ',') break
  }

  return input.substring(0, at).trimEnd().replace(/,\s*$/g, '')
}

function removeTrailingComma(input: string): string {
  let result = input
  let prev: string | null = null
  do {
    prev = result
    result = result.replace(/,\s*$/g, '')
    result = result.replace(/,(\s*[}\]])/g, '$1')
  } while (result !== prev)
  return result
}

function lastItemIsIncompleteStructure(input: string): boolean {
  const lastComma = input.lastIndexOf(',')
  if (lastComma < 0) return false

  const afterComma = input.substring(lastComma + 1).trim()
  let depth = 0
  let inString = false
  let escape = false

  for (const ch of afterComma) {
    if (escape) {
      escape = false
      continue
    }
    if (inString) {
      if (ch === '\\') escape = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === '{' || ch === '[') depth++
    if (ch === '}' || ch === ']') depth--
  }

  return depth > 0
}

function truncateLastArrayItem(input: string): string {
  const lastComma = input.lastIndexOf(',')
  if (lastComma < 0) return ''
  return input.substring(0, lastComma).trimEnd()
}

function extractPartialStructure(input: string): ParseResult {
  let rootType: 'object' | 'array' = 'object'

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (ch === '{') {
      rootType = 'object'
      break
    } else if (ch === '[') {
      rootType = 'array'
      break
    } else if (!/\s/.test(ch)) {
      break
    }
  }

  if (rootType === 'array') {
    const items = extractCompleteArrayItems(input)
    if (items.length > 0) {
      return { value: items, isComplete: false }
    }
  }

  return { value: rootType === 'array' ? [] : {}, isComplete: false }
}

function extractCompleteArrayItems(input: string): unknown[] {
  const items: unknown[] = []
  let bracketDepth = 0
  let inString = false
  let escape = false
  let inArray = false
  let itemStart = -1
  let itemDepth = 0

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (escape) {
      escape = false
      continue
    }
    if (inString) {
      if (ch === '\\') escape = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }

    if (!inArray) {
      if (ch === '[') {
        inArray = true
        bracketDepth = 1
      }
      continue
    }

    if (ch === '[') {
      bracketDepth++
      if (bracketDepth > 1) itemDepth++
    } else if (ch === ']') {
      bracketDepth--
      if (bracketDepth === 0) {
        if (itemStart >= 0 && itemDepth === 0) {
          try {
            items.push(JSON.parse(input.substring(itemStart, i)))
          } catch {
            /* skip */
          }
        }
        break
      }
      if (bracketDepth >= 1) itemDepth--
    } else if (ch === '{') {
      itemDepth++
      if (itemDepth === 1 && bracketDepth === 1) {
        if (itemStart >= 0) {
          try {
            items.push(JSON.parse(input.substring(itemStart, i - 1)))
          } catch {
            /* skip */
          }
        }
        itemStart = i
      }
    } else if (ch === '}') {
      itemDepth--
      if (itemDepth === 0 && bracketDepth === 1 && itemStart >= 0) {
        try {
          items.push(JSON.parse(input.substring(itemStart, i + 1)))
        } catch {
          /* skip */
        }
        itemStart = -1
      }
    } else if (ch === ',' && bracketDepth === 1 && itemDepth === 0 && itemStart >= 0) {
      try {
        items.push(JSON.parse(input.substring(itemStart, i)))
      } catch {
        /* skip */
      }
      itemStart = -1
    }
  }

  return items
}
