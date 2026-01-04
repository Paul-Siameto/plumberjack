import { Router } from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;


