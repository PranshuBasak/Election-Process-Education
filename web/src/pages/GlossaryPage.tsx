import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { GlossaryTerm } from '@/lib/api';
import { BookMarked, Search, ExternalLink, Loader2 } from 'lucide-react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.glossary().then(setTerms).catch(() => setTerms([])).finally(() => setLoading(false));
  }, []);

  const filtered = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition_md.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
          <BookMarked className="w-4 h-4" />
          Reference
        </div>
        <h1 className="text-3xl font-bold">Election Glossary</h1>
        <p className="text-muted-foreground">Definitions of key Indian election terms</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search terms..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t, i) => (
            <div key={t.term} className={`glass-card overflow-hidden animate-slide-up transition-all duration-300 border ${expanded === t.term ? 'border-primary/30 shadow-md bg-card/80' : 'border-transparent hover:border-border'}`} style={{ animationDelay: `${i * 40}ms` }}>
              <button onClick={() => setExpanded(expanded === t.term ? null : t.term)}
                className="w-full text-left px-5 py-4 flex items-center justify-between transition-colors hover:bg-muted/30 focus:outline-none">
                <span className={`font-semibold text-lg transition-colors ${expanded === t.term ? 'text-primary' : 'text-foreground'}`}>{t.term}</span>
                <span className={`text-muted-foreground transition-transform duration-300 bg-muted p-1 rounded-full ${expanded === t.term ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </span>
              </button>
              
              <div className={`grid transition-all duration-300 ease-in-out ${expanded === t.term ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 space-y-3">
                    <p className="text-base text-muted-foreground leading-relaxed">{t.definition_md}</p>
                    {t.source_url && (
                      <div className="pt-2">
                        <a href={t.source_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> Reference Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center space-y-3 py-12 glass-card border-dashed">
              <Search className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">No terms found matching "{search}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
