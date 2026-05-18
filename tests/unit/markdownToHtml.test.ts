import { describe, it, expect } from 'vitest'
import markdownToHtml from '@/lib/markdownToHtml'

describe('markdownToHtml', () => {
  it('renders fenced code blocks as code segments', async () => {
    const md = '```ts\nconst x = 1\n```'
    const segments = await markdownToHtml(md)
    expect(segments).toHaveLength(1)
    const s = segments[0]
    if (s.type === 'code') {
      expect(s.lang).toBe('ts')
      expect(s.code).toContain('const x = 1')
      expect(s.code).toContain('\n')
    } else {
      expect.unreachable('expected code segment')
    }
  })

  it('renders headings as html segments', async () => {
    const md = '## Hello World'
    const segments = await markdownToHtml(md)
    const html = segments.map((s) => (s.type === 'html' ? s.html : '')).join('')
    expect(html).toContain('<h2>Hello World</h2>')
  })

  it('renders tables from GFM as html segments', async () => {
    const md = '| a | b |\n|---|---|\n| 1 | 2 |'
    const segments = await markdownToHtml(md)
    const html = segments.map((s) => (s.type === 'html' ? s.html : '')).join('')
    expect(html).toContain('<table')
    expect(html).toContain('<td>1</td>')
  })

  it('converts plain text to paragraphs as html segments', async () => {
    const md = 'Hello world'
    const segments = await markdownToHtml(md)
    const html = segments.map((s) => (s.type === 'html' ? s.html : '')).join('')
    expect(html).toContain('<p>Hello world</p>')
  })

  it('interleaves html and code segments', async () => {
    const md = 'Some text.\n\n```js\nconsole.log(1)\n```\n\nMore text.'
    const segments = await markdownToHtml(md)
    expect(segments).toHaveLength(3)
    expect(segments[0].type).toBe('html')
    expect(segments[1].type).toBe('code')
    if (segments[1].type === 'code') {
      expect(segments[1].lang).toBe('js')
    }
    expect(segments[2].type).toBe('html')
  })

  it('handles code blocks without language', async () => {
    const md = '```\nplain block\n```'
    const segments = await markdownToHtml(md)
    expect(segments).toHaveLength(1)
    if (segments[0].type === 'code') {
      expect(segments[0].lang).toBe('')
    }
  })
})
