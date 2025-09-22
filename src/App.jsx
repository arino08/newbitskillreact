import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import HomePage from './components/Pages/HomePage'

function App() {

  return (
    <div id="main-page" className="page-container" style={{ width: '100%' }}>
      <Header />
      <HomePage/>
      <Footer />
    </div>
  )
}

export default App
