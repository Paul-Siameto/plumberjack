import { Router } from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, addReview);

export default router;


