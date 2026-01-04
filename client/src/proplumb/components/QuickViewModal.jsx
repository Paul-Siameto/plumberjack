export default function QuickViewModal({ product, open, onClose, onAddToCart }) {
  if (!product) return null
  return (
    <div className={`quick-view-modal ${open ? 'show' : ''}`} onClick={(e)=>{ if (e.target.classList.contains('quick-view-modal')) onClose() }}>
      <div className="quick-view-content">
        <div className="quick-view-close" onClick={onClose}>&times;</div>
        <img className="quick-view-img" src={(product.images && product.images[0]) || product.img || product.image || ''} alt={product.name} />
        <div className="quick-view-info">
          <h3 id="quick-view-name">{product.name}</h3>
          <div className="quick-view-rating">{'★'.repeat(product.rating || 0) + '☆'.repeat(5 - (product.rating || 0))}</div>
          <div className="quick-view-price">${product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
          <p className="quick-view-desc">{product.description || 'High-quality product built for durability and performance.'}</p>
          <div className="quick-view-actions">
            <button className="quick-view-add-to-cart" onClick={()=>onAddToCart(product)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
