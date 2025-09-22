import React from "react";
import Hero from "./components/Hero";
import TrendingGigs from "./components/TrendingGigs";
import HowItWorks from "./components/HowItWorks";
import KeyFeatures from "./components/KeyFeatures";
import QAChat from "./components/QAChat";
import Subscribe from "./components/Subscribe";

const HomePage = () => {
  return (
    <>
      <Hero />
      <TrendingGigs />
      <HowItWorks />
      <KeyFeatures />
      <QAChat />
      <Subscribe />
    </>
  );
};

export default HomePage;
