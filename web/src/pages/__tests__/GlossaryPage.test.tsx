import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import GlossaryPage from '../GlossaryPage';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    glossary: vi.fn(),
    health: vi.fn(),
    chat: vi.fn(),
    learnModules: vi.fn(),
    learnModule: vi.fn(),
    glossaryTerm: vi.fn(),
    quiz: vi.fn(),
    eligibility: vi.fn(),
    timeline: vi.fn(),
    sources: vi.fn(),
  },
}));

const mockGlossary = [
  { term: 'EVM', definition_md: 'Electronic Voting Machine', source_url: 'http://example.com' },
  { term: 'VVPAT', definition_md: 'Voter Verifiable Paper Audit Trail', source_url: 'http://example.com' }
];

describe('GlossaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders glossary items and expands them', async () => {
    (api.glossary as Mock).mockResolvedValue(mockGlossary);

    render(<GlossaryPage />);

    await waitFor(() => {
      expect(screen.getByText('EVM')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Test expansion
    const evmButton = screen.getByText('EVM');
    fireEvent.click(evmButton);
    expect(screen.getByText('Electronic Voting Machine')).toBeInTheDocument();

    // Test collapse
    fireEvent.click(evmButton);
    expect(screen.queryByText('Electronic Voting Machine')).not.toBeInTheDocument();
  });

  it('filters glossary items', async () => {
    (api.glossary as Mock).mockResolvedValue(mockGlossary);

    render(<GlossaryPage />);

    await waitFor(() => expect(screen.getByText('EVM')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Search terms/i), { target: { value: 'machine' } });
    
    expect(screen.getByText('EVM')).toBeInTheDocument();
    expect(screen.queryByText('VVPAT')).not.toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    (api.glossary as Mock).mockResolvedValue(mockGlossary);

    render(<GlossaryPage />);

    await waitFor(() => expect(screen.getByText('EVM')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Search terms/i), { target: { value: 'xyz' } });
    
    expect(screen.getByText(/No terms found/i)).toBeInTheDocument();
  });
});
