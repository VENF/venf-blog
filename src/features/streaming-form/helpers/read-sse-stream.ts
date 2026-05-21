export async function readSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (content: string) => void
): Promise<void> {
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const line = part.trim()
      if (!line || !line.startsWith('data: ')) continue
      const data = line.slice(6)

      if (data === '[DONE]') return

      try {
        const event = JSON.parse(data)
        const content = event.choices?.[0]?.delta?.content
        if (content) onChunk(content)
      } catch {
        // skip malformed JSON in SSE
      }
    }
  }
}
