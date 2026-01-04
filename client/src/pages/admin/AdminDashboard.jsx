import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AdminHome from './AdminHome.jsx'
import AdminProducts from './AdminProducts.jsx'
import AdminOrders from './AdminOrders.jsx'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()

  if (!user || !isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="heading-secondary mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="bg-white border-2 border-neutral-200 p-4 space-y-2 sticky top-20">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-semibold uppercase tracking-wide text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-neutral-100 text-neutral-700'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-semibold uppercase tracking-wide text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-neutral-100 text-neutral-700'
                }`
              }
            >
              <Package size={18} />
              Products
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-semibold uppercase tracking-wide text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-neutral-100 text-neutral-700'
                }`
              }
            >
              <ShoppingBag size={18} />
              Orders
            </NavLink>
          </nav>
        </aside>

        <main className="md:col-span-3">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="products/*" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
