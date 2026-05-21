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
    .map(
      (f) =>
        `- ${f.name} (${f.type})${f.options ? ` options=[${f.options.join(', ')}]` : ''}${f.required ? ' required' : ''}${f.placeholder ? ` placeholder="${f.placeholder}"` : ''}`
    )
    .join('\n')

  return `Genera un formulario con los siguientes campos:\n\n${fields}\n\nTítulo: ${analysis.title}\nSubmit: ${analysis.submitLabel}`
}

export function generateFormStream(analysis: AnalyzerOutput) {
  const systemPrompt = getSystemPrompt()
  const userPrompt = buildGeneratorPrompt(analysis)

  return streamText({
    model: google('gemini-3-flash-preview'),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.5,
    maxRetries: 3,
  })
}
