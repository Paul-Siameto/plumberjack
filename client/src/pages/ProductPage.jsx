import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { ProductPageSkeleton } from '../components/LoadingSkeleton.jsx'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data.product)
      } catch (error) {
        console.error('Failed to fetch product', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function handleAddToCart() {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await addToCart(id, qty)
      showSuccess('Added to cart!', `${qty} x ${product?.name || 'item'} added successfully`)
    } catch (error) {
      showError('Failed to add to cart', error.message)
    }
  }

  if (loading) {
    return <ProductPageSkeleton />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-100 aspect-square overflow-hidden"
      >
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="heading-secondary">{product.name}</h1>
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              <span className="font-semibold text-neutral-900">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-600">({product.numReviews} reviews)</span>
            </div>
          )}
        </div>
        <div className="border-t border-b border-neutral-200 py-6">
          <div className="text-4xl font-bold text-primary mb-2">${product.price.toFixed(2)}</div>
          <div className="text-sm text-neutral-600 uppercase tracking-wide">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
        <p className="text-neutral-700 text-base leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-0 border-2 border-neutral-300 rounded overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="px-4 py-3 hover:bg-neutral-100 disabled:opacity-50 transition-colors font-semibold text-neutral-700"
            >
              <Minus size={18} />
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.min(Math.max(1, Number(e.target.value)), product.stock))}
              className="w-20 px-4 py-3 bg-white text-center border-0 border-x border-neutral-300 focus:ring-0 focus:outline-none text-base font-semibold"
            />
            <button
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              disabled={qty >= product.stock}
              className="px-4 py-3 hover:bg-neutral-100 disabled:opacity-50 transition-colors font-semibold text-neutral-700"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  )
}


