import React from "react";

const gigsData = [
  {
    icon: "💻",
    title: "E-Commerce Data Entry Clerk",
    hours: "5-10 hours/week",
    duration: "2 weeks",
    tag: "Remote",
    payment: "₹1500",
  },
  {
    icon: "📊",
    title: "Research Data Entry Support",
    hours: "5-10 hours/week",
    duration: "2 weeks",
    tag: "Mumbai",
    payment: "₹1500",
  },
  {
    icon: "📑",
    title: "Data Entry Assistant Excel",
    hours: "5-10 hours/week",
    duration: "2 weeks",
    tag: "Remote",
    payment: "₹1500",
  },
  {
    icon: "📂",
    title: "Records Management Assistant",
    hours: "6-8 hours/week",
    duration: "4 weeks",
    tag: "Work from home",
    payment: "₹2500",
  },
  {
    icon: "🌐",
    title: "Designer (Graphic, UI/UX, Product)",
    hours: "6-8 hours/week",
    duration: "4 weeks",
    tag: "Work from home",
    payment: "₹2500",
  },
  {
    icon: "🚀",
    title: "Data Entry Assistant For Startup",
    hours: "5-10 hours/week",
    duration: "2 weeks",
    tag: "Mumbai",
    payment: "₹1500",
  },
];

function TrendingGigs() {
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <h2>Trending Gigs</h2>
          <p>
            Explore short-term opportunities that fit your academic schedule.
          </p>
        </div>
        <div className="gigs-container">
          {gigsData.map((gig, idx) => (
            <div
              key={idx}
              className="gig-card"
              role="article"
              aria-label={gig.title}
            >
              <div className="gig-image">{gig.icon}</div>
              <div className="gig-content">
                <h3 className="gig-title">
                  <a href="#">{gig.title}</a>
                </h3>
                <div className="gig-details">
                  <span>{gig.hours}</span>
                  <span>{gig.duration}</span>
                </div>
                <span className="gig-tag">{gig.tag}</span>
              </div>
              <div className="gig-payment">
                <span>{gig.payment}</span>
                <button className="btn btn-primary">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingGigs;
