import { useEffect, useState } from 'react'
import { api } from '../../utils/api.js'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'

export default function AdminHome() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products?limit=1'),
        api.get('/orders/myorders')
      ])
      
      setStats({
        products: productsRes.data.total || 0,
        orders: ordersRes.data.orders?.length || 0,
        users: 0, // Would need a users endpoint
        revenue: ordersRes.data.orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  const statCards = [
    { icon: Package, label: 'Total Products', value: stats.products, color: 'bg-blue-500' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.orders, color: 'bg-green-500' },
    { icon: Users, label: 'Total Users', value: stats.users, color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, color: 'bg-yellow-500' }
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-2 border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold mt-3 text-neutral-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded`}>
                <stat.icon className="text-white" size={28} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-neutral-200 p-8"
      >
        <h3 className="heading-tertiary mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/products"
            className="p-6 border-2 border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <h4 className="font-bold text-lg mb-2 text-neutral-900">Manage Products</h4>
            <p className="text-sm text-neutral-600">
              Add, edit, or delete products
            </p>
          </a>
          <a
            href="/admin/orders"
            className="p-6 border-2 border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <h4 className="font-bold text-lg mb-2 text-neutral-900">View Orders</h4>
            <p className="text-sm text-neutral-600">
              Track and manage customer orders
            </p>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

