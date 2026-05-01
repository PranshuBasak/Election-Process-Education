import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { LearnModule } from '@/lib/api';
import { useUser } from '@/lib/user';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function LearnDetailPage() {
  const { userId } = useUser();
  const { slug } = useParams<{ slug: string }>();
  const [mod, setMod] = useState<LearnModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setSetDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (slug) api.learnModule(slug).then(setMod).catch(() => setMod(null)).finally(() => setLoading(false));
  }, [slug]);

  const toggle = async (order: number) => {
    const isAdding = !done.has(order);
    setSetDone(prev => {
      const n = new Set(prev);
      if (n.has(order)) n.delete(order);
      else n.add(order);
      return n;
    });

    if (userId && mod && isAdding) {
      try {
        await api.saveProgress(userId, {
          module_slug: slug,
          step_order: order,
          last_activity: 'learn',
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-pulse">
      <div className="w-32 h-4 bg-muted rounded mb-8" />
      <div className="space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full" />
        <div className="w-1/2 h-8 bg-muted rounded" />
        <div className="w-full h-4 bg-muted rounded" />
      </div>
      <div className="space-y-6 pt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-6 h-32" />
        ))}
      </div>
    </div>
  );
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

      <div className="space-y-6">
        {mod.steps?.map((step, i) => (
          <div key={step.order} className={`glass-card p-6 animate-slide-up transition-all duration-300 border ${done.has(step.order) ? 'border-primary/30 bg-primary/5 shadow-md' : 'border-transparent hover:border-border hover:shadow-lg'}`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-5">
              <button onClick={() => toggle(step.order)}
                className={`mt-1 shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 hover:scale-110 shadow-sm ${done.has(step.order) ? 'bg-primary text-primary-foreground shadow-primary/25' : 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30'}`}>
                {done.has(step.order) ? <CheckCircle2 className="w-6 h-6" /> : step.order}
              </button>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className={`font-bold text-xl transition-colors ${done.has(step.order) ? 'text-primary' : 'text-foreground'}`}>{step.title}</h3>
                  {step.who && <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full">{step.who}</span>}
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">{step.description_md}</p>
                {step.source_url && (
                  <div className="pt-2">
                    <a href={step.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Additional Resource
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
