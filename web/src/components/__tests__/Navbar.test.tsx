import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  const mockOnChatToggle = vi.fn();

  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Navbar onChatToggle={mockOnChatToggle} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Glossary')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
  });

  it('calls onChatToggle when Ask AI button is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar onChatToggle={mockOnChatToggle} />
      </MemoryRouter>
    );

    const chatButton = screen.getByLabelText(/Open AI Chat/i);
    fireEvent.click(chatButton);
    expect(mockOnChatToggle).toHaveBeenCalled();
  });

  it('toggles mobile menu', () => {
    render(
      <MemoryRouter>
        <Navbar onChatToggle={mockOnChatToggle} />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText(/Toggle menu/i);
    
    expect(screen.queryByRole('dialog', { name: /Mobile navigation/i })).not.toBeInTheDocument();
    
    fireEvent.click(menuButton);
    
    // After toggle, mobile links should be present
    const mobileLinks = screen.getAllByRole('link', { name: /Home/i });
    expect(mobileLinks.length).toBeGreaterThan(1); // One for desktop, one for mobile
    expect(screen.getByRole('dialog', { name: /Mobile navigation/i })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes mobile menu from the drawer close button', () => {
    render(
      <MemoryRouter>
        <Navbar onChatToggle={mockOnChatToggle} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Toggle menu/i));
    fireEvent.click(screen.getByLabelText(/Close menu/i));

    expect(screen.queryByRole('dialog', { name: /Mobile navigation/i })).not.toBeInTheDocument();
  });

  it('highlights active link', () => {
    render(
      <MemoryRouter initialEntries={['/learn']}>
        <Navbar onChatToggle={mockOnChatToggle} />
      </MemoryRouter>
    );

    const learnLink = screen.getByRole('link', { name: /Learn/i });
    expect(learnLink).toHaveClass('bg-primary/10');
  });
});
