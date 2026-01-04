import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersSidebar from '../proplumb/components/FiltersSidebar'
import ProductGrid from '../proplumb/components/ProductGrid'
import QuickViewModal from '../proplumb/components/QuickViewModal'
import { api } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ categories: [], brands: [], maxPrice: 500, sort: 'featured' })
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const [loading, setLoading] = useState(true)
  const [quick, setQuick] = useState({ open: false, product: null })
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [filters, urlSearch])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = {}
      if (urlSearch) params.search = urlSearch
      if (filters.categories?.length) params.category = filters.categories.join(',')
      if (filters.brands?.length) params.brand = filters.brands.join(',')
      if (filters.maxPrice != null) params.maxPrice = filters.maxPrice
      if (filters.sort) params.sort = filters.sort

      const { data } = await api.get('/products', { params })
      setProducts(data.products || [])
    } catch (e) {
      console.error('Failed to fetch products', e)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  function handleFiltersChange(v) {
    setFilters(v)
  }

  function handleQuickView(product) {
    setQuick({ open: true, product })
  }

  function closeQuick() {
    setQuick({ open: false, product: null })
  }

  function handleAddToCart(product) {
    // Use CartContext to add item (supports guest local storage)
    try {
      addToCart(product._id || product.id, 1)
    } catch (e) {
      console.error('Failed to add to cart', e)
    }
  }

  return (
    <div>
      <section id="products" style={{ background: 'var(--light-gray)' }}>
        <h2>Shop All Products</h2>

        <div className="products-section">
          <FiltersSidebar onChange={handleFiltersChange} />

          <div style={{ minHeight: 200 }}>
            {loading ? (
              <div className="products-grid">
                {[...Array(8)].map((_, i) => (
                  <div className="card" key={i} style={{ height: 360 }} />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} onQuickView={handleQuickView} onAddToCart={handleAddToCart} />
            )}
          </div>
        </div>
      </section>

      <QuickViewModal product={quick.product} open={quick.open} onClose={closeQuick} onAddToCart={handleAddToCart} />
    </div>
  )
}
