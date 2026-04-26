import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Citation } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! I can help you understand the voting process. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await api.chat(text);
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: res.reply, citations: res.citations },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or visit https://voters.eci.gov.in for official information.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Chat Drawer */}
      <div className="relative w-full max-w-md h-full bg-surface border-l border-outline-variant shadow-lg flex flex-col transform transition-transform duration-300 translate-x-0">
        
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>sparkles</span>
            <h2 className="font-ui-header text-ui-header">Election Assistant</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors" aria-label="Close chat">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
              )}
              
              <div
                className={`${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-2xl rounded-tr-sm p-3 font-ui-body text-ui-body max-w-[85%]'
                    : 'bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-sm p-3 text-on-surface font-ui-body text-ui-body max-w-[85%] flex flex-col gap-2'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-outline-variant flex flex-col gap-2">
                    <span className="font-ui-label text-ui-label text-on-surface-variant">Sources:</span>
                    {msg.citations.map((c, j) => (
                      <a
                        key={j}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-[12px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">description</span>
                        {c.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[16px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-sm p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2 bg-surface-container-low rounded-2xl border border-outline-variant p-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:ring-0 font-ui-body text-ui-body text-on-surface p-2 resize-none max-h-32 min-h-[40px] outline-none placeholder:text-outline-variant"
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-full bg-primary text-on-primary hover:bg-primary-fixed-dim transition-colors mb-1 mr-1 disabled:opacity-50"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
          <p className="text-center text-[10px] text-on-surface-variant mt-3 font-ui-label">
            AI responses are grounded in ECI sources but may contain errors.
          </p>
        </div>
      </div>
    </div>
  );
}
