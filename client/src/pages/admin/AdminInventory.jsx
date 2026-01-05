import { useEffect, useState } from 'react'
import { api } from '../../utils/api.js'

export default function AdminInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const { data } = await api.get('/products?limit=200')
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading inventory...</div>

  return (
    <div>
      <div className="inventory-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h2>Stock Overview</h2>
        <button className="btn-restock-items">Restock Items</button>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat"><div className="inventory-stat-value">{products.length}</div><div className="inventory-stat-label">Total Products</div></div>
        <div className="inventory-stat"><div className="inventory-stat-value">{products.filter(p=>p.stock>0).length}</div><div className="inventory-stat-label">In Stock</div></div>
        <div className="inventory-stat"><div className="inventory-stat-value">{products.filter(p=>p.stock>0 && p.stock<=20).length}</div><div className="inventory-stat-label">Low Stock</div></div>
        <div className="inventory-stat"><div className="inventory-stat-value">{products.filter(p=>p.stock===0).length}</div><div className="inventory-stat-label">Out of Stock</div></div>
      </div>

      <div className="inventory-table-container table-container" style={{marginTop:'1.5rem'}}>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td style={{display:'flex',alignItems:'center',gap:'0.8rem'}}>
                  <img src={p.images?.[0]||'/placeholder.png'} alt={p.name} className="inventory-img" />
                  <div>{p.name}</div>
                </td>
                <td>{p.sku||'N/A'}</td>
                <td>{p.category}</td>
                <td>{p.stock ?? 0}</td>
                <td>20</td>
                <td>{p.stock>20? 'Healthy': p.stock>0? 'Low' : 'Out of Stock'}</td>
                <td><button className="btn-restock-items">Restock</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
