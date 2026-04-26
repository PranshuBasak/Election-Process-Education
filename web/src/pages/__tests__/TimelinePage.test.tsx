import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import TimelinePage from '../TimelinePage';
import { api } from '@/lib/api';

// Mock the API module
vi.mock('@/lib/api', () => ({
  api: {
    timeline: vi.fn(),
    health: vi.fn(),
    chat: vi.fn(),
    learnModules: vi.fn(),
    learnModule: vi.fn(),
    glossary: vi.fn(),
    glossaryTerm: vi.fn(),
    quiz: vi.fn(),
    eligibility: vi.fn(),
    sources: vi.fn(),
  },
}));

const mockTimeline = [
  {
    phase: 'Announcement',
    start: '2024-03-16',
    end: '2024-03-16',
    description: 'Election schedule announced.',
    legal_ref: 'Article 324',
    source_url: 'http://example.com'
  }
];

describe('TimelinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders timeline items', async () => {
    (api.timeline as Mock).mockResolvedValue(mockTimeline);

    render(<TimelinePage />);

    // Wait for the loader to disappear or the content to appear
    await waitFor(() => {
      expect(screen.getByText('Announcement')).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByText('Election schedule announced.')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    (api.timeline as Mock).mockRejectedValue(new Error('API Error'));

    render(<TimelinePage />);

    // Wait for loading to finish (the header should still be there)
    await waitFor(() => {
      expect(screen.getByText('Election Timeline')).toBeInTheDocument();
    });

    // Check that items are NOT rendered
    expect(screen.queryByText('Announcement')).not.toBeInTheDocument();
  });
});
