import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import AppRoutes from './Routes/AppRoutes'

function App() {

  return (
    <div id="main-page" className="page-container" style={{ width: '100%' }}>
      <Header/>
        <AppRoutes/>
      <Footer/>
    </div>
  )
}

export default App
