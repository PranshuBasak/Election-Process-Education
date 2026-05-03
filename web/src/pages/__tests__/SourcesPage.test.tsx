import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import SourcesPage from '../SourcesPage';
import { api } from '@/lib/api';

// Mock the API module
vi.mock('@/lib/api', () => ({
  api: {
    sources: vi.fn(),
    health: vi.fn(),
    chat: vi.fn(),
    learnModules: vi.fn(),
    learnModule: vi.fn(),
    glossary: vi.fn(),
    glossaryTerm: vi.fn(),
    quiz: vi.fn(),
    eligibility: vi.fn(),
    timeline: vi.fn(),
  },
}));

const mockSources = {
  sources: [
    {
      name: 'ECI Official Website',
      base_url: 'https://eci.gov.in',
      purpose: 'The official portal of the Election Commission of India.',
      status: 'ok',
      auth: 'none'
    }
  ]
};

describe('SourcesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state and then content', async () => {
    (api.sources as Mock).mockResolvedValue(mockSources);

    render(<SourcesPage />);

    await waitFor(() => {
      expect(screen.getByText('ECI Official Website')).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByText('The official portal of the Election Commission of India.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visit ECI Official Website/i })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles empty sources or error', async () => {
    (api.sources as Mock).mockRejectedValue(new Error('API Error'));

    render(<SourcesPage />);

    await waitFor(() => {
      expect(screen.getByText('Data Sources')).toBeInTheDocument();
    });

    expect(screen.queryByText('ECI Official Website')).not.toBeInTheDocument();
  });
});
