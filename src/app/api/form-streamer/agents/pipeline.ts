import fs from 'fs'
import path from 'path'
import { streamText } from 'ai'
import { google } from '../provider'
import { parsePartialJson } from '@/features/streaming-form/parser/partial-json-parser'
import type { AnalyzerOutput } from './types'

function getSystemPrompt(): string {
  const promptsDir = path.join(process.cwd(), 'prompts', 'form-builder')
  return fs.readFileSync(path.join(promptsDir, 'system-pipeline.md'), 'utf-8')
}

export type PipelineResult =
  | { type: 'clear'; textStream: AsyncIterable<string> }
  | { type: 'ambiguous'; output: AnalyzerOutput }

export async function createPipelineStream(prompt: string): Promise<PipelineResult> {
  const systemPrompt = getSystemPrompt()

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: systemPrompt,
    prompt,
    temperature: 0.3,
  })

  const buffered: string[] = []
  let fullText = ''
  let status: string | null = null
  const iterator = result.textStream[Symbol.asyncIterator]()

  while (status === null) {
    const { done, value } = await iterator.next()
    if (done) break
    buffered.push(value)
    fullText += value

    const parsed = parsePartialJson(fullText)
    if (parsed?.value && typeof parsed.value === 'object') {
      status = ((parsed.value as Record<string, unknown>).status as string) ?? null
    }
  }

  if (status === 'ambiguous') {
    while (true) {
      const { done, value } = await iterator.next()
      if (done) break
      fullText += value
    }
    return { type: 'ambiguous', output: JSON.parse(fullText) as AnalyzerOutput }
  }

  async function* textStream() {
    for (const chunk of buffered) yield chunk
    while (true) {
      const { done, value } = await iterator.next()
      if (done) break
      yield value
    }
  }

  return { type: 'clear', textStream: textStream() }
}
