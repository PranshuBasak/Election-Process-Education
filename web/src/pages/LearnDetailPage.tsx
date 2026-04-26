import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { LearnModule } from '@/lib/api';
import { ArrowLeft, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

export default function LearnDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mod, setMod] = useState<LearnModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (slug) api.learnModule(slug).then(setMod).catch(() => setMod(null)).finally(() => setLoading(false));
  }, [slug]);

  const toggle = (order: number) => {
    setDone(prev => { const n = new Set(prev); n.has(order) ? n.delete(order) : n.add(order); return n; });
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!mod) return <div className="text-center py-16"><p>Module not found</p><Link to="/learn" className="text-primary hover:underline mt-4 inline-block">← Back to Learn</Link></div>;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Modules
      </Link>

      <div className="animate-fade-in space-y-2">
        <span className="text-4xl">{mod.icon}</span>
        <h1 className="text-3xl font-bold">{mod.title}</h1>
        <p className="text-muted-foreground">{mod.summary}</p>
      </div>

      <div className="space-y-4">
        {mod.steps?.map((step, i) => (
          <div key={step.order} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-4">
              <button onClick={() => toggle(step.order)}
                className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${done.has(step.order) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
                {done.has(step.order) ? <CheckCircle2 className="w-5 h-5" /> : step.order}
              </button>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{step.title}</h3>
                {step.who && <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{step.who}</span>}
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description_md}</p>
                {step.source_url && (
                  <a href={step.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="w-3 h-3" /> Source
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
