import { useEffect, useState } from 'react'
import { api } from '../../utils/api.js'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      // No dedicated categories API — derive from products
      const { data } = await api.get('/products?limit=200')
      const products = data.products || []
      const map = {}
      products.forEach(p => {
        const name = p.category || 'Uncategorized'
        if (!map[name]) map[name] = { name, count: 0, img: p.images?.[0] || '' }
        map[name].count += 1
      })
      setCategories(Object.values(map))
    } catch (error) {
      console.error('Failed to load categories', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading categories...</div>

  return (
    <div>
      <div className="products-header">
        <h2>All Categories (<span>{categories.length}</span>)</h2>
        <button className="btn-add-category">Add New Category</button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.name} className="category-card">
            {cat.img ? <img src={cat.img} alt={cat.name} className="category-img" /> : <div style={{height:200,background:'#eee'}} />}
            <div className="category-info">
              <div className="category-name">{cat.name}</div>
              <div className="category-product-count">{cat.count} products</div>
              <div className="category-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
