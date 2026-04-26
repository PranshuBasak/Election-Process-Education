import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, Clock, BookMarked, HelpCircle,
  MapPin, BrainCircuit, Shield, Menu, X, MessageCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/glossary', label: 'Glossary', icon: BookMarked },
  { to: '/eligibility', label: 'Am I Eligible?', icon: HelpCircle },
  { to: '/polling', label: 'Polling Station', icon: MapPin },
  { to: '/quiz', label: 'Quiz', icon: BrainCircuit },
  { to: '/sources', label: 'Sources', icon: Shield },
];

interface NavbarProps {
  onChatToggle: () => void;
}

export function Navbar({ onChatToggle }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="tricolor-stripe" />
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🗳️</span>
            <span className="font-bold text-lg tracking-tight hidden sm:inline gradient-text">
              Election Edu
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Chat FAB */}
            <button
              onClick={onChatToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              aria-label="Open AI Chat"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-72 bg-card shadow-2xl p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1 mt-12">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
