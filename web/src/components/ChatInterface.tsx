import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { askQuestion, type ChatMessage } from '@/lib/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export function ChatInterface({ selectedDistrict }: { selectedDistrict: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!selectedDistrict) {
      alert("Please select a district in the settings/upload panel before asking a question.");
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const currentHistory = [...messages];
    
    setMessages([...currentHistory, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Create simplified history for the backend (just user/model roles)
      const historyForBackend = currentHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const responseText = await askQuestion({
        district: selectedDistrict,
        query: userMessage.content,
        history: historyForBackend
      });

      const botMessage: ChatMessage = { role: 'model', content: responseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error while processing your request.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b bg-white">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Election Education Assistant</h2>
          <p className="text-sm text-slate-500">
            {selectedDistrict ? `Answering for ${selectedDistrict}` : 'Please select a district'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Bot className="w-16 h-16 opacity-20" />
            <p>Ask a question about election procedures!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground ml-3' : 'bg-slate-200 text-slate-600 mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <Card className={`px-4 py-3 shadow-sm border-none ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                </Card>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 text-slate-600 mr-3">
                <Bot size={16} />
              </div>
              <Card className="px-4 py-3 shadow-sm border-none bg-white text-slate-800 rounded-tl-none flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400 mr-2" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedDistrict ? "Ask about election rules..." : "Select a district first..."}
            className="min-h-[60px] max-h-[200px] resize-none pr-12 focus-visible:ring-primary py-3"
            disabled={!selectedDistrict || loading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || !selectedDistrict || loading}
            className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-full"
          >
            <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-center text-slate-400 mt-2">
          AI can make mistakes. Always verify with official election manuals.
        </p>
      </div>
    </div>
  );
}
