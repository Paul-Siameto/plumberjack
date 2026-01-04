import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Plus } from 'lucide-react'  // Added Plus for potential variants

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link
        to={`/product/${product._id}`}
        className="group block h-full product-card relative"
      >
        {/* New: Discount badge placeholder */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}

        <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <ShoppingCart size={40} />
            </div>
          )}

          {/* Rating badge */}
          {product.rating > 0 && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 flex items-center gap-1 text-sm font-bold shadow-md rounded-full">
              <Star className="fill-yellow-400 text-yellow-400" size={14} />
              {product.rating.toFixed(1)}
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="bg-neutral-900 text-white px-6 py-3 text-base font-bold uppercase tracking-wide rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-bold text-lg text-neutral-900 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold text-[var(--primary)]">
                ${product.price?.toFixed?.(2) ?? product.price}
              </div>
              {/* Original price if discounted */}
              {product.originalPrice && (
                <del className="text-sm text-neutral-500 ml-2">${product.originalPrice}</del>
              )}
            </div>

            {product.stock > 0 && (
              <div className="text-sm text-neutral-600 uppercase tracking-wide">
                {product.stock} in stock
              </div>
            )}
          </div>

          {/* New: Hover Add to Cart button */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 left-4 right-4">
            <button className="btn-accent w-full flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}