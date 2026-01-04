import { Router } from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;


