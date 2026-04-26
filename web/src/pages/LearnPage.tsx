import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { LearnModule } from '@/lib/api';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';

export default function LearnPage() {
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.learnModules().then(setModules).catch(() => setModules([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <BookOpen className="w-4 h-4" />
          Learn
        </div>
        <h1 className="text-3xl font-bold">Election Education Modules</h1>
        <p className="text-muted-foreground">Step-by-step guides to understanding Indian elections</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((m, i) => (
            <Link key={m.slug} to={`/learn/${m.slug}`}
              className="glass-card p-6 group hover:shadow-lg transition-all hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.summary}</p>
              <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
                Start Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
