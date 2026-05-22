import fs from 'fs'
import path from 'path'
import { streamText } from 'ai'
import { google } from '../provider'
import type { AnalyzerOutput } from './types'

function getSystemPrompt(): string {
  const promptsDir = path.join(process.cwd(), 'prompts', 'form-builder')
  return fs.readFileSync(path.join(promptsDir, 'system-generator.md'), 'utf-8')
}

function buildGeneratorPrompt(analysis: AnalyzerOutput): string {
  const fields = analysis.fields
    .map((f) => {
      const parts = [`- ${f.name} (${f.type})`]
      if (f.options) parts.push(`options=[${f.options.join(', ')}]`)
      if (f.required) parts.push('required')
      if (f.placeholder) parts.push(`placeholder="${f.placeholder}"`)
      if (f.minLength != null) parts.push(`minLength=${f.minLength}`)
      if (f.maxLength != null) parts.push(`maxLength=${f.maxLength}`)
      if (f.pattern) parts.push(`pattern="${f.pattern}"`)
      if (f.colSpan != null) parts.push(`colSpan=${f.colSpan}`)
      return parts.join(' ')
    })
    .join('\n')

  return `Genera un formulario con los siguientes campos:\n\n${fields}\n\nTítulo: ${analysis.title}\nSubmit: ${analysis.submitLabel}`
}

export function generateFormStream(analysis: AnalyzerOutput) {
  const systemPrompt = getSystemPrompt()
  const userPrompt = buildGeneratorPrompt(analysis)
  const startTime = performance.now()

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.5,
    maxRetries: 3,
  })

  let fullOutput = ''

  async function* wrappedStream() {
    try {
      for await (const chunk of result.textStream) {
        fullOutput += chunk
        yield chunk
      }

      const [totalUsage, finishReason, reasoningText] = await Promise.all([
        result.totalUsage,
        result.finishReason,
        result.reasoningText,
      ])
      const latency = performance.now() - startTime

      console.log(
        JSON.stringify({
          type: 'generator',
          model: 'gemini-3-flash-preview',
          finishReason,
          reasoningText,
          usage: totalUsage,
          output: fullOutput,
          latencyMs: Math.round(latency),
        })
      )
    } catch (error) {
      const latency = performance.now() - startTime
      console.error(
        JSON.stringify({
          type: 'generator',
          model: 'gemini-3-flash-preview',
          error: error instanceof Error ? error.message : String(error),
          latencyMs: Math.round(latency),
          partialOutput: fullOutput,
        })
      )
      throw error
    }
  }

  return { textStream: wrappedStream() }
}
