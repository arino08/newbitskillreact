import React from "react";
import Hero from "./components/Hero";
import TrendingGigs from "./components/TrendingGigs";
import HowItWorks from "./components/HowItWorks";
import KeyFeatures from "./components/KeyFeatures";
import QAChat from "./components/QAChat";
import Subscribe from "./components/Subscribe";
import AnimateOnScroll from "../AnimateOnScroll";

const HomePage = () => {
  return (
    <main>
      <section id="hero">
        <AnimateOnScroll variant="zoom-in">
          <Hero />
        </AnimateOnScroll>
      </section>
      <section id="trending-gigs">
        <AnimateOnScroll variant="fade-up" delay={80}>
          <TrendingGigs />
        </AnimateOnScroll>
      </section>
      <section id="how-it-works">
        <AnimateOnScroll variant="fade-up" delay={120}>
          <HowItWorks />
        </AnimateOnScroll>
      </section>
      <section id="key-features">
        <AnimateOnScroll variant="fade-up" delay={160}>
          <KeyFeatures />
        </AnimateOnScroll>
      </section>
      <section id="qa-chat">
        <AnimateOnScroll variant="fade-up" delay={180}>
          <QAChat />
        </AnimateOnScroll>
      </section>
      <section id="subscribe">
        <AnimateOnScroll variant="fade-up" delay={200}>
          <Subscribe />
        </AnimateOnScroll>
      </section>
    </main>
  );
};

export default HomePage;
