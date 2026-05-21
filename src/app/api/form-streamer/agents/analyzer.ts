import fs from 'fs'
import path from 'path'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { google } from '../provider'
import type { AnalyzerOutput } from './types'

const FieldSpecSchema = z.object({
  name: z.string(),
  type: z.enum(['text', 'email', 'textarea', 'select', 'checkbox']),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
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

export async function analyzePrompt(
  userPrompt: string,
  history?: string[]
): Promise<AnalyzerOutput> {
  const systemPrompt = getSystemPrompt()

  const messages = history ? history.map((msg) => ({ role: 'user' as const, content: msg })) : []

  const { output } = await generateText({
    model: google('gemini-3-flash-preview'),
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({ schema: AnalyzerOutputSchema }),
    temperature: 0.3,
    maxRetries: 0,
  })

  console.log('output', output)

  return output
}
