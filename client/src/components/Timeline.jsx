import React from 'react';

const timelineData = [
  {
    id: 1,
    date: 'March 15 - April 30',
    title: 'Voter Registration Period',
    description: 'Ensure you are registered to vote. Check your local state website for specific registration deadlines.',
    calDates: '20260315T000000Z/20260430T235959Z'
  },
  {
    id: 2,
    date: 'Early October',
    title: 'Mail-in Ballots Sent',
    description: 'If you requested a mail-in ballot, it will be mailed to you during this window. Fill it out carefully following instructions.',
    calDates: '20261001T000000Z/20261015T235959Z'
  },
  {
    id: 3,
    date: 'Mid October - Early November',
    title: 'Early Voting Begins',
    description: 'Many states offer early in-person voting. Beat the lines and cast your ballot early at designated polling locations.',
    calDates: '20261015T000000Z/20261101T235959Z'
  },
  {
    id: 4,
    date: 'First Tuesday of November',
    title: 'Election Day',
    description: 'The final day to cast your vote in person. Polls generally open early morning and close in the evening. If you are in line when polls close, stay in line!',
    calDates: '20261103T080000Z/20261103T200000Z'
  },
];

const generateGoogleCalendarUrl = (title, description, dates) => {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('details', description);
  url.searchParams.append('dates', dates);
  return url.toString();
};

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  <a 
                    href={generateGoogleCalendarUrl(item.title, item.description, item.calDates)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn secondary-btn"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}
                  >
                    📅 Add to Calendar
                  </a>
                </div>
                <p style={{ marginTop: '0.5rem' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
