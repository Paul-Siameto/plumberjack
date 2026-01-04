import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], onQuickView, onAddToCart }) {
  return (
    <div className="products-grid" id="products-grid">
      {products.length === 0 ? (
        <p style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>No products match your search or filters.</p>
      ) : (
        products.map(p => (
          <ProductCard key={p._id || p.id} product={p} onQuickView={onQuickView} onAddToCart={onAddToCart} />
        ))
      )}
    </div>
  )
}
