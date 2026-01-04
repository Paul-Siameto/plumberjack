import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500'
}

export function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`bg-white rounded-lg shadow-xl border-2 border-neutral-200 p-4 flex items-start gap-3`}
            >
              <div className={`${colors[toast.type] || colors.info} rounded-full p-1.5 flex-shrink-0`}>
                <Icon className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-neutral-600 mt-1">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-neutral-400 hover:text-neutral-700 transition"
              >
                <X size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const toasts = []
  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = { id, duration: 3000, ...toast }
    toasts.push(newToast)
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        const index = toasts.findIndex(t => t.id === id)
        if (index > -1) toasts.splice(index, 1)
      }, newToast.duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) toasts.splice(index, 1)
  }
  
  return { toasts, addToast, removeToast }
}

