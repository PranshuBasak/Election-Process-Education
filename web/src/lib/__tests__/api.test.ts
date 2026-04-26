import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { api } from '../api';

describe('api client', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  const mockFetch = (data: any, ok = true, status = 200) => {
    (global.fetch as Mock).mockResolvedValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      json: async () => data,
    });
  };

  it('chat() sends correct request', async () => {
    mockFetch({ reply: 'Hello' });
    const res = await api.chat('Hi', 'hi');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/chat'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ message: 'Hi', locale: 'hi' }),
    }));
    expect(res.reply).toBe('Hello');
  });

  it('timeline() sends correct request', async () => {
    mockFetch([{ phase: 'Phase 1' }]);
    const res = await api.timeline();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/timeline'), expect.anything());
    expect(res[0].phase).toBe('Phase 1');
  });

  it('learnModules() sends correct request', async () => {
    mockFetch([{ slug: 'test' }]);
    const res = await api.learnModules();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/learn'), expect.anything());
    expect(res[0].slug).toBe('test');
  });

  it('learnModule() sends correct request', async () => {
    mockFetch({ slug: 'test' });
    const res = await api.learnModule('test');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/learn/test'), expect.anything());
    expect(res.slug).toBe('test');
  });

  it('glossary() sends correct request', async () => {
    mockFetch([{ term: 'Test' }]);
    const res = await api.glossary();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/glossary'), expect.anything());
    expect(res[0].term).toBe('Test');
  });

  it('glossaryTerm() sends correct request', async () => {
    mockFetch({ term: 'Test' });
    const res = await api.glossaryTerm('Test');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/glossary/Test'), expect.anything());
    expect(res.term).toBe('Test');
  });

  it('quiz() sends correct request', async () => {
    mockFetch({ topic: 'General' });
    const res = await api.quiz('General', 'hard', 10, 'te');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/quiz'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ topic: 'General', difficulty: 'hard', count: 10, locale: 'te' }),
    }));
    expect(res.topic).toBe('General');
  });

  it('eligibility() sends correct request', async () => {
    mockFetch({ eligible: true });
    const res = await api.eligibility(25, 'Indian', true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/eligibility'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ age: 25, nationality: 'Indian', has_epic: true }),
    }));
    expect(res.eligible).toBe(true);
  });

  it('sources() sends correct request', async () => {
    mockFetch({ sources: [] });
    const res = await api.sources();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/sources'), expect.anything());
    expect(res.sources).toEqual([]);
  });

  it('health() sends correct request', async () => {
    mockFetch({ status: 'ok' });
    const res = await api.health();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/health'), expect.anything());
    expect(res.status).toBe('ok');
  });

  it('polling() sends correct request', async () => {
    mockFetch({ message: 'Found' });
    const res = await api.polling('test');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/polling?q=test'), expect.anything());
    expect(res.message).toBe('Found');
  });

  it('throws error on non-ok response', async () => {
    mockFetch({}, false, 500);
    await expect(api.health()).rejects.toThrow('API 500: Error');
  });
});
