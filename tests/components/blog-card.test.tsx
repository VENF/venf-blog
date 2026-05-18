import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogCard } from '@/app/_components/blog-card'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src as string} alt={alt as string} {...rest} />
  },
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

const mockPost = {
  slug: 'test-post',
  title: 'Test Blog Post',
  date: '2024-01-15',
  coverImage: '/test.jpg',
  excerpt: 'This is a test excerpt for the blog card',
  tags: ['react', 'typescript'],
  author: { name: 'Test Author', picture: '/author.jpg' },
  ogImage: { url: '/og.jpg' },
  content: '',
}

describe('BlogCard', () => {
  it('renders the title', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
  })

  it('renders the excerpt', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText(/test excerpt/)).toBeInTheDocument()
  })

  it('renders tag badges', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('links to the post page', () => {
    render(<BlogCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/test-post')
  })
})
