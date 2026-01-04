import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { CartItemSkeleton } from '../components/LoadingSkeleton.jsx'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { items, loading, cartTotal, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <ShoppingBag className="mx-auto text-slate-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Please login to view your cart</p>
        <Link to="/login" className="btn-primary inline-block">Login</Link>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="heading-secondary mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border-2 border-dashed border-neutral-300 bg-neutral-50"
        >
          <ShoppingBag className="mx-auto text-neutral-400 mb-4" size={64} />
          <p className="text-lg font-semibold text-neutral-700 mb-2">Your cart is empty</p>
          <p className="text-neutral-600 mb-6">Start adding items to your cart</p>
          <Link to="/" className="btn-primary inline-block">Continue Shopping</Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 border border-neutral-200 bg-white p-6"
              >
                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg text-neutral-900 mb-2">{item.name}</div>
                  <div className="text-base text-neutral-600 font-medium mb-3">
                    ${item.price.toFixed(2)} each
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-neutral-700">Quantity:</span>
                    <div className="flex items-center gap-0 border-2 border-neutral-300 rounded overflow-hidden">
                      <button
                        onClick={() => {
                          const newQty = item.quantity - 1
                          if (newQty >= 1) {
                            updateQuantity(item._id, newQty)
                            showSuccess('Cart updated')
                          }
                        }}
                        className="px-3 py-2 hover:bg-neutral-100 transition-colors font-semibold text-neutral-700"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value))
                          updateQuantity(item._id, val)
                        }}
                        className="w-16 px-3 py-2 bg-white text-center border-0 border-x-2 border-neutral-300 focus:ring-0 focus:outline-none text-sm font-semibold"
                      />
                      <button
                        onClick={() => {
                          updateQuantity(item._id, item.quantity + 1)
                          showSuccess('Cart updated')
                        }}
                        className="px-3 py-2 hover:bg-neutral-100 transition-colors font-semibold text-neutral-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeItem(item._id)
                    showSuccess('Item removed', `${item.name} removed from cart`)
                  }}
                  className="text-red-600 hover:text-red-700 p-3 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="border-2 border-neutral-200 bg-white p-6 h-fit sticky top-20">
            <div className="font-bold text-lg uppercase tracking-wide text-neutral-900 mb-6">Order Summary</div>
            <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
              <div className="flex justify-between text-neutral-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span className="font-medium">Shipping</span>
                <span className="font-semibold text-accent">Free</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xl font-bold text-neutral-900">
                <span>Total</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-primary w-full inline-block text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}


