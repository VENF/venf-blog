import { z } from 'zod'
import { NextRequest } from 'next/server'
import { generateFormStream } from '../agents/generator'
import { mockGenerateFormStream } from '../agents/mock-generator'
import type { AnalyzerOutput } from '../agents/types'

const FieldSpecSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['text', 'email', 'textarea', 'select', 'checkbox']),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
})

const ClearAnalysisSchema = z.object({
  status: z.literal('clear'),
  title: z.string().min(1),
  submitLabel: z.string().min(1),
  fields: z.array(FieldSpecSchema).min(1),
})

const RequestSchema = z.object({
  analysis: ClearAnalysisSchema,
})

export async function POST(request: NextRequest) {
  const mock = request.nextUrl.searchParams.get('mock') === 'true'

  try {
    if (mock) {
      return handleGeneratorStream(mockGenerateFormStream('register'))
    }

    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid analysis', details: parsed.error.issues },
        { status: 400 }
      )
    }

    return handleGeneratorStream(
      generateFormStream(parsed.data.analysis as unknown as AnalyzerOutput)
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error generating form'
    return Response.json({ error: message }, { status: 500 })
  }
}

async function handleGeneratorStream(result: { textStream: AsyncIterable<string> }) {
  const encoder = new TextEncoder()
  const id = `chat-${Date.now()}`

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) {
          const event = {
            id,
            object: 'chat.completion.chunk',
            choices: [
              {
                index: 0,
                delta: { content: chunk },
                finish_reason: null as null | string,
              },
            ],
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              id,
              object: 'chat.completion.chunk',
              choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
            })}\n\n`
          )
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error generating form'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
