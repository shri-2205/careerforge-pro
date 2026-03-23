import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BuilderPage from './pages/BuilderPage'
import ProfilePage from './pages/ProfilePage'
import TemplatesPage from './pages/TemplatesPage'
import PricingPage from './pages/PricingPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPage from './pages/InterviewPage'


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
      <Route path="/builder/:id" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
      <Route path="/cover-letter" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
