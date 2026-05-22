import { NextRequest } from 'next/server'
import { createPipelineStream } from '../agents/pipeline'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const result = await createPipelineStream(prompt)

    if (result.type === 'ambiguous') {
      return Response.json(result.output)
    }

    return handleGeneratorStream(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error processing request'
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
