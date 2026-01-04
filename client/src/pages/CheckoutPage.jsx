import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { motion } from 'framer-motion'
import { CreditCard, MapPin, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('mock')
  const [loading, setLoading] = useState(false)
  const { success: showSuccess, error: showError } = useToast()

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Please login to checkout</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Login
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  async function placeOrder() {
    if (!address.line1 || !address.city || !address.country) {
      showError('Missing information', 'Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      await api.post('/orders', {
        items,
        totalAmount: cartTotal,
        paymentMethod,
        shippingAddress: address
      })
      
      clearCart()
      showSuccess('Order placed!', 'Thank you for your purchase. We will process your order soon.')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      showError('Order failed', err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="heading-secondary mb-10">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border-2 border-neutral-200 p-8"
          >
            <h2 className="heading-tertiary mb-6 flex items-center gap-3">
              <MapPin size={24} className="text-primary" />
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
                  Street Address *
                </label>
                <input
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  required
                  className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
                  City *
                </label>
                <input
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
                    State
                  </label>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2">
                  Country *
                </label>
                <input
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                  className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-neutral-200 p-8"
          >
            <h2 className="heading-tertiary mb-6 flex items-center gap-3">
              <CreditCard size={24} className="text-primary" />
              Payment Method
            </h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-slate-300 dark:border-slate-600 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="payment"
                  value="mock"
                  checked={paymentMethod === 'mock'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Mock Payment (Testing)</span>
              </label>
              {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                <label className="flex items-center gap-3 p-3 border border-slate-300 dark:border-slate-600 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
              )}
            </div>
            {paymentMethod === 'stripe' && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Stripe payment integration ready. In production, Stripe Elements would be loaded here.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-2 border-neutral-200 p-8 h-fit sticky top-20"
        >
          <h2 className="heading-tertiary mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-neutral-700">
                <span className="font-medium">{item.name} x{item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
            <div className="flex justify-between text-neutral-700">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span className="font-medium">Shipping</span>
              <span className="font-semibold text-accent">Free</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold text-neutral-900 mb-6">
            <span>Total</span>
            <span className="text-primary">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Order...' : 'Place Order'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}


