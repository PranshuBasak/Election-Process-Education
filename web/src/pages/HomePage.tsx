import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { ChatResponse } from '../lib/api';

/**
 * HomePage is the main landing and interaction hub of the application.
 * It provides a search interface where users can ask questions regarding elections.
 * The component manages its own state for the query, loading indicator, and displaying
 * the chat response (including citations and intent) returned from the backend API.
 * It also features quick "Starter Chips" for common questions.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFact, setShowFact] = useState(true);

  const facts = [
    "India has the largest electorate in the world, with over 900 million registered voters.",
    "The first general elections in India were held in 1951-52.",
    "The 'None of the Above' (NOTA) option was introduced in Indian elections in 2013.",
    "The voting age in India was reduced from 21 to 18 in 1989."
  ];
  
  const [currentFact] = useState(() => facts[Math.floor(Math.random() * facts.length)]);

  const handleAsk = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setQuery(searchQuery);

    try {
      const result = await api.chat(searchQuery);
      setResponse(result);
    } catch {
      setError('Sorry, I am having trouble connecting to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 pt-8 md:pt-16 flex flex-col items-center w-full px-4 md:px-lg max-w-5xl mx-auto pb-24">
      {/* Dynamic News Ticker */}
      <div className="w-full bg-primary/5 border-y border-primary/10 py-2 mb-8 overflow-hidden whitespace-nowrap relative">
        <div className="flex items-center gap-8 animate-shimmer-slow">
          <span className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Updates
          </span>
          <span className="text-sm font-medium text-on-surface-variant">Next Phase: April 26th - Stay informed and ready to vote!</span>
          <span className="text-sm font-medium text-on-surface-variant">•</span>
          <span className="text-sm font-medium text-on-surface-variant">Check your polling station in the sidebar</span>
          <span className="text-sm font-medium text-on-surface-variant">•</span>
          <span className="text-sm font-medium text-on-surface-variant">New Quiz modules released!</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center mt-4 mb-12 animate-fade-in">
        <h1 className="font-h1-editorial text-4xl md:text-6xl text-primary mb-6 max-w-3xl leading-tight font-black">
          Empowering the <br />
          <span className="gradient-text">World's Largest Democracy</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 font-body-reading">
          Your AI-powered companion for navigating Indian elections. Ask questions, check eligibility, and stay updated with verified facts.
        </p>
        
        {/* Prompt Input */}
        <div className="w-full max-w-2xl bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-lg p-2 flex items-center gap-2 mb-6 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all duration-300">
          <span className="material-symbols-outlined text-outline-variant pl-3">search</span>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 font-ui-body text-lg text-on-surface py-4 outline-none placeholder:text-outline-variant" 
            placeholder="What would you like to know today?" 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk(query);
            }}
          />
          <button 
            onClick={() => handleAsk(query)}
            disabled={isLoading || !query.trim()}
            className="bg-primary text-primary-foreground font-ui-header font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            )}
            {isLoading ? 'Processing' : 'Ask AI'}
          </button>
        </div>

        {/* Starter Chips */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mb-12">
          {[
            "Am I eligible to vote?",
            "How is a vote counted?",
            "What is the MCC?",
            "Find my polling station"
          ].map((chip) => (
            <button 
              key={chip}
              onClick={() => handleAsk(chip)}
              className="px-5 py-2.5 rounded-full border border-surface-variant bg-surface-container-lowest text-on-surface-variant font-ui-label text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Left Column: Interactive Fact & Bento */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Fact of the Day Card */}
          {showFact && (
            <div className="relative overflow-hidden bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20 rounded-2xl p-8 animate-slide-up shadow-sm">
              <button 
                onClick={() => setShowFact(false)}
                className="absolute top-4 right-4 text-outline-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">lightbulb</span>
                </div>
                <div>
                  <h3 className="font-ui-header text-sm uppercase tracking-widest text-secondary font-bold mb-2">Did You Know?</h3>
                  <p className="font-h2-editorial text-2xl text-on-surface leading-tight mb-4">
                    {currentFact}
                  </p>
                  <Link to="/glossary" className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline">
                    Explore more facts <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/timeline" 
              className="group glass-card p-8 flex flex-col gap-6 hover:border-primary/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[32px]">event</span>
              </div>
              <div>
                <h3 className="font-h2-editorial text-2xl text-primary mb-2">Phase Timeline</h3>
                <p className="text-on-surface-variant font-ui-body">Track the multi-phase journey of the upcoming elections across all states.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-primary font-bold text-sm">
                View Phases <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </Link>

            <Link 
              to="/learn"
              className="group glass-card p-8 flex flex-col gap-6 hover:border-secondary/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[32px]">school</span>
              </div>
              <div>
                <h3 className="font-h2-editorial text-2xl text-secondary mb-2">Learning Hub</h3>
                <p className="text-on-surface-variant font-ui-body">Bite-sized modules explaining the architecture of Indian democracy.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-secondary font-bold text-sm">
                Start Learning <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Mini Dashboard */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-accent">verified_user</span>
              <h3 className="font-ui-header font-bold text-on-surface">Voter Checklist</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Check Eligibility', done: false, link: '/eligibility' },
                { label: 'Find Polling Station', done: false, link: '/polling' },
                { label: 'Verify Electoral Roll', done: false, link: '#' },
                { label: 'Knowledge Quiz', done: false, link: '/quiz' }
              ].map((item, i) => (
                <Link key={i} to={item.link} className="flex items-center justify-between group hover:bg-surface-container px-3 py-3 rounded-xl transition-colors">
                  <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
                  <span className="material-symbols-outlined text-[20px] text-outline-variant group-hover:text-accent transition-colors">
                    {item.done ? 'check_circle' : 'chevron_right'}
                  </span>
                </Link>
              ))}
            </div>
            <button className="w-full mt-6 bg-accent text-on-accent py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              Register Now
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-ui-header font-bold text-on-surface mb-4">Quick Resources</h3>
            <div className="flex flex-wrap gap-2">
              {['ECI Official', 'Voter Help', 'Candidates', 'Results'].map(r => (
                <span key={r} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs font-semibold text-on-surface-variant border border-surface-variant">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* Chat Response Overlay if active */}
      {(isLoading || error || response) && (
        <div className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-ai-response-title"
            className="w-full max-w-2xl max-h-[88vh] bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center gap-4 p-4 sm:p-6 border-b border-surface-variant shrink-0">
              <div className="flex items-center gap-3 text-primary">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="min-w-0">
                  <h3 id="home-ai-response-title" className="font-bold text-on-surface">ElectionEdu AI</h3>
                  <p className="text-xs text-outline-variant uppercase tracking-tighter">Verified Information</p>
                </div>
              </div>
              <button 
                onClick={() => { setResponse(null); setError(null); }}
                aria-label="Close AI response"
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
              {isLoading && (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="font-medium text-on-surface-variant animate-pulse">Scanning verified databases...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-error-container/10 border border-error/20 rounded-xl flex items-center gap-3 text-error">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-5">
                  <div className="font-body-reading text-base sm:text-lg text-on-surface leading-relaxed whitespace-pre-wrap break-words">
                    {response.reply}
                  </div>
                  
                  {response.citations && response.citations.length > 0 && (
                    <div className="pt-5 border-t border-surface-variant">
                      <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-3">Official Sources</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {response.citations.slice(0, 8).map((cite, idx) => (
                          <a key={idx} href={cite.url} target="_blank" rel="noopener noreferrer" 
                            className="min-w-0 flex items-center gap-3 p-3 rounded-xl border border-surface-variant hover:border-primary/40 hover:bg-primary/5 transition-all group">
                            <span className="material-symbols-outlined text-primary text-[20px] shrink-0">description</span>
                            <span className="min-w-0 text-sm font-medium text-on-surface-variant group-hover:text-primary truncate">{cite.title}</span>
                          </a>
                        ))}
                      </div>
                      {response.citations.length > 8 && (
                        <p className="mt-3 text-xs text-outline-variant">
                          Showing 8 of {response.citations.length} sources.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <footer className="w-full border-t border-surface-variant mt-24 py-16 px-6 bg-surface-container-lowest text-center rounded-t-[48px]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="tricolor-stripe w-24 rounded-full"></div>
          <p className="font-ui-body text-on-surface-variant max-w-2xl leading-relaxed">
            ElectionEdu is an independent educational platform. All data is synchronized with official <strong>Election Commission of India (ECI)</strong> datasets and verified civic portals.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-surface-container rounded-full text-xs font-bold text-outline-variant uppercase tracking-widest border border-surface-variant">v1.0.0 Stable</span>
            <span className="px-4 py-2 bg-surface-container rounded-full text-xs font-bold text-outline-variant uppercase tracking-widest border border-surface-variant">Sources Refreshed: Oct 2023</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
