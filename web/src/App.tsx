import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ChatDrawer } from './components/ChatDrawer';
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
      <div className="min-h-screen bg-background">
        <Navbar onChatToggle={() => setChatOpen(true)} />
        <main className="max-w-7xl mx-auto px-4">
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
        </main>
        <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
