import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../utils/api.js'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const { data } = await api.get('/products?limit=100')
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="heading-secondary">Products</h2>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white border-2 border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Image</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-neutral-900">{product.name}</td>
                <td className="px-6 py-4 text-neutral-600 uppercase tracking-wide">{product.category}</td>
                <td className="px-6 py-4 font-bold text-primary">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 font-medium">{product.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-neutral-500 border-t border-neutral-200">
            No products found
          </div>
        )}
      </div>
    </div>
  )
}

function ProductForm({ mode = 'new', productId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'edit' && productId) {
      fetchProduct()
    }
  }, [mode, productId])

  async function fetchProduct() {
    try {
      const { data } = await api.get(`/products/${productId}`)
      const product = data.product
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        images: product.images || []
      })
    } catch (error) {
      console.error('Failed to fetch product', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      }
      
      if (mode === 'edit') {
        await api.put(`/products/${productId}`, payload)
      } else {
        await api.post('/products', payload)
      }
      
      navigate('/admin/products')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4 hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <h2 className="heading-secondary mb-8">
        {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-neutral-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={5}
            className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Stock *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base appearance-none cursor-pointer"
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">Image URLs (one per line)</label>
          <textarea
            value={formData.images.join('\n')}
            onChange={(e) =>
              setFormData({
                ...formData,
                images: e.target.value.split('\n').filter((url) => url.trim())
              })
            }
            rows={4}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="w-full border-2 border-neutral-300 rounded px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
          />
        </div>

        <div className="flex gap-4 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function EditProduct() {
  const { id } = useParams()
  return <ProductForm mode="edit" productId={id} />
}

export default function AdminProducts() {
  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path="new" element={<ProductForm mode="new" />} />
      <Route path="edit/:id" element={<EditProduct />} />
    </Routes>
  )
}

