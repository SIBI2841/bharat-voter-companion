import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, CalendarClock, ListChecks, MessageSquareText, MapPin } from 'lucide-react';
import Timeline from './components/Timeline';
import VotingSteps from './components/VotingSteps';
import AssistantChat from './components/AssistantChat';
import PollingBoothMap from './components/PollingBoothMap';

function App() {
  const location = useLocation();

  return (
    <div className="app-container premium-glass">
      <nav className="navbar glass-nav" aria-label="Main Navigation">
        <div className="nav-brand" role="img" aria-label="Bharat Voter Logo">
          <span className="brand-icon" aria-hidden="true">🇮🇳</span>
          <h1>Bharat Voter</h1>
        </div>
        <ul className="nav-links" role="menubar">
          <li role="none">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} role="menuitem" aria-label="Go to Home">
              <Home size={18} aria-hidden="true" /> Home
            </Link>
          </li>
          <li role="none">
            <Link to="/timeline" className={location.pathname === '/timeline' ? 'active' : ''} role="menuitem" aria-label="View Election Timeline">
              <CalendarClock size={18} aria-hidden="true" /> Timeline
            </Link>
          </li>
          <li role="none">
            <Link to="/steps" className={location.pathname === '/steps' ? 'active' : ''} role="menuitem" aria-label="View Voting Steps">
              <ListChecks size={18} aria-hidden="true" /> Steps
            </Link>
          </li>
          <li role="none">
            <Link to="/map" className={location.pathname === '/map' ? 'active' : ''} role="menuitem" aria-label="Locate Polling Booth">
              <MapPin size={18} aria-hidden="true" /> Map
            </Link>
          </li>
          <li role="none">
            <Link to="/assistant" className={location.pathname === '/assistant' ? 'active' : ''} role="menuitem" aria-label="Talk to AI Assistant">
              <MessageSquareText size={18} aria-hidden="true" /> Assistant
            </Link>
          </li>
        </ul>
      </nav>

      <main className="main-content" id="main-content" role="main">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/steps" element={<VotingSteps />} />
          <Route path="/map" element={<PollingBoothMap />} />
          <Route path="/assistant" element={<AssistantChat />} />
        </Routes>
      </main>
    </div>
  );
}

function HomeView() {
  return (
    <div className="home-view fade-in">
      <div className="hero glass-panel">
        <h2>Your Voice, Your Power</h2>
        <p>Welcome to the ultimate guide for understanding the Indian election process. Navigate through timelines, discover step-by-step voting instructions, locate booths, or ask our intelligent assistant.</p>
        <div className="hero-buttons">
          <Link to="/steps" className="btn primary-btn">Get Started</Link>
          <Link to="/assistant" className="btn secondary-btn">Ask Assistant</Link>
        </div>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><CalendarClock size={32} /></div>
          <h3>Election Timeline</h3>
          <p>Stay up to date with important deadlines, registration dates, and election days.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><ListChecks size={32} /></div>
          <h3>Voting Steps</h3>
          <p>A simple, clear guide on how to register, find your polling place, and cast your vote.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><MessageSquareText size={32} /></div>
          <h3>Interactive Assistant</h3>
          <p>Have a question? Our smart assistant is here to provide accurate and quick answers.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
