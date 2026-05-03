import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import PollingStationPage from '../PollingStationPage';
import { api } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    polling: vi.fn(),
  },
}));

describe('PollingStationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<PollingStationPage />);
    expect(screen.getByText('Polling Station Lookup')).toBeInTheDocument();
    expect(screen.getByLabelText(/EPIC number or address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Polling Station/i })).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    (api.polling as Mock).mockResolvedValue({
      message: 'Your polling station is at Govt School, Mumbai.',
      source_url: 'https://voters.eci.gov.in',
      open_maps_url: 'https://www.google.com/maps/search/?api=1&query=Mumbai',
    });

    render(<PollingStationPage />);
    
    const input = screen.getByPlaceholderText(/Enter your EPIC number/i);
    fireEvent.change(input, { target: { value: 'ABC1234567' } });
    
    const button = screen.getByRole('button', { name: /Search Polling Station/i });
    fireEvent.click(button);

    expect(api.polling).toHaveBeenCalledWith('ABC1234567');

    await waitFor(() => {
      expect(screen.getByText(/Govt School, Mumbai/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('link', { name: /Visit Official Portal/i })).toHaveAttribute('href', 'https://voters.eci.gov.in');
    expect(screen.getByRole('link', { name: /Open in Google Maps/i })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles search error', async () => {
    (api.polling as Mock).mockRejectedValue(new Error('Network error'));

    render(<PollingStationPage />);
    
    const input = screen.getByPlaceholderText(/Enter your EPIC number/i);
    fireEvent.change(input, { target: { value: 'error' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Search Polling Station/i }));

    await waitFor(() => {
      expect(screen.getByText(/Unable to search/i)).toBeInTheDocument();
    });
  });

  it('does not search with empty query', () => {
    render(<PollingStationPage />);
    fireEvent.click(screen.getByRole('button', { name: /Search Polling Station/i }));
    expect(api.polling).not.toHaveBeenCalled();
  });

  it('searches on Enter key', async () => {
    (api.polling as Mock).mockResolvedValue({ message: 'Found' });

    render(<PollingStationPage />);
    const input = screen.getByPlaceholderText(/Enter your EPIC number/i);
    fireEvent.change(input, { target: { value: 'ABC' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(api.polling).toHaveBeenCalledWith('ABC');
    await waitFor(() => {
      expect(screen.getByText('Found')).toBeInTheDocument();
    });
  });
});
