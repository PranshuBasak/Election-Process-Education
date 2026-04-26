import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import LearnPage from '../LearnPage';

// Mock fetch
global.fetch = vi.fn();
const mockFetch = global.fetch as Mock;

const mockModules = [
  { slug: 'voting-101', title: 'Voting 101', icon: 'Vote', summary: 'Basics of voting' }
];

describe('LearnPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders learning modules', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockModules,
    });

    render(
      <BrowserRouter>
        <LearnPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Voting 101')).toBeInTheDocument();
      expect(screen.getByText('Basics of voting')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('API error'));

    render(
      <BrowserRouter>
        <LearnPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Election Education Modules/i)).toBeInTheDocument();
    });
  });
});
