import { UserCheck, Search, MapPin, Vote } from 'lucide-react';

const stepsData = [
  {
    id: 1,
    title: 'Register to Vote',
    icon: <UserCheck size={32} />,
    description: 'Ensure you are registered in the electoral roll. You can register online via the NVSP portal or at your local BLO office.',
  },
  {
    id: 2,
    title: 'Research the Candidates',
    icon: <Search size={32} />,
    description: 'Use the KYC app to see criminal antecedents, assets, and liabilities of candidates in your constituency.',
  },
  {
    id: 3,
    title: 'Find Your Polling Place',
    icon: <MapPin size={32} />,
    description: 'Locate your designated polling booth using our interactive map or the ECI voter search portal.',
  },
  {
    id: 4,
    title: 'Cast Your Ballot',
    icon: <Vote size={32} />,
    description: 'Visit the booth with a valid ID (Voter ID, Aadhar, etc.) and cast your vote on the EVM/VVPAT machine.',
  },
];

function VotingSteps() {
  return (
    <div className="fade-in">
      <div className="section-header">
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Voting Guide</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Follow these simple steps to exercise your democratic right.</p>
      </div>

      <div className="steps-container">
        <div className="steps-grid">
          {stepsData.map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-number">{step.id}</div>
              <div className="step-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ color: 'var(--saffron)' }}>{step.icon}</div>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VotingSteps;
