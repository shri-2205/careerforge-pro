import React, { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
