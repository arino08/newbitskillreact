import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import HomePage from './components/Pages/HomePage'
import LoginPage from './components/Pages/LoginPage'
import SignupPage from './components/Pages/SignupPage'

function App() {

  return (
    <div id="main-page" className="page-container" style={{ width: '100%' }}>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      <Footer />
    </div>
  )
}

export default App
