/**
 * API client — all calls to the FastAPI backend.
 */

const BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ── Types ──────────────────────────────────────────────────────────── */

export interface Citation {
  title: string;
  url: string;
}

export interface ChatResponse {
  reply: string;
  citations: Citation[];
  intent: string;
}

export interface TimelineItem {
  phase: string;
  start: string;
  end: string;
  description: string;
  legal_ref: string;
  source_url: string;
}

export interface Step {
  order: number;
  title: string;
  description_md: string;
  who: string;
  source_url: string;
}

export interface LearnModule {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  steps?: Step[];
}

export interface GlossaryTerm {
  term: string;
  definition_md: string;
  source_url: string;
}

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  source_url: string;
}

export interface QuizResponse {
  topic: string;
  questions: QuizQuestion[];
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  next_steps: string[];
  source_url: string;
}

export interface SourceInfo {
  name: string;
  base_url: string;
  purpose: string;
  auth: string;
  status: string;
}

/* ── API Calls ──────────────────────────────────────────────────────── */

export const api = {
  chat: (message: string, locale = 'en') =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, locale }),
    }),

  timeline: () => request<TimelineItem[]>('/timeline'),

  learnModules: () => request<LearnModule[]>('/learn'),

  learnModule: (slug: string) => request<LearnModule>(`/learn/${slug}`),

  glossary: () => request<GlossaryTerm[]>('/glossary'),

  glossaryTerm: (term: string) => request<GlossaryTerm>(`/glossary/${term}`),

  quiz: (topic: string, difficulty = 'medium', count = 5, locale = 'en') =>
    request<QuizResponse>('/quiz', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty, count, locale }),
    }),

  eligibility: (age: number, nationality = 'Indian', has_epic = false) =>
    request<EligibilityResult>('/eligibility', {
      method: 'POST',
      body: JSON.stringify({ age, nationality, has_epic }),
    }),

  sources: () => request<{ sources: SourceInfo[] }>('/sources'),

  health: () => request<{ status: string; version: string }>('/health'),
};
