import React from 'react';

const stepsData = [
  {
    id: 1,
    title: 'Register to Vote',
    description: 'The first step is ensuring you are registered. You can register online, by mail, or in person. Check your state requirements for necessary identification.',
  },
  {
    id: 2,
    title: 'Research the Candidates',
    description: 'Learn about the candidates and ballot measures. Look at their platforms, past voting records, and debate performances to make an informed decision.',
  },
  {
    id: 3,
    title: 'Find Your Polling Place',
    description: 'Double-check your polling location before Election Day. Your designated location can change, so always verify it through your local election office website.',
  },
  {
    id: 4,
    title: 'Cast Your Ballot',
    description: 'Bring required ID if your state mandates it. Follow the instructions on the voting machine or paper ballot. Remember, every vote counts!',
  },
];

function VotingSteps() {
  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>Step-by-Step Voting Guide</h2>
        <p>Everything you need to do to make your voice heard.</p>
      </div>

      <div className="steps-container">
        <div className="steps-grid">
          {stepsData.map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-number">{step.id}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
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
