import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { cartCount } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const [menuActive, setMenuActive] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onDocClick(e) {
      if (!inputRef.current?.contains(e.target)) setMenuActive(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function onSearchSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop')
  }

  return (
    <header>
      <div className="navbar">
        <NavLink to="/" className="logo">ProPlumb Supply</NavLink>

        <div className="nav-search" ref={inputRef}>
          <form onSubmit={onSearchSubmit} className="search-container">
            <i className="fas fa-search search-icon" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              placeholder="Search products..."
              autoComplete="off"
            />
          </form>
        </div>

        <nav className={`nav-links ${menuActive ? 'active' : ''}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <a href="#categories">Categories</a>
          {isAdmin && (
            <NavLink to="/admin">Admin</NavLink>
          )}
          <NavLink to="/cart" className="cart-icon"><i className="fas fa-shopping-cart" /><span className="cart-count">{cartCount}</span></NavLink>

          {user ? (
            <>
              <span className="text-sm font-semibold">{user.name?.split(' ')[0]}</span>
              <button className="text-sm ml-2" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login?next=/admin" className="text-sm font-semibold">Admin Login</NavLink>
            </>
          )}
        </nav>

        <div className="menu-toggle" onClick={() => setMenuActive(v => !v)}>&#9776;</div>
      </div>
    </header>
  )
}


