import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatDrawer } from './components/ChatDrawer';
import { MainLayout } from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import LearnDetailPage from './pages/LearnDetailPage';
import TimelinePage from './pages/TimelinePage';
import GlossaryPage from './pages/GlossaryPage';
import EligibilityPage from './pages/EligibilityPage';
import PollingStationPage from './pages/PollingStationPage';
import QuizPage from './pages/QuizPage';
import SourcesPage from './pages/SourcesPage';

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:slug" element={<LearnDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/polling" element={<PollingStationPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/sources" element={<SourcesPage />} />
        </Routes>
        
        {/* Chat FAB */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40"
          aria-label="Open AI Chat"
        >
          <span className="material-symbols-outlined">chat</span>
        </button>

        <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
