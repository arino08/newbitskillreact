import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TrendingGigs from './components/TrendingGigs'
import HowItWorks from './components/HowItWorks'
import KeyFeatures from './components/KeyFeatures'
import QAChat from './components/QAChat'
import Subscribe from './components/Subscribe'
import Footer from './components/Footer'
import './App.css'

function App() {

  return (
    <div id="main-page" className="page-container" style={{ width: '100%' }}>
      <Header />
      <Hero />
      <TrendingGigs />
      <HowItWorks />
      <KeyFeatures />
      <QAChat />
      <Subscribe />
      <Footer />
    </div>
  )
}

export default App
