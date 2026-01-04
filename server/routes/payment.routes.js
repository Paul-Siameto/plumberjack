import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { createPaymentIntent, confirmPayment } from '../controllers/payment.controller.js'

const router = Router()

router.post('/intent', protect, createPaymentIntent)
router.post('/confirm', protect, confirmPayment)

export default router

