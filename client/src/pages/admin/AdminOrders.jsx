import { useEffect, useState } from 'react'
import { api } from '../../utils/api.js'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      // Note: This endpoint would need to be created on the server for admin to see all orders
      // For now, using the user's orders endpoint as a placeholder
      const { data } = await api.get('/orders/myorders')
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch (error) {
      alert('Failed to update order status')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  return (
    <div>
      <h2 className="heading-secondary mb-8">Orders</h2>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-neutral-200">
            <Package size={64} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-lg font-semibold text-neutral-700">No orders found</p>
          </div>
        ) : (
          orders.map((order) => {
            const statusColors = {
              Pending: 'bg-yellow-100 text-yellow-800',
              Paid: 'bg-blue-100 text-blue-800',
              Shipped: 'bg-purple-100 text-purple-800',
              Delivered: 'bg-green-100 text-green-800'
            }
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-neutral-200 p-8"
              >
                <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-neutral-200">
                  <div>
                    <h3 className="heading-tertiary mb-2">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-neutral-600 uppercase tracking-wide">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wide ${
                        statusColors[order.status] || 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border-2 border-neutral-300 rounded px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-neutral-700">
                      <span className="font-medium">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600 font-medium mb-1">
                      Payment: <span className="uppercase tracking-wide">{order.paymentMethod || 'N/A'}</span>
                    </p>
                    {order.shippingAddress && (
                      <p className="text-sm text-neutral-600">
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${order.totalAmount?.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

