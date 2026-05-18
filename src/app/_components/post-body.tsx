'use client'

import { FileCode } from 'lucide-react'
import { Code, CodeHeader, CodeBlock } from '@/components/animate-ui/components/animate/code'
import type { ContentSegment } from '@/lib/markdownToHtml'

type Props = {
  segments: ContentSegment[]
}

export function PostBody({ segments }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 [&_p_code]:rounded [&_p_code]:bg-muted [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:text-sm [&_p_code]:font-normal [&_p_code]:before:content-none [&_p_code]:after:content-none">
      {segments.map((segment, i) =>
        segment.type === 'html' ? (
          <div key={i} className="contents" dangerouslySetInnerHTML={{ __html: segment.html }} />
        ) : (
          <Code key={i} code={segment.code}>
            <CodeHeader icon={FileCode} copyButton>
              {segment.lang.toUpperCase()}
            </CodeHeader>
            <CodeBlock lang={segment.lang} writing={false} cursor={false} />
          </Code>
        )
      )}
    </div>
  )
}
