import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      // load guest cart from localStorage
      try {
        const stored = localStorage.getItem('guest_cart')
        setItems(stored ? JSON.parse(stored) : [])
      } catch (e) {
        setItems([])
      }
    }
  }, [user])

  async function fetchCart() {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch cart', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function addToCart(productId, quantity = 1) {
    if (!user) {
      // guest cart stored in localStorage
      const existing = items.find(i => i.productId === productId)
      let updated
      if (existing) {
        updated = items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        updated = [...items, { _id: String(Date.now()), productId, quantity, price: 0 }]
      }
      setItems(updated)
      try { localStorage.setItem('guest_cart', JSON.stringify(updated)) } catch (e) {}
      return updated
    }
    const { data } = await api.post('/cart/add', { productId, quantity })
    setItems(data.items)
    return data.items
  }

  async function updateQuantity(itemId, quantity) {
    if (!user) return
    const { data } = await api.put(`/cart/update/${itemId}`, { quantity })
    setItems(data.items)
    return data.items
  }

  async function removeItem(itemId) {
    if (!user) return
    const { data } = await api.delete(`/cart/remove/${itemId}`)
    setItems(data.items)
    return data.items
  }

  async function clearCart() {
    if (!user) return
    // Remove all items one by one or implement a clear endpoint
    const promises = items.map(item => api.delete(`/cart/remove/${item._id}`))
    await Promise.all(promises)
    setItems([])
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    items,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

