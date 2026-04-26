import { Link } from 'react-router-dom';
import { Clock, BookOpen, BookMarked, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24 py-16">
      {/* Hero */}
      <section className="text-center space-y-6 animate-fade-in max-w-4xl mx-auto px-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
          Understand the election, <br className="hidden sm:block" />
          <span className="gradient-text">one question at a time.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mt-6">
          Information provided on ElectionEdu is sourced from official government publications, independent electoral commissions, and verified civic datasets. It is intended for educational purposes and does not constitute legal voting advice.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/timeline"
            className="glass-card p-8 group hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up"
            style={{ animationDelay: '0ms' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Interactive Timeline</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Track crucial dates, registration deadlines, and upcoming civic milestones in your district.
            </p>
            <div className="flex items-center gap-2 text-blue-500 font-semibold group-hover:gap-4 transition-all">
              Explore Timeline <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            to="/learn"
            className="glass-card p-8 group hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Learn Modules</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bite-sized, objective lessons on how government structures work and your role within them.
            </p>
            <div className="flex items-center gap-2 text-emerald-500 font-semibold group-hover:gap-4 transition-all">
              Start Learning <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            to="/glossary"
            className="glass-card p-8 group hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookMarked className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Civic Glossary</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Plain-language definitions for complex political jargon and procedural terminology.
            </p>
            <div className="flex items-center gap-2 text-purple-500 font-semibold group-hover:gap-4 transition-all">
              Browse Glossary <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
