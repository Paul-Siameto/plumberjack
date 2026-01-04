import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { motion } from 'framer-motion'
import { User, LogOut, Save } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const { success: showSuccess, error: showError } = useToast()

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({ name })
      showSuccess('Profile updated!', 'Your profile has been successfully updated')
    } catch (error) {
      showError('Update failed', error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to view your profile</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="heading-secondary mb-8">My Profile</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-neutral-200 p-10 space-y-8"
      >
        <div className="flex items-center gap-6 pb-8 border-b-2 border-neutral-200">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={48} className="text-primary" />
          </div>
          <div>
            <h2 className="heading-tertiary">{user.name}</h2>
            <p className="text-neutral-600 mb-3">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wide">
                Administrator
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-neutral-100 text-neutral-500 cursor-not-allowed text-base"
            />
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">Email cannot be changed</p>
          </div>

          <div className="flex gap-4 pt-6 border-t border-neutral-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={handleLogout}
              className="btn-secondary border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


