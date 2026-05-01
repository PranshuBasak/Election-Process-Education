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
    expect(screen.getByText(/Empowering the/i)).toBeInTheDocument();
    expect(screen.getByText(/World's Largest Democracy/i)).toBeInTheDocument();
  });

  it('renders main feature links', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Learning Hub')).toBeInTheDocument();
    expect(screen.getByText('Phase Timeline')).toBeInTheDocument();
  });

  it('renders voter checklist', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Voter Checklist')).toBeInTheDocument();
    expect(screen.getByText('Check Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Find Polling Station')).toBeInTheDocument();
  });

  it('renders fact of the day', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Did You Know?')).toBeInTheDocument();
  });
});
