import React from 'react';

const features = [
  { icon: '📋', title: 'Micro-Gig Listings', description: 'Short-term projects tailored to fit student schedules and academic commitments.' },
  { icon: '🎯', title: 'Student Skill Profiles', description: 'Showcase academic background, skills, and availability to potential employers.' },
  { icon: '💬', title: 'Communication Hub', description: 'In-platform messaging for seamless project discussions and updates.' },
  { icon: '💰', title: 'Milestone Payments', description: 'Secure payment system that releases funds upon completion of project milestones.' },
  { icon: '⭐', title: 'Rating System', description: 'Build credibility through feedback from completed projects.' },
  { icon: '📊', title: 'Dashboard Tracking', description: 'Monitor applications, earnings, and ongoing projects in one place.' },
];

function KeyFeatures() {
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <h2>Key Features</h2>
          <p>Designed specifically for students and businesses in Mumbai</p>
        </div>
        <div className="features">
          {features.map((f, idx) => (
            <div key={idx} className="feature">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyFeatures;
