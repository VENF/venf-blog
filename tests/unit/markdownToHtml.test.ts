import { describe, it, expect } from 'vitest'
import markdownToHtml from '@/lib/markdownToHtml'

describe('markdownToHtml', () => {
  it('renders fenced code blocks with language class', async () => {
    const md = '```ts\nconst x = 1\n```'
    const html = await markdownToHtml(md)
    expect(html).toContain('<code class="language-ts">')
    expect(html).toContain('const x = 1')
  })

  it('renders headings without auto-ID (shiki handles headings)', async () => {
    const md = '## Hello World'
    const html = await markdownToHtml(md)
    expect(html).toContain('<h2>Hello World</h2>')
  })

  it('renders tables from GFM', async () => {
    const md = '| a | b |\n|---|---|\n| 1 | 2 |'
    const html = await markdownToHtml(md)
    expect(html).toContain('<table')
    expect(html).toContain('<td>1</td>')
  })

  it('converts plain text to paragraphs', async () => {
    const md = 'Hello world'
    const html = await markdownToHtml(md)
    expect(html).toContain('<p>Hello world</p>')
  })
})
