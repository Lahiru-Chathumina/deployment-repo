'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Menu, X } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    router.push('/login')
  }

const handlePayment = async () => {
  if (!userEmail) {
    router.push('/login')
  } else {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        alert('Stripe failed to load')
        return
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(`Error: ${errorData.error}`)
        return
      }

      const { sessionId } = await res.json()

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        alert(error.message)
      }
    } catch (error: any) {
      alert(error.message || 'Payment failed')
    }
  }
}


  return (
    <nav className="bg-blue-800 shadow px-4 py-3 flex items-center justify-between md:px-8">
      <Link href="/" className="text-xl font-bold text-white">
        Blog App
      </Link>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white focus:outline-none"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="hidden md:flex items-center space-x-4">
        <Link href="/" className={pathname === '/' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
          Home
        </Link>

        <button
          onClick={handlePayment}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-md transition"
        >
          Payment
        </button>

        {userEmail && (
          <Link
            href="/fomecreate"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            + Add Post
          </Link>
        )}

        {userEmail ? (
          <>
            <span className="text-sm text-gray-200">
              <span className="font-medium">{userEmail}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 text-sm ml-2 underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={pathname === '/login' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
              Login
            </Link>
            <Link href="/register" className={pathname === '/register' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
              Register
            </Link>
          </>
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-900 shadow-md p-4 flex flex-col space-y-4 md:hidden z-50">
          <Link href="/" onClick={() => setMenuOpen(false)} className={pathname === '/' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
            Home
          </Link>

          <button
            onClick={() => {
              setMenuOpen(false)
              handlePayment()
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full shadow-md transition text-sm"
          >
            Payment
          </button>

          {userEmail && (
            <Link
              href="/fomecreate"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow transition text-sm"
            >
              + Add Post
            </Link>
          )}

          {userEmail ? (
            <>
              <span className="text-sm text-gray-200">
                <span className="font-medium">{userEmail}</span>
              </span>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="text-red-400 hover:text-red-600 text-sm underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className={pathname === '/login' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className={pathname === '/register' ? 'text-indigo-300 font-semibold' : 'text-gray-300'}>
                Register
              </Link>
              <span className="text-sm text-gray-400">Not logged in</span>
            </>
          )}
        </div>
      )}
    </nav>
  )
}