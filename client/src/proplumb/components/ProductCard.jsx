export default function ProductCard({ product, onQuickView, onAddToCart }) {
  const img = (product.images && product.images[0]) || product.img || product.image || ''
  const price = product.price?.toFixed ? product.price.toFixed(2) : product.price
  const rating = product.rating || 0
  return (
    <div className="card product-card">
      <div className="quick-view-btn" data-product-id={product._id || product.id} onClick={() => onQuickView(product)}>
        <i className="fas fa-eye" />
      </div>
      <img src={img} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating">{'★'.repeat(rating) + '☆'.repeat(5 - rating)}</div>
        <div className="price">${price}</div>
        <a href="#" className="add-to-cart" onClick={(e)=>{e.preventDefault(); onAddToCart(product)}} data-id={product._id || product.id}>Add to Cart</a>
      </div>
    </div>
  )
}
