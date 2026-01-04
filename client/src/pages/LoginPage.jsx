import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const nextPath = params.get('next') || '/'

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(email, password)
      showSuccess('Welcome back!', 'You have successfully logged in')
      navigate(nextPath)
    } catch (err) {
      showError('Login failed', err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form onSubmit={submit} className="bg-white border-2 border-neutral-200 p-10 space-y-6 max-w-md">
          <div className="text-center mb-8">
            <h1 className="heading-secondary mb-3">Welcome Back</h1>
            <p className="text-neutral-600">Sign in to your account</p>
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-semibold">
              Create Account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}


