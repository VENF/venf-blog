import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostHeader } from '@/app/_components/post-header'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src as string} alt={alt as string} {...rest} />
  },
}))

describe('PostHeader', () => {
  const props = {
    title: 'Test Post',
    coverImage: '/test.jpg',
    date: '2024-01-01',
    excerpt: 'A test excerpt',
    content: 'word '.repeat(400),
  }

  it('renders the title', () => {
    render(<PostHeader {...props} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(<PostHeader {...props} />)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('renders the excerpt', () => {
    render(<PostHeader {...props} />)
    expect(screen.getByText('A test excerpt')).toBeInTheDocument()
  })

  it('renders reading time', () => {
    render(<PostHeader {...props} />)
    expect(screen.getByText(/min read/)).toBeInTheDocument()
  })
})
