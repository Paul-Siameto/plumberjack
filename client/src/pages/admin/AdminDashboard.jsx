import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AdminHome from './AdminHome.jsx'
import AdminProducts from './AdminProducts.jsx'
import AdminOrders from './AdminOrders.jsx'
import AdminCategories from './AdminCategories.jsx'
import AdminInventory from './AdminInventory.jsx'
import AdminSettings from './AdminSettings.jsx'
import '../../admin/admin.css'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    document.body.classList.add('admin')
    return () => document.body.classList.remove('admin')
  }, [])

  const location = useLocation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => !!localStorage.getItem('adminDarkMode'))

  useEffect(() => {
    if (localStorage.getItem('adminDarkMode') === 'enabled') {
      document.body.classList.add('dark-mode')
    }
  }, [])

  function toggleDark() {
    const now = !document.body.classList.contains('dark-mode')
    if (now) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('adminDarkMode', 'enabled')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('adminDarkMode', 'disabled')
    }
    setDark(now)
  }

  function pageTitleFromPath(path) {
    if (path === '/admin' || path === '/admin/') return 'Dashboard Overview'
    if (path.startsWith('/admin/products')) return 'Products Management'
    if (path.startsWith('/admin/categories')) return 'Categories Management'
    if (path.startsWith('/admin/inventory')) return 'Inventory Management'
    if (path.startsWith('/admin/orders')) return 'Orders'
    if (path.startsWith('/admin/settings')) return 'Settings'
    return 'Admin'
  }

  const title = pageTitleFromPath(location.pathname)

  if (!user || !isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="admin-wrapper">
      <aside className="sidebar" role="navigation" aria-label="Admin sidebar">
        <div className="sidebar-header">
          <div className="logo">ProPlumb</div>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/admin" end className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/products" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-box"></i>
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/categories" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-folder"></i>
            <span>Categories</span>
          </NavLink>

          <NavLink to="/admin/inventory" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-warehouse"></i>
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/admin/orders" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-chart-line"></i>
            <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/settings" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
          <div className="topbar-controls">
            <div className="dark-mode-toggle" role="button" aria-pressed={dark} onClick={toggleDark}>
              <i className="fas fa-sun toggle-icon sun" aria-hidden></i>
              <i className="fas fa-moon toggle-icon moon" aria-hidden></i>
              <div className="toggle-switch" />
            </div>
            <div className="user-info">
              <span style={{fontWeight:600}}>Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</span>
              <div className="user-avatar">{(user?.name || 'A')[0]}</div>
              <button className="btn-logout" onClick={() => { logout(); navigate('/login') }}>Logout</button>
            </div>
          </div>
        </div>
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="products/*" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
