import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../page'

describe('Home Page', () => {
  it('renders the hero title', () => {
    render(<Home />)
    expect(screen.getByText(/Democracy is/i)).toBeInTheDocument()
    expect(screen.getByText(/Powered/i, { selector: 'span' })).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText(/Search for voter registration/i)).toBeInTheDocument()
  })

  it('renders all learning modules', () => {
    render(<Home />)
    expect(screen.getByText('Voter Registration')).toBeInTheDocument()
    expect(screen.getByText('Polling Process')).toBeInTheDocument()
    expect(screen.getByText('Election Laws')).toBeInTheDocument()
    expect(screen.getByText('Candidate Info')).toBeInTheDocument()
  })
})
