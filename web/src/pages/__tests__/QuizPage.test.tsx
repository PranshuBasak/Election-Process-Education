import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import QuizPage from '../QuizPage';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    quiz: vi.fn(),
    health: vi.fn(),
    chat: vi.fn(),
    learnModules: vi.fn(),
    learnModule: vi.fn(),
    glossary: vi.fn(),
    glossaryTerm: vi.fn(),
    eligibility: vi.fn(),
    timeline: vi.fn(),
    sources: vi.fn(),
  },
}));

const mockQuestions = {
  questions: [
    {
      question: 'What is the voting age in India?',
      options: [
        { label: 'A', text: '16' },
        { label: 'B', text: '18' },
        { label: 'C', text: '21' },
        { label: 'D', text: '25' }
      ],
      correct: 'B',
      explanation: 'The voting age was reduced from 21 to 18 by the 61st Amendment.'
    },
    {
      question: 'Who conducts elections in India?',
      options: [
        { label: 'A', text: 'Parliament' },
        { label: 'B', text: 'President' },
        { label: 'C', text: 'Election Commission' },
        { label: 'D', text: 'Supreme Court' }
      ],
      correct: 'C',
      explanation: 'The ECI is an autonomous body.'
    }
  ]
};

describe('QuizPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders start screen', () => {
    render(<QuizPage />);
    expect(screen.getByText(/Test Your Knowledge/i)).toBeInTheDocument();
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });

  it('starts quiz, completes it, and allows retry', async () => {
    (api.quiz as Mock).mockResolvedValue(mockQuestions);

    render(<QuizPage />);
    
    // Topic selection
    fireEvent.click(screen.getByText('Voter Registration'));
    fireEvent.click(screen.getByText('Start Quiz'));

    await waitFor(() => {
      expect(screen.getByText('What is the voting age in India?')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Question 1: Wrong answer
    fireEvent.click(screen.getByText(/16/));
    expect(screen.getByText(/The voting age was reduced/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Question'));

    // Question 2: Correct answer
    expect(screen.getByText('Who conducts elections in India?')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Election Commission/));
    fireEvent.click(screen.getByText('See Results'));

    // Results screen
    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();

    // Try Again
    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText(/Test Your Knowledge/i)).toBeInTheDocument();
  });

  it('handles API error during quiz start', async () => {
    (api.quiz as Mock).mockRejectedValue(new Error('API Error'));

    render(<QuizPage />);
    fireEvent.click(screen.getByText('Start Quiz'));

    await waitFor(() => {
      expect(screen.queryByText('What is the voting age in India?')).not.toBeInTheDocument();
    });
  });
});
