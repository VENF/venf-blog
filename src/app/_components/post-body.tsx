type Props = {
  content: string
}

export function PostBody({ content }: Props) {
  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
