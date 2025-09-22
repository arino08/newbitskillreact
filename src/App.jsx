import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import HomePage from './components/Pages/HomePage'
import LoginPage from './components/Pages/LoginPage'
import SignupPage from './components/Pages/SignupPage'

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
  const displayNavLinks = isAuthRoute ? false : true;

  return (
    <div id="main-page" className="page-container" style={{ width: '100%' }}>
  {!isAuthRoute && <Header displayNavLinks={displayNavLinks} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
  {!isAuthRoute && <Footer />}
    </div>
  )
}

export default App
