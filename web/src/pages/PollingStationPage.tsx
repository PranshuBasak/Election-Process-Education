import { useState } from 'react';
import { MapPin, Search, ExternalLink } from 'lucide-react';

export default function PollingStationPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ message?: string; source_url?: string } | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/polling?q=${encodeURIComponent(query)}`);
      setResult(await res.json());
    } catch {
      setResult({ message: 'Unable to search. Please visit https://voters.eci.gov.in directly.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
          <MapPin className="w-4 h-4" /> Find Your Booth
        </div>
        <h1 className="text-3xl font-bold">Polling Station Lookup</h1>
        <p className="text-muted-foreground">Find where you need to go on election day</p>
      </div>

      <div className="glass-card p-6 space-y-4 animate-slide-up">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Enter your EPIC number or address..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button onClick={search}
          className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors">
          Search Polling Station
        </button>
      </div>

      {result && (
        <div className="glass-card p-6 animate-slide-up space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{result.message}</p>
          {result.source_url && (
            <a href={result.source_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
              <ExternalLink className="w-4 h-4" /> Visit Official Portal
            </a>
          )}
        </div>
      )}

      <div className="glass-card p-6 space-y-3">
        <h3 className="font-semibold">Other Ways to Find Your Booth</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary">1.</span> Download the <strong>Voter Helpline</strong> app (Android / iOS)</li>
          <li className="flex items-start gap-2"><span className="text-primary">2.</span> SMS your EPIC number to <strong>1950</strong></li>
          <li className="flex items-start gap-2"><span className="text-primary">3.</span> Call the ECI helpline: <strong>1800-111-950</strong> (toll-free)</li>
        </ul>
      </div>
    </div>
  );
}
