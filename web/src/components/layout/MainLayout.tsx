import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: 'dashboard' },
    { to: '/learn', label: 'Ballot Guide', icon: 'how_to_vote' },
    { to: '/timeline', label: 'Election Dates', icon: 'event' },
    { to: '/glossary', label: 'Civic Library', icon: 'library_books' },
    { to: '/eligibility', label: 'My Checklist', icon: 'fact_check' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-body-reading">
      {/* TopAppBar Mobile / Desktop Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface-container-lowest border-b border-surface-variant md:hidden">
        <div className="flex items-center gap-4">
          <button 
            aria-label="Menu" 
            className="text-on-surface-variant md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-xl font-black font-h1-editorial text-primary-container">ElectionEdu</h1>
        </div>
        <div className="flex items-center gap-4 text-primary-container">
          <button aria-label="Language" className="hover:text-primary transition-colors scale-95 active:scale-90 duration-150">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button aria-label="Account" className="hover:text-primary transition-colors scale-95 active:scale-90 duration-150">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen border-r border-surface-variant w-64 bg-surface-container-lowest flex-col justify-between py-6 z-40">
        <div>
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden flex-shrink-0">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRw6ssIIsV9bkT_gVrvw7ywxEHvemBYPPC-GTe_dvwYaCOo49ICPJ-0-jyRzo3TeBui3QFehLTUE6DogKw8tnMzO4ePLXiz0FXRMoCmhlehStftkv5x6g5oF4vs64-xqtdhzsGWYyFuqqWOn8xkmsNsLnDjuqjjOEpgn_Z5CzdXJyO5VWW47KsQ55-8wketTfRBSQ1FYNP4hk_EwloIkDdGRuIHFmkjAPg5efj_OWLvaNk7li0NO2102SfksI5CBZdzhkFOne92-k"
              />
            </div>
            <div>
              <h2 className="font-ui-header text-ui-header text-on-surface">Civic Portal</h2>
              <p className="font-ui-label text-ui-label text-on-surface-variant">Voter Information</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-2 font-ui-body text-base text-on-surface-variant">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    isActive
                      ? "bg-primary-container/10 text-primary-container font-bold border-l-4 border-primary-container px-4 py-3 shadow-sm flex items-center gap-3 transition-colors"
                      : "text-on-surface-variant px-4 py-3 hover:bg-surface-container flex items-center gap-3 transition-colors"
                  }
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-6 flex flex-col gap-4">
          <button className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-ui-header text-ui-header text-center hover:bg-primary-fixed-variant transition-colors">
            Register to Vote
          </button>
          
          <div className="flex flex-col gap-1 font-ui-body text-base text-on-surface-variant">
            <a href="#" className="px-4 py-3 hover:bg-surface-container flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
            <a href="#" className="px-4 py-3 hover:bg-surface-container flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined">help</span>
              Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col md:ml-64 w-full pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen relative">
        {children}
      </main>

      {/* BottomNavBar Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-surface-variant flex justify-around items-center h-[80px] pb-safe z-40 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary-container' : 'text-on-surface-variant hover:text-primary-container'} transition-colors`}
            >
              <div className={`px-4 py-1 rounded-full mb-1 ${isActive ? 'bg-primary-container/10' : ''}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
              </div>
              <span className={`font-ui-label text-[10px] ${isActive ? 'font-semibold' : ''}`}>
                {link.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-scrim/50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 bottom-0 w-64 bg-surface-container-lowest shadow-xl flex flex-col justify-between py-6 animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
             <div>
              <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden flex-shrink-0">
                  <img 
                    alt="User Profile" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRw6ssIIsV9bkT_gVrvw7ywxEHvemBYPPC-GTe_dvwYaCOo49ICPJ-0-jyRzo3TeBui3QFehLTUE6DogKw8tnMzO4ePLXiz0FXRMoCmhlehStftkv5x6g5oF4vs64-xqtdhzsGWYyFuqqWOn8xkmsNsLnDjuqjjOEpgn_Z5CzdXJyO5VWW47KsQ55-8wketTfRBSQ1FYNP4hk_EwloIkDdGRuIHFmkjAPg5efj_OWLvaNk7li0NO2102SfksI5CBZdzhkFOne92-k"
                  />
                </div>
                <div>
                  <h2 className="font-ui-header text-ui-header text-on-surface">Civic Portal</h2>
                  <p className="font-ui-label text-ui-label text-on-surface-variant">Voter Information</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 px-2 font-ui-body text-base text-on-surface-variant">
                {navLinks.map((link) => {
                  const isActive = pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={
                        isActive
                          ? "bg-primary-container/10 text-primary-container font-bold border-l-4 border-primary-container px-4 py-3 shadow-sm flex items-center gap-3 transition-colors"
                          : "text-on-surface-variant px-4 py-3 hover:bg-surface-container flex items-center gap-3 transition-colors"
                      }
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="px-6 flex flex-col gap-4">
              <button className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-ui-header text-ui-header text-center">
                Register to Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
