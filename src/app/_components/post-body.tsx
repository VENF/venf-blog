type Props = {
  content: string
}

export function PostBody({ content }: Props) {
  return (
    <div
      className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
