import { Cart } from '../models/Cart.model.js';
import { Product } from '../models/Product.model.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ items: cart.items });
  } catch (e) { next(e); }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(i => String(i.product) === String(productId));
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity: Number(quantity)
      });
    }
    await cart.save();
    res.status(201).json({ items: cart.items });
  } catch (e) { next(e); }
}

export async function updateCartItem(req, res, next) {
  try {
    const { id } = req.params; // cart item id
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    item.quantity = Number(quantity);
    await cart.save();
    res.json({ items: cart.items });
  } catch (e) { next(e); }
}

export async function removeCartItem(req, res, next) {
  try {
    const { id } = req.params; // cart item id
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(i => String(i._id) !== String(id));
    await cart.save();
    res.json({ items: cart.items });
  } catch (e) { next(e); }
}


