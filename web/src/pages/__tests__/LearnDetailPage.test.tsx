import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LearnDetailPage from '../LearnDetailPage';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    learnModule: vi.fn(),
  },
}));

import { api } from '@/lib/api';

const mockModule = {
  id: 'mod1',
  slug: 'voter-registration',
  title: 'Voter Registration',
  summary: 'How to register to vote',
  icon: '📝',
  steps: [
    {
      order: 1,
      title: 'Fill Form 6',
      description_md: 'Download and fill form 6',
      who: 'New Voters',
      source_url: 'https://eci.gov.in',
    },
    {
      order: 2,
      title: 'Submit',
      description_md: 'Submit at BLO',
      who: 'All',
    },
  ],
};

describe('LearnDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state and then content', async () => {
    (api.learnModule as Mock).mockResolvedValue(mockModule);

    render(
      <MemoryRouter initialEntries={['/learn/voter-registration']}>
        <Routes>
          <Route path="/learn/:slug" element={<LearnDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to modules/i })).toBeInTheDocument();
      expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    });

    expect(screen.getByText('How to register to vote')).toBeInTheDocument();
    expect(screen.getByText('Fill Form 6')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('New Voters')).toBeInTheDocument();
  });

  it('toggles step completion', async () => {
    (api.learnModule as Mock).mockResolvedValue(mockModule);

    render(
      <MemoryRouter initialEntries={['/learn/voter-registration']}>
        <Routes>
          <Route path="/learn/:slug" element={<LearnDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Fill Form 6')).toBeInTheDocument();
    });

    const step1Button = screen.getByText('1');
    fireEvent.click(step1Button);

    // After clicking, the button should show a check icon (Lucide CheckCircle2)
    // In tests, we can check for the button having different classes or just that it changed
    // The component uses done.has(step.order) ? <CheckCircle2 /> : step.order
    
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    
    // Toggle back
    const step1DoneButton = screen.getByRole('button', { name: '' }); // Lucide icons usually don't have text
    fireEvent.click(step1DoneButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders error state when module not found', async () => {
    (api.learnModule as Mock).mockRejectedValue(new Error('Not found'));

    render(
      <MemoryRouter initialEntries={['/learn/unknown']}>
        <Routes>
          <Route path="/learn/:slug" element={<LearnDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Module not found')).toBeInTheDocument();
    });
  });
});
