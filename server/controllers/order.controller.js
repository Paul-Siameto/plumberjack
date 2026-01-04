import { Order } from '../models/Order.model.js';

export async function createOrder(req, res, next) {
  try {
    const { items, totalAmount, paymentMethod = 'mock', shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
    const order = await Order.create({ user: req.user._id, items, totalAmount, paymentMethod, shippingAddress });
    res.status(201).json({ order });
  } catch (e) { next(e); }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) { next(e); }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) { next(e); }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) { next(e); }
}


