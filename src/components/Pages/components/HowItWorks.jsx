import React from "react";

const steps = [
  {
    number: 1,
    title: "Create Profile",
    description:
      "Students showcase skills and availability. Businesses list project requirements.",
  },
  {
    number: 2,
    title: "Find Match",
    description:
      "Search and filter based on skills, duration, payment, and location preferences.",
  },
  {
    number: 3,
    title: "Connect & Work",
    description:
      "Communicate through our platform and complete the project milestones.",
  },
  {
    number: 4,
    title: "Get Paid",
    description: "Secure milestone-based payments upon project completion.",
  },
];

function HowItWorks() {
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>
            Simple steps to connect students with businesses for
            micro-internships
          </p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
