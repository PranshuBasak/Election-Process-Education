import { useState } from 'react';
import { api } from '@/lib/api';
import type { EligibilityResult } from '@/lib/api';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function EligibilityPage() {
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [hasEpic, setHasEpic] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    const a = parseInt(age);
    if (isNaN(a) || a < 1 || a > 150) return;
    setLoading(true);
    try {
      const r = await api.eligibility(a, nationality, hasEpic);
      setResult(r);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
          Eligibility Check
        </div>
        <h1 className="text-3xl font-bold">Am I Eligible to Vote?</h1>
        <p className="text-muted-foreground">Quick check based on ECI guidelines</p>
      </div>

      <div className="glass-card p-6 space-y-5 animate-slide-up">
        <div className="space-y-2">
          <label htmlFor="eligibility-age" className="text-sm font-medium">Your Age</label>
          <input
            id="eligibility-age"
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            min="1"
            max="150"
            placeholder="e.g. 21"
            className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="eligibility-nationality" className="text-sm font-medium">Nationality</label>
          <select
            id="eligibility-nationality"
            value={nationality}
            onChange={e => setNationality(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="epic"
            checked={hasEpic}
            onChange={e => setHasEpic(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <label htmlFor="epic" className="text-sm">I have a Voter ID (EPIC) card</label>
        </div>

        <button
          type="button"
          onClick={check}
          disabled={loading || !age}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Checking eligibility</span>
            </>
          ) : (
            <>
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className={`glass-card p-6 animate-slide-up ${result.eligible ? 'border-secondary/50' : 'border-destructive/50'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.eligible ? (
                <CheckCircle2 className="w-8 h-8 text-secondary" aria-hidden="true" />
              ) : (
                <XCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
              )}
              <h3 className="text-xl font-bold">{result.eligible ? 'You are Eligible' : 'Not Eligible'}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{result.reason}</p>
            {result.next_steps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Next Steps:</h4>
                <ul className="space-y-1.5">
                  {result.next_steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5" aria-hidden="true">-</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
