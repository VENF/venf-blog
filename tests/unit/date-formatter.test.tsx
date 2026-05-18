import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DateFormatter from '@/app/_components/date-formatter'

describe('DateFormatter', () => {
  it('renders a formatted date', () => {
    render(<DateFormatter dateString="2023-01-15" />)
    const time = screen.getByRole('time')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2023-01-15')
  })

  it('renders month day, year format', () => {
    render(<DateFormatter dateString="2023-01-15" />)
    expect(screen.getByText(/enero 15, 2023/)).toBeInTheDocument()
  })
})
