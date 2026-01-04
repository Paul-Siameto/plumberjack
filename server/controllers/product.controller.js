import { Product } from '../models/Product.model.js';

export async function listProducts(req, res, next) {
  try {
    const pageSize = Number(req.query.limit) || 1000; // allow large lists for the static page
    const page = Number(req.query.page) || 1;

    // Search mapping: support `search` (UI) and `q` (existing)
    const search = req.query.search || req.query.q || '';
    const keyword = search ? { name: { $regex: search, $options: 'i' } } : {};

    // Category may be single or comma-separated
    let category = {};
    if (req.query.category) {
      const cats = String(req.query.category).split(',').map(c => c.trim()).filter(Boolean);
      if (cats.length === 1) category = { category: cats[0] };
      else if (cats.length > 1) category = { category: { $in: cats } };
    }

    // Brand filter (optional)
    let brand = {};
    if (req.query.brand) {
      const brands = String(req.query.brand).split(',').map(b => b.trim()).filter(Boolean);
      if (brands.length === 1) brand = { brand: brands[0] };
      else if (brands.length > 1) brand = { brand: { $in: brands } };
    }

    const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
    const maxPrice = req.query.maxPrice ? { price: { ...(minPrice.price || {}), $lte: Number(req.query.maxPrice) } } : {};

    const filter = { ...keyword, ...category, ...brand, ...minPrice, ...maxPrice };

    // Sorting: support `sort` query values like price-low, price-high, rating, newest, featured
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const s = req.query.sort;
      if (s === 'price-low') sort = { price: 1 };
      else if (s === 'price-high') sort = { price: -1 };
      else if (s === 'rating') sort = { rating: -1 };
      else if (s === 'newest') sort = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.json({ products, total, page, pages: Math.ceil(total / pageSize) });
  } catch (e) { next(e); }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (e) { next(e); }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, images = [], stock } = req.body;
    const product = await Product.create({ name, description, price, category, images, stock });
    res.status(201).json({ product });
  } catch (e) { next(e); }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (e) { next(e); }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (e) { next(e); }
}

export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const already = product.reviews.find(r => String(r.user) === String(req.user._id));
    if (already) return res.status(400).json({ message: 'Product already reviewed' });
    product.reviews.push({ user: req.user._id, rating, comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (e) { next(e); }
}


