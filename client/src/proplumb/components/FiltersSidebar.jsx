import { useState, useEffect } from 'react'

export default function FiltersSidebar({ onChange }) {
  const [selectedCategories, setSelectedCategories] = useState(['pipes','valves','tools','heaters','fixtures'])
  const [selectedBrands, setSelectedBrands] = useState(['sharkbite','moen','rheem','generic'])
  const [price, setPrice] = useState(500)
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    onChange({ categories: selectedCategories, brands: selectedBrands, maxPrice: price, sort })
  }, [selectedCategories, selectedBrands, price, sort])

  function toggle(arrSetter, value) {
    arrSetter(prev => prev.includes(value) ? prev.filter(v => v!==value) : [...prev, value])
  }

  return (
    <aside className="filters">
      <h3>Filters</h3>
      <select className="sort-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
        <option value="featured">Sort: Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">New Arrivals</option>
      </select>

      <div className="filter-group">
        <h4>Category</h4>
        <label><input type="checkbox" checked={selectedCategories.includes('pipes')} onChange={()=>toggle(setSelectedCategories,'pipes')} /> Pipes & Fittings</label>
        <label><input type="checkbox" checked={selectedCategories.includes('valves')} onChange={()=>toggle(setSelectedCategories,'valves')} /> Valves & Connectors</label>
        <label><input type="checkbox" checked={selectedCategories.includes('tools')} onChange={()=>toggle(setSelectedCategories,'tools')} /> Plumbing Tools</label>
        <label><input type="checkbox" checked={selectedCategories.includes('heaters')} onChange={()=>toggle(setSelectedCategories,'heaters')} /> Water Heaters</label>
        <label><input type="checkbox" checked={selectedCategories.includes('fixtures')} onChange={()=>toggle(setSelectedCategories,'fixtures')} /> Fixtures</label>
      </div>

      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-range">
          <input type="range" min="0" max="500" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
          <div className="price-values"><span>$0</span><span id="price-display">${price}</span></div>
        </div>
      </div>

      <div className="filter-group">
        <h4>Brand</h4>
        <label><input type="checkbox" checked={selectedBrands.includes('sharkbite')} onChange={()=>toggle(setSelectedBrands,'sharkbite')} /> SharkBite</label>
        <label><input type="checkbox" checked={selectedBrands.includes('moen')} onChange={()=>toggle(setSelectedBrands,'moen')} /> Moen</label>
        <label><input type="checkbox" checked={selectedBrands.includes('rheem')} onChange={()=>toggle(setSelectedBrands,'rheem')} /> Rheem</label>
        <label><input type="checkbox" checked={selectedBrands.includes('generic')} onChange={()=>toggle(setSelectedBrands,'generic')} /> Generic</label>
      </div>
    </aside>
  )
}
