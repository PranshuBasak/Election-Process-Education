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
        <div className="relative mt-12 pb-8">
          {/* Vertical line with gradient */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent rounded-full" />

          <div className="space-y-8">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative pl-16 group animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Glowing Dot */}
                <div className="absolute left-[18px] top-6 w-5 h-5 rounded-full border-4 border-primary bg-background shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-transform duration-300 group-hover:scale-125 group-hover:bg-primary" />

                {/* Content Card */}
                <div className="glass-card p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-card/60">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{item.phase}</h3>
                    {(item.start || item.end) && (
                      <span className="text-xs font-semibold text-primary/80 shrink-0 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        {item.start}{item.end ? ` – ${item.end}` : ''}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  )}
                  {item.source_url && (
                    <div className="pt-2">
                      <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Official Source
                      </a>
                    </div>
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
