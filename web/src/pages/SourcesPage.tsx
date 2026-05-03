import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SourceInfo } from '@/lib/api';
import { Shield, ExternalLink, Loader2, KeyRound } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  ok: 'bg-secondary/20 text-secondary',
  degraded: 'bg-yellow-500/20 text-yellow-700',
  down: 'bg-destructive/20 text-destructive',
  unknown: 'bg-muted text-muted-foreground',
};

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.sources()
      .then(d => setSources(d.sources))
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Shield className="w-4 h-4" aria-hidden="true" /> Transparency
        </div>
        <h1 className="text-3xl font-bold">Data Sources</h1>
        <p className="text-muted-foreground">Every piece of information is traceable to official sources</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" role="status" aria-label="Loading data sources">
          <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
        </div>
      ) : (
        <div className="space-y-3" aria-live="polite">
          {sources.map((s, i) => (
            <div key={s.name} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.purpose}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status] || STATUS_COLORS.unknown}`}>
                      {s.status}
                    </span>
                    {s.auth !== 'none' && (
                      <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        <KeyRound className="w-3 h-3" aria-hidden="true" />
                        {s.auth}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={s.base_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label={`Visit ${s.name}`}
                >
                  <ExternalLink className="w-4 h-4 text-primary" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
