import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, BookMarked, HelpCircle,
  MapPin, BrainCircuit, Shield, ArrowRight, Vote
} from 'lucide-react';

const FEATURES = [
  { to: '/learn', icon: BookOpen, title: 'Learn', desc: 'Step-by-step guides on voting, registration & EVMs', color: 'bg-primary/10 text-primary' },
  { to: '/timeline', icon: Clock, title: 'Election Timeline', desc: 'Key phases from announcement to results', color: 'bg-secondary/10 text-secondary' },
  { to: '/glossary', icon: BookMarked, title: 'Glossary', desc: 'EVM, VVPAT, NOTA — all terms explained', color: 'bg-accent/10 text-accent' },
  { to: '/eligibility', icon: HelpCircle, title: 'Am I Eligible?', desc: 'Check if you can vote + how to register', color: 'bg-primary/10 text-primary' },
  { to: '/polling', icon: MapPin, title: 'Find Polling Station', desc: 'Locate your booth using EPIC or address', color: 'bg-secondary/10 text-secondary' },
  { to: '/quiz', icon: BrainCircuit, title: 'Quiz Challenge', desc: 'Test your election knowledge', color: 'bg-accent/10 text-accent' },
  { to: '/sources', icon: Shield, title: 'Data Sources', desc: 'Full transparency on where our data comes from', color: 'bg-primary/10 text-primary' },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Vote className="w-4 h-4" />
          AI-Powered Election Education
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="gradient-text">Know Your Vote.</span>
          <br />
          <span className="text-foreground">Shape Your Future.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Everything you need to know about Indian elections — from registration to results.
          Powered by AI, grounded in official ECI data.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/eligibility"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            Check Eligibility
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="glass-card p-6 group hover:shadow-lg transition-all hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '96.8 Cr', label: 'Registered Voters' },
              { value: '543', label: 'Lok Sabha Seats' },
              { value: '10.5L', label: 'Polling Stations' },
              { value: '1952', label: 'First General Election' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-3 pb-8">
        <div className="tricolor-stripe max-w-xs mx-auto rounded-full" />
        <p className="text-sm text-muted-foreground">
          Built with ❤️ for Indian Democracy · Not affiliated with ECI
        </p>
        <p className="text-xs text-muted-foreground/70">
          Data sourced from ECI, data.gov.in, LokDhaba & Wikipedia
        </p>
      </footer>
    </div>
  );
}
