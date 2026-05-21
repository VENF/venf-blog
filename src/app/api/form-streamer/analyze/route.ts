import { z } from 'zod'
import { NextRequest } from 'next/server'
import { analyzePrompt } from '../agents/analyzer'
import { mockAnalyzePrompt } from '../agents/mock-analyzer'

const RequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  history: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  const mock = request.nextUrl.searchParams.get('mock') === 'true'

  try {
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { prompt, history } = parsed.data

    if (mock) {
      return Response.json(mockAnalyzePrompt(prompt))
    }

    // ajustar prompt
    const analysis = await analyzePrompt(prompt, history)

    return Response.json(analysis)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error analyzing prompt'
    return Response.json({ error: message }, { status: 500 })
  }
}
