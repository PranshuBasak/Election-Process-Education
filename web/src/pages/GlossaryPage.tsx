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
        <div className="space-y-3">
          {filtered.map((t, i) => (
            <div key={t.term} className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
              <button onClick={() => setExpanded(expanded === t.term ? null : t.term)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="font-semibold">{t.term}</span>
                <span className={`text-muted-foreground transition-transform ${expanded === t.term ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {expanded === t.term && (
                <div className="px-4 pb-4 space-y-2 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.definition_md}</p>
                  {t.source_url && (
                    <a href={t.source_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" /> {t.source_url}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No terms found</p>}
        </div>
      )}
    </div>
  );
}
