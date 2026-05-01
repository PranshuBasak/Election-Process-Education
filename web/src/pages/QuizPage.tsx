import { useState } from 'react';
import { api } from '@/lib/api';
import type { QuizQuestion } from '@/lib/api';
import { useUser } from '@/lib/user';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';

const TOPICS = ['General Elections', 'Voter Registration', 'EVM & VVPAT', 'Election Commission', 'Indian Constitution'];

export default function QuizPage() {
  const { userId } = useUser();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.quiz(topic);
      setQuestions(res.questions);
      setCurrent(0); setScore(0); setSelected(null); setFinished(false); setStarted(true);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const saveResults = async (finalScore: number) => {
    if (!userId) return;
    try {
      await api.saveProgress(userId, {
        quiz_topic: topic,
        quiz_score: finalScore,
        quiz_total: questions.length,
        last_activity: 'quiz',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const answer = (label: string) => {
    if (selected) return;
    setSelected(label);
    if (label === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      saveResults(score + (selected === questions[current].correct ? 0 : 0)); // Score is already updated in answer()
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null);
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <BrainCircuit className="w-4 h-4" /> Quiz
          </div>
          <h1 className="text-3xl font-bold">Test Your Knowledge</h1>
          <p className="text-muted-foreground">AI-generated quiz on Indian elections</p>
        </div>
        <div className="glass-card p-6 space-y-4 animate-slide-up">
          <label className="text-sm font-medium">Choose a Topic</label>
          <div className="grid grid-cols-2 gap-2">
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${topic === t ? 'bg-primary text-primary-foreground shadow' : 'bg-muted hover:bg-muted/80'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={startQuiz} disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Start Quiz</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="glass-card p-8 text-center space-y-4 animate-slide-up">
          <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <p className="text-4xl font-extrabold gradient-text">{score}/{questions.length}</p>
          <p className="text-muted-foreground">{pct >= 80 ? 'Excellent! You know your elections!' : pct >= 50 ? 'Good effort! Keep learning.' : 'Keep studying — check our Learn modules!'}</p>
          <button onClick={() => { setStarted(false); setQuestions([]); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {current + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="glass-card p-6 space-y-5 animate-fade-in">
        <h2 className="text-lg font-semibold">{q.question}</h2>
        <div className="space-y-2">
          {q.options.map(o => {
            let cls = 'bg-muted hover:bg-muted/80';
            if (selected) {
              if (o.label === q.correct) cls = 'bg-secondary/20 border-secondary text-secondary-foreground';
              else if (o.label === selected) cls = 'bg-destructive/20 border-destructive';
            }
            return (
              <button key={o.label} onClick={() => answer(o.label)} disabled={!!selected}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all ${cls}`}>
                <span className="font-bold mr-2">{o.label}.</span>{o.text}
                {selected && o.label === q.correct && <CheckCircle2 className="inline w-4 h-4 ml-2 text-secondary" />}
                {selected && o.label === selected && o.label !== q.correct && <XCircle className="inline w-4 h-4 ml-2 text-destructive" />}
              </button>
            );
          })}
        </div>
        {selected && q.explanation && <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{q.explanation}</p>}
        {selected && (
          <button onClick={next} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
