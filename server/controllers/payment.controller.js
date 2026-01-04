import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
  : null

export async function createPaymentIntent(req, res, next) {
  try {
    const { amount } = req.body

    if (!stripe) {
      return res.status(400).json({ message: 'Stripe not configured' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: req.body.orderId || 'pending'
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmPayment(req, res, next) {
  try {
    const { paymentIntentId } = req.body

    if (!stripe) {
      return res.status(400).json({ message: 'Stripe not configured' })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    res.json({
      status: paymentIntent.status,
      paymentIntent
    })
  } catch (error) {
    next(error)
  }
}

