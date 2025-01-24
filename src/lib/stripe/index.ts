import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-01-24',
  appInfo: {
    name: 'Geflow App',
    version: '0.1.0',
  },
})