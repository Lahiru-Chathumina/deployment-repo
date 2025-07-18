
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await res.json()

        if (!data.sessionId) {
          alert('Checkout session creation failed.')
          router.push('/')
          return
        }

        const { loadStripe } = await import('@stripe/stripe-js')
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

        if (!stripe) {
          alert('Stripe failed to load')
          return
        }

        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      } catch (error) {
        console.error('Checkout error:', error)
        alert('Checkout failed')
        router.push('/')
      }
    }

    initiateCheckout()
  }, [router])

  return (
    <div className="p-10 text-center">
      <p>Redirecting to payment gateway...</p>
    </div>
  )
}
