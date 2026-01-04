import { useState, useEffect, useRef } from 'react'

export default function Navbar({ searchValue, setSearchValue, cartCount }) {
  const [menuActive, setMenuActive] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!inputRef.current?.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // suggestions are provided by parent via filtering; simple placeholder here
  useEffect(() => {
    if (!searchValue) setShowSuggestions(false)
  }, [searchValue])

  return (
    <header>
      <div className="navbar">
        <div className="logo">ProPlumb Supply</div>

        <div className="nav-search" ref={inputRef}>
          <div className="search-container">
            <i className="fas fa-search search-icon" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
              placeholder="Search products..."
              autoComplete="off"
              onFocus={() => { if (searchValue) setShowSuggestions(true) }}
            />
            <div className={`autocomplete-suggestions ${showSuggestions ? 'show' : ''}`}>
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-item">Suggestion</div>
              ))}
            </div>
          </div>
        </div>

        <nav className={`nav-links ${menuActive ? 'active' : ''}`}>
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#products">Products</a>
          <a href="#why-us">Why Us</a>
          <a href="#contact">Contact</a>
          <a href="#cart" className="cart-icon"><i className="fas fa-shopping-cart" /><span className="cart-count">{cartCount}</span></a>
        </nav>

        <div className="menu-toggle" onClick={() => setMenuActive(v => !v)}>&#9776;</div>
      </div>
    </header>
  )
}
