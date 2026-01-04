import { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '../components/Toast.jsx'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = { id, duration: 4000, ...toast }
    setToasts((prev) => [...prev, newToast])

    if (newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((title, message) => addToast({ type: 'success', title, message }), [addToast])
  const error = useCallback((title, message) => addToast({ type: 'error', title, message }), [addToast])
  const info = useCallback((title, message) => addToast({ type: 'info', title, message }), [addToast])
  const warning = useCallback((title, message) => addToast({ type: 'warning', title, message }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

