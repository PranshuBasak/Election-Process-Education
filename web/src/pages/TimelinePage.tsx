import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { TimelineItem } from '@/lib/api';
import { Clock, ExternalLink, Loader2 } from 'lucide-react';

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.timeline().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
          <Clock className="w-4 h-4" />
          Election Phases
        </div>
        <h1 className="text-3xl font-bold">Election Timeline</h1>
        <p className="text-muted-foreground">Key phases of the Indian election process</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative pl-16 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-primary bg-card" />

                <div className="glass-card p-5 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg">{item.phase}</h3>
                    {(item.start || item.end) && (
                      <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-1 rounded">
                        {item.start}{item.end ? ` – ${item.end}` : ''}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  )}
                  {item.source_url && (
                    <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
