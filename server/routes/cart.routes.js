import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update/:id', protect, updateCartItem);
router.delete('/remove/:id', protect, removeCartItem);

export default router;


