const BASE = import.meta.env.VITE_API_URL || '/api';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { ...JSON_HEADERS, ...opts?.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface Citation {
  title: string;
  url: string;
}

export interface ChatResponse {
  reply: string;
  citations: Citation[];
  intent: string;
  grounded: boolean;
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

export interface ProgressData {
  completed_modules?: string[];
  quiz_scores?: Record<string, number>;
  checklist?: Record<string, boolean>;
  preferred_locale?: string;
  [key: string]: string | number | boolean | string[] | Record<string, number> | Record<string, boolean> | undefined;
}

export const api = {
  chat: (message: string, locale = 'en') =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, locale }),
    }),

  timeline: () => request<TimelineItem[]>('/timeline'),

  learnModules: () => request<LearnModule[]>('/learn'),

  learnModule: (slug: string) => request<LearnModule>(`/learn/${encodeURIComponent(slug)}`),

  glossary: () => request<GlossaryTerm[]>('/glossary'),

  glossaryTerm: (term: string) => request<GlossaryTerm>(`/glossary/${encodeURIComponent(term)}`),

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

  polling: (q: string) =>
    request<{ message?: string; source_url?: string; open_maps_url?: string }>(`/polling?q=${encodeURIComponent(q)}`),

  health: () => request<{ status: string; version: string }>('/health'),

  saveProgress: (userId: string, data: ProgressData) =>
    request<{ status: string; persisted?: boolean }>('/user/progress', {
      method: 'POST',
      headers: { 'X-User-ID': userId },
      body: JSON.stringify({ data }),
    }),

  getProgress: (userId: string) =>
    request<ProgressData>('/user/progress', {
      headers: { 'X-User-ID': userId },
    }),
};
