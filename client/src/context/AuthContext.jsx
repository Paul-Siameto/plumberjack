import { createContext, useContext, useState, useEffect } from 'react'
import { api, setAuthToken } from '../utils/api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchUser() {
    try {
      const { data } = await api.get('/auth/profile')
      setUser(data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setAuthToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setAuthToken(data.token)
    setUser(data.user)
    return data
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    setAuthToken(data.token)
    setUser(data.user)
    return data
  }

  function logout() {
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  async function updateProfile(updates) {
    const { data } = await api.put('/auth/profile', updates)
    setUser(data.user)
    return data.user
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

