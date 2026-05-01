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
      <nav className="navbar glass-nav">
        <div className="nav-brand">
          <span className="brand-icon">🇮🇳</span>
          <h1>Bharat Voter</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <Home size={18} /> Home
            </Link>
          </li>
          <li>
            <Link to="/timeline" className={location.pathname === '/timeline' ? 'active' : ''}>
              <CalendarClock size={18} /> Timeline
            </Link>
          </li>
          <li>
            <Link to="/steps" className={location.pathname === '/steps' ? 'active' : ''}>
              <ListChecks size={18} /> Steps
            </Link>
          </li>
          <li>
            <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
              <MapPin size={18} /> Map
            </Link>
          </li>
          <li>
            <Link to="/assistant" className={location.pathname === '/assistant' ? 'active' : ''}>
              <MessageSquareText size={18} /> Assistant
            </Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
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
