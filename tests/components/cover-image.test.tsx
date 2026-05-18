import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoverImage from '@/app/_components/cover-image'

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

describe('CoverImage', () => {
  it('renders image with alt text', () => {
    render(<CoverImage title="Test" src="/test.jpg" />)
    const img = screen.getByAltText('Portada para Test')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('returns null when src is empty', () => {
    const { container } = render(<CoverImage title="Test" src="" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders a link when slug is provided', () => {
    render(<CoverImage title="Test" src="/test.jpg" slug="test-post" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/test-post')
  })

  it('does not render a link when slug is missing', () => {
    render(<CoverImage title="Test" src="/test.jpg" />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})
