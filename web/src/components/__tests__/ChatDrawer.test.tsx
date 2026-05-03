import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ChatDrawer } from '../ChatDrawer';
import { api } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    chat: vi.fn(),
  },
}));

describe('ChatDrawer', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollTo as it's not implemented in JSDOM
    HTMLElement.prototype.scrollTo = vi.fn();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<ChatDrawer open={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when open', () => {
    render(<ChatDrawer open={true} onClose={mockOnClose} />);
    expect(screen.getByText(/Election Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Namaste!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
  });

  it('sends message and displays reply', async () => {
    (api.chat as Mock).mockResolvedValue({
      reply: 'Election Day is usually a holiday.',
      citations: [{ title: 'ECI FAQ', url: 'https://eci.gov.in/faq' }],
      intent: 'general'
    });

    render(<ChatDrawer open={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'Is election day a holiday?' } });
    
    const sendButton = screen.getByLabelText(/Send message/i);
    fireEvent.click(sendButton);

    expect(api.chat).toHaveBeenCalledWith('Is election day a holiday?');

    await waitFor(() => {
      expect(screen.getByText(/Election Day is usually a holiday/i)).toBeInTheDocument();
    });

    expect(screen.getByText('ECI FAQ')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ECI FAQ/i })).toHaveAttribute('href', 'https://eci.gov.in/faq');
    expect(screen.getByRole('link', { name: /ECI FAQ/i })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows Google grounding status when available', async () => {
    (api.chat as Mock).mockResolvedValue({
      reply: 'This answer was grounded.',
      citations: [],
      intent: 'general',
      grounded: true,
    });

    render(<ChatDrawer open={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Chat message/i), { target: { value: 'ground this' } });
    fireEvent.click(screen.getByLabelText(/Send message/i));

    await waitFor(() => {
      expect(screen.getByText(/Verified with Google Search grounding/i)).toBeInTheDocument();
    });
  });

  it('handles error gracefully', async () => {
    (api.chat as Mock).mockRejectedValue(new Error('Network error'));

    render(<ChatDrawer open={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByLabelText(/Send message/i));

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(<ChatDrawer open={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/Close chat/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    render(<ChatDrawer open={true} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(<ChatDrawer open={true} onClose={mockOnClose} />);
    // The backdrop is the first child of the fixed container
    const backdrop = container.querySelector('.absolute.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});
