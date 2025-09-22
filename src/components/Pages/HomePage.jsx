import React from "react";
import Hero from "./components/Hero";
import TrendingGigs from "./components/TrendingGigs";
import HowItWorks from "./components/HowItWorks";
import KeyFeatures from "./components/KeyFeatures";
import QAChat from "./components/QAChat";
import Subscribe from "./components/Subscribe";

const HomePage = () => {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>
      <section id="trending-gigs">
        <TrendingGigs />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="key-features">
        <KeyFeatures />
      </section>
      <section id="qa-chat">
        <QAChat />
      </section>
      <section id="subscribe">
        <Subscribe />
      </section>
    </main>
  );
};

export default HomePage;
