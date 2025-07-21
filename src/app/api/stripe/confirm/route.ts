import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || !session.customer_email || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Invalid session or unpaid' }, { status: 400 });
    }

    const { data, error } = await supabase.from('payments').insert([
      {
        email: session.customer_email,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        payment_status: session.payment_status,
        stripe_session_id: session.id,
        created_at: new Date().toISOString(), 
      },
    ]).select(); 

    if (error) throw error;

    console.log('Inserted payment data:', data);

    return NextResponse.json({
      message: 'Payment confirmed and saved',
      payment: data?.[0] || null, 
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
