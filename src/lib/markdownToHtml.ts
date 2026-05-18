import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { toHtml } from 'hast-util-to-html'
import { toText } from 'hast-util-to-text'
import type { Element, Root, Content } from 'hast'

export type ContentSegment =
  | { type: 'html'; html: string }
  | { type: 'code'; code: string; lang: string }

function isCodeBlock(node: Content): node is Element & { children: [Element] } {
  if (node.type !== 'element') return false
  if (node.tagName !== 'pre') return false
  if (node.children.length !== 1) return false
  const child = node.children[0]
  return child.type === 'element' && child.tagName === 'code'
}

export default async function markdownToHtml(markdown: string): Promise<ContentSegment[]> {
  const segments: ContentSegment[] = []
  let buffer: Content[] = []

  function flushBuffer() {
    if (buffer.length === 0) return
    const tree: Root = { type: 'root', children: buffer }
    segments.push({ type: 'html', html: toHtml(tree) })
    buffer = []
  }

  await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree: Root) => {
      for (const node of tree.children) {
        if (!isCodeBlock(node)) {
          buffer.push(node)
          continue
        }

        flushBuffer()

        const codeEl = node.children[0]
        const langClass = (codeEl.properties?.className as string[] | undefined)?.find(
          (c) => typeof c === 'string' && c.startsWith('language-')
        )
        const lang = langClass ? langClass.replace('language-', '').toLowerCase() : ''
        const code = toText(codeEl, { whitespace: 'pre' })

        segments.push({ type: 'code', code, lang })
      }

      flushBuffer()
    })
    .use(rehypeStringify)
    .process(markdown)

  return segments
}
