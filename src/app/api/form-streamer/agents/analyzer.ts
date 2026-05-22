import fs from 'fs'
import path from 'path'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { google } from '../provider'
import { FIELD_TYPES } from './types'
import type { AnalyzerOutput } from './types'

const FieldSpecSchema = z.object({
  name: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  colSpan: z.number().min(1).max(12).optional(),
})

const StatusEnum = z.enum(['clear', 'ambiguous'])

const AnalyzerOutputSchema = z.object({
  status: StatusEnum,
  title: z.string(),
  submitLabel: z.string(),
  fields: z.array(FieldSpecSchema),
  question: z.string().nullable(),
  reasoning: z.string().nullable(),
  context: z
    .object({
      knownFields: z.array(z.string()),
      missingInfo: z.array(z.string()),
    })
    .nullable(),
})

function getSystemPrompt(): string {
  const promptsDir = path.join(process.cwd(), 'prompts', 'form-builder')
  return fs.readFileSync(path.join(promptsDir, 'system-analyzer.md'), 'utf-8')
}

export async function analyzePrompt(userPrompt: string): Promise<AnalyzerOutput> {
  const systemPrompt = getSystemPrompt()

  const startTime = performance.now()
  const result = await generateText({
    model: google('gemini-3-flash-preview'),
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({ schema: AnalyzerOutputSchema }),
    temperature: 0.3,
    maxRetries: 0,
  })
  const latency = performance.now() - startTime

  console.log(
    JSON.stringify({
      type: 'analyzer',
      model: 'gemini-3-flash-preview',
      finishReason: result.finishReason,
      reasoningText: result.reasoningText,
      usage: result.totalUsage,
      output: result.output,
      latencyMs: Math.round(latency),
    })
  )

  return result.output
}
