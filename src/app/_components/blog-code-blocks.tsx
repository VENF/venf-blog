'use client'

import { useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useTheme } from 'next-themes'
import { FileCode } from 'lucide-react'
import { Code, CodeHeader, CodeBlock } from '@/components/animate-ui/components/animate/code'

export function BlogCodeBlocks() {
  const { resolvedTheme } = useTheme()
  const rootsRef = useRef<Root[]>([])
  const blocksRef = useRef<{ code: string; lang: string }[]>([])

  useEffect(() => {
    const codeEls = document.querySelectorAll<HTMLElement>('article pre code[class*="language-"]')
    const blocks: { code: string; lang: string }[] = []
    const roots: Root[] = []

    codeEls.forEach((codeEl) => {
      const pre = codeEl.parentElement
      if (!pre) return

      const langClass = [...codeEl.classList].find((c) => c.startsWith('language-'))
      const lang = langClass ? langClass.replace('language-', '').toLowerCase() : ''
      const codeText = codeEl.textContent || ''

      const container = document.createElement('div')
      pre.parentNode?.replaceChild(container, pre)

      blocks.push({ code: codeText, lang })
      roots.push(createRoot(container))
    })

    blocksRef.current = blocks
    rootsRef.current = roots

    return () => {
      const currentRoots = rootsRef.current
      rootsRef.current = []
      setTimeout(() => {
        currentRoots.forEach((r) => r.unmount())
      }, 0)
    }
  }, [])

  useEffect(() => {
    const roots = rootsRef.current
    const blocks = blocksRef.current
    if (blocks.length === 0) return

    const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

    roots.forEach((root, i) => {
      const { code: codeText, lang } = blocks[i]
      root.render(
        <Code code={codeText}>
          <CodeHeader icon={FileCode} copyButton>
            {lang.toUpperCase()}
          </CodeHeader>
          <CodeBlock lang={lang} writing={false} cursor={false} theme={theme} />
        </Code>
      )
    })
  }, [resolvedTheme])

  return null
}
