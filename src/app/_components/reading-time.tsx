type Props = {
  content: string
}

export function ReadingTime({ content }: Props) {
  const words = content.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))

  return <span>{minutes} min read</span>
}
