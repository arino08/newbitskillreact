import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Connect. Learn. Earn.</h1>
        <p>
          Bitskill bridges the gap between Mumbai University students and local businesses through micro-internships and gig opportunities.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Find Gigs</button>
          <button className="btn btn-outline">Post a Project</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
