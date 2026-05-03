import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import EligibilityPage from '../EligibilityPage';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    eligibility: vi.fn(),
    health: vi.fn(),
    chat: vi.fn(),
    learnModules: vi.fn(),
    learnModule: vi.fn(),
    glossary: vi.fn(),
    glossaryTerm: vi.fn(),
    quiz: vi.fn(),
    timeline: vi.fn(),
    sources: vi.fn(),
  },
}));

describe('EligibilityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and handles input changes', () => {
    render(<EligibilityPage />);
    expect(screen.getByText(/Am I Eligible to Vote?/i)).toBeInTheDocument();

    const ageInput = screen.getByLabelText(/Your Age/i);
    fireEvent.change(ageInput, { target: { value: '25' } });
    expect(ageInput).toHaveValue(25);

    const nationalitySelect = screen.getByLabelText(/Nationality/i);
    fireEvent.change(nationalitySelect, { target: { value: 'Other' } });
    expect(nationalitySelect).toHaveValue('Other');

    const epicCheckbox = screen.getByLabelText(/I have a Voter ID/i);
    fireEvent.click(epicCheckbox);
    expect(epicCheckbox).toBeChecked();
  });

  it('shows eligibility result when form is submitted', async () => {
    const mockResult = {
      eligible: true,
      reason: 'You meet all criteria.',
      next_steps: ['Register online', 'Check name in roll'],
    };

    (api.eligibility as Mock).mockResolvedValue(mockResult);

    render(<EligibilityPage />);

    fireEvent.change(screen.getByLabelText(/Your Age/i), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Check Eligibility'));

    await waitFor(() => {
      expect(screen.getByText('You are Eligible')).toBeInTheDocument();
      expect(screen.getByText('Register online')).toBeInTheDocument();
    });
  });

  it('handles negative eligibility', async () => {
    const mockResult = {
      eligible: false,
      reason: 'You must be at least 18 years old.',
      next_steps: ['Wait until you turn 18'],
    };

    (api.eligibility as Mock).mockResolvedValue(mockResult);

    render(<EligibilityPage />);

    fireEvent.change(screen.getByLabelText(/Your Age/i), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Check Eligibility'));

    await waitFor(() => {
      expect(screen.getByText('Not Eligible')).toBeInTheDocument();
      expect(screen.getByText(/must be at least 18/)).toBeInTheDocument();
    });
  });

  it('validates age input before submitting', async () => {
    render(<EligibilityPage />);

    const ageInput = screen.getByLabelText(/Your Age/i);
    fireEvent.change(ageInput, { target: { value: '200' } });
    fireEvent.click(screen.getByText('Check Eligibility'));

    expect(api.eligibility).not.toHaveBeenCalled();
  });

  it('handles API error', async () => {
    (api.eligibility as Mock).mockRejectedValue(new Error('API error'));

    render(<EligibilityPage />);

    fireEvent.change(screen.getByLabelText(/Your Age/i), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Check Eligibility'));

    await waitFor(() => {
      expect(screen.queryByText('You are Eligible')).not.toBeInTheDocument();
      expect(screen.queryByText('Not Eligible')).not.toBeInTheDocument();
    });
  });
});
