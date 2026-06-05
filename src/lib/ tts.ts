export type TTSSegment = {
  index: number
  text: string
  heading?: string
}

function cleanText(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*|_){1,3}([^*_]+)\1{1,3}/g, '$2')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}[^`]+`{1,3}/g, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^[\s>|:-]+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&[a-z]+;/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function extractTTSSegments(markdown: string): TTSSegment[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')

  const lines = withoutCode.split('\n')
  const segments: TTSSegment[] = []
  let currentText = ''
  let currentHeading = ''

  for (const line of lines) {
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/)
    if (headingMatch) {
      if (currentText.trim()) {
        const cleaned = cleanText(currentText)
        if (cleaned) {
          segments.push({
            index: segments.length,
            text: cleaned,
            heading: currentHeading || undefined,
          })
        }
      }
      currentText = ''
      currentHeading = headingMatch[2].trim()
      continue
    }
    currentText += line + '\n'
  }

  if (currentText.trim()) {
    const cleaned = cleanText(currentText)
    if (cleaned) {
      segments.push({
        index: segments.length,
        text: cleaned,
        heading: currentHeading || undefined,
      })
    }
  }

  return segments.filter((s) => s.text.length > 0)
}
