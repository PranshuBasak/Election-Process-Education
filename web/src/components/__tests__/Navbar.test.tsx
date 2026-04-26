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
    
    // Initially mobile menu should not be visible in the DOM (it's conditionally rendered)
    // Actually, in the component it's {mobileOpen && ...}
    expect(screen.queryByRole('link', { name: /Home/i, hidden: false })).toBeInTheDocument(); // Desktop links
    
    fireEvent.click(menuButton);
    
    // After toggle, mobile links should be present
    const mobileLinks = screen.getAllByRole('link', { name: /Home/i });
    expect(mobileLinks.length).toBeGreaterThan(1); // One for desktop, one for mobile
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
