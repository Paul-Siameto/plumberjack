import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('darkMode', dark.toString())
  }, [dark])

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
        <div className="min-h-screen flex flex-col bg-white text-neutral-900">
          <Navbar dark={dark} setDark={setDark} />
          <motion.main className="flex-1 container-custom py-8 md:py-12" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
          <Footer />
        </div>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}


