import './ProPlumb.css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Hero from './components/Hero'
import Categories from './components/Categories'
import FiltersSidebar from './components/FiltersSidebar'
import ProductGrid from './components/ProductGrid'
import QuickViewModal from './components/QuickViewModal'
import axios from 'axios'
import { useCart } from '../context/CartContext.jsx'

const api = axios.create({ baseURL: '/api' })

export default function ProPlumbApp() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ categories: [], brands: [], maxPrice: 500, sort: 'featured' })
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const { addToCart } = useCart()
  const [quick, setQuick] = useState({ open: false, product: null })

  useEffect(() => { fetchProducts() }, [urlSearch, filters])

  async function fetchProducts() {
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
    }
  }

  function handleFiltersChange(v) { setFilters(v) }

  function handleQuickView(product) { setQuick({ open: true, product }) }
  function closeQuick() { setQuick({ open: false, product: null }) }

  function handleAddToCart(product) {
    try {
      addToCart(product._id || product.id, 1)
    } catch (e) {
      console.error('failed to add to cart', e)
    }
  }

  return (
    <div className="proplumb-root">
      <main>
        <Hero />
        <Categories />

        <section id="products" style={{ background: 'var(--light-gray)' }}>
          <h2>Shop All Products</h2>
          <div className="products-section">
            <FiltersSidebar onChange={handleFiltersChange} />
            <ProductGrid products={products} onQuickView={handleQuickView} onAddToCart={handleAddToCart} />
          </div>
        </section>

        <section id="why-us" className="features-grid">
          <h2>Why Choose ProPlumb Supply</h2>
          <div className="grid">
            <div className="feature"><i className="fas fa-certificate" /><h3>Genuine Products</h3><p>100% authentic from verified manufacturers</p></div>
            <div className="feature"><i className="fas fa-tags" /><h3>Bulk & Wholesale Pricing</h3><p>Exclusive rates for contractors and resellers</p></div>
            <div className="feature"><i className="fas fa-truck" /><h3>Fast Nationwide Delivery</h3><p>2-5 business days with tracking</p></div>
            <div className="feature"><i className="fas fa-shield-alt" /><h3>Full Warranty</h3><p>Manufacturer-backed guarantees on every item</p></div>
          </div>
        </section>

      </main>

      <QuickViewModal product={quick.product} open={quick.open} onClose={closeQuick} onAddToCart={handleAddToCart} />
    </div>
  )
}
