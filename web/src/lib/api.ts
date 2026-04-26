const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3400';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatRequest {
  district: string;
  query: string;
  history?: ChatMessage[];
}

export interface IngestRequest {
  district: string;
  text: string;
}

export async function askQuestion(request: ChatRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/askElectionQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: request }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response');
  }

  const result = await response.json();
  return result.result;
}

export async function ingestSource(request: IngestRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ingestSource`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: request }),
  });

  if (!response.ok) {
    throw new Error('Failed to ingest source');
  }

  const result = await response.json();
  return result.result;
}
