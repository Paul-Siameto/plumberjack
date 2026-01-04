import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      showError('Password mismatch', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      showError('Invalid password', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password)
      showSuccess('Account created!', 'Welcome to AquaMart. Your account has been created successfully.')
      navigate('/')
    } catch (err) {
      showError('Registration failed', err.response?.data?.message || 'Unable to create account. Please try again.')
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
            <h1 className="heading-secondary mb-3">Create Account</h1>
            <p className="text-neutral-600">Join AquaMart today</p>
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
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
              minLength={6}
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

