import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('HomePage', () => {
  it('renders hero section correctly', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Know Your Vote/i)).toBeInTheDocument();
    expect(screen.getByText(/Shape Your Future/i)).toBeInTheDocument();
  });

  it('renders all feature links', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Election Timeline')).toBeInTheDocument();
    expect(screen.getByText('Glossary')).toBeInTheDocument();
    expect(screen.getByText('Am I Eligible?')).toBeInTheDocument();
    expect(screen.getByText('Find Polling Station')).toBeInTheDocument();
    expect(screen.getByText('Quiz Challenge')).toBeInTheDocument();
    expect(screen.getByText('Data Sources')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('96.8 Cr')).toBeInTheDocument();
    expect(screen.getByText('Registered Voters')).toBeInTheDocument();
  });
});
