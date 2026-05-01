import React from 'react';

const timelineData = [
  {
    id: 1,
    date: 'March 15 - April 30',
    title: 'Voter Registration Period',
    description: 'Ensure you are registered to vote. Check your local state website for specific registration deadlines.',
  },
  {
    id: 2,
    date: 'Early October',
    title: 'Mail-in Ballots Sent',
    description: 'If you requested a mail-in ballot, it will be mailed to you during this window. Fill it out carefully following instructions.',
  },
  {
    id: 3,
    date: 'Mid October - Early November',
    title: 'Early Voting Begins',
    description: 'Many states offer early in-person voting. Beat the lines and cast your ballot early at designated polling locations.',
  },
  {
    id: 4,
    date: 'First Tuesday of November',
    title: 'Election Day',
    description: 'The final day to cast your vote in person. Polls generally open early morning and close in the evening. If you are in line when polls close, stay in line!',
  },
];

function Timeline() {
  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>Election Timeline</h2>
        <p>Key dates and deadlines you need to know.</p>
      </div>
      
      <div className="timeline-container">
        <div className="timeline" role="list" aria-label="Election Timeline">
          {timelineData.map((item) => (
            <div key={item.id} className="timeline-item" role="listitem">
              <div className="timeline-marker" aria-hidden="true"></div>
              <div className="timeline-content">
                <span className="timeline-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
