import { streamText, Output } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { mockFormStream } from '../../../../tests/mocks/form-stream'

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
})

const FormSchema = z.object({
  title: z.string().describe('Título del formulario'),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['text', 'email', 'textarea', 'select']),
        label: z.string(),
        placeholder: z.string().optional(),
        required: z.boolean().default(false),
      })
    )
    .min(3)
    .max(4),
  submitLabel: z.string(),
})

export async function GET(request: NextRequest) {
  const mock = request.nextUrl.searchParams.get('mock') === 'true'
  const encoder = new TextEncoder()
  const id = `chat-${Date.now()}`

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (mock) {
          for await (const chunk of mockFormStream()) {
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
          }
          controller.close()
          return
        }

        const result = streamText({
          model: google('gemini-3-flash-preview'),
          system:
            'Eres un generador de formularios. Genera SOLO el JSON del formulario, sin explicaciones adicionales.',
          prompt: 'Genera un formulario de contacto con 3 o 4 campos',
          output: Output.object({ schema: FormSchema }),
          maxRetries: 3,
          temperature: 0.5,
          topP: 0.5,
        })

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
