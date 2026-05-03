import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    chat: vi.fn(),
  },
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('opens a responsive AI response dialog for long answers and caps sources', async () => {
    (api.chat as Mock).mockResolvedValue({
      reply: 'A long verified answer. '.repeat(80),
      intent: 'general_question',
      grounded: true,
      citations: Array.from({ length: 10 }, (_, index) => ({
        title: `Official source ${index + 1}`,
        url: `https://example.com/source-${index + 1}`,
      })),
    });

    renderWithRouter(<HomePage />);

    fireEvent.change(screen.getByLabelText(/Ask an election question/i), {
      target: { value: 'How are votes counted?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ask AI/i }));

    const dialog = await screen.findByRole('dialog', { name: /ElectionEdu AI/i });
    expect(dialog).toHaveClass('max-h-[88vh]');
    expect(screen.getByText(/A long verified answer/i)).toBeInTheDocument();
    expect(screen.getByText('Showing 8 of 10 sources.')).toBeInTheDocument();
    expect(screen.queryByText('Official source 9')).not.toBeInTheDocument();
  });

  it('closes the AI response dialog with Escape', async () => {
    (api.chat as Mock).mockResolvedValue({
      reply: 'Verified answer.',
      citations: [],
      intent: 'general_question',
    });

    renderWithRouter(<HomePage />);

    fireEvent.change(screen.getByLabelText(/Ask an election question/i), {
      target: { value: 'What is MCC?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ask AI/i }));

    await screen.findByRole('dialog', { name: /ElectionEdu AI/i });
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /ElectionEdu AI/i })).not.toBeInTheDocument();
    });
  });
});
