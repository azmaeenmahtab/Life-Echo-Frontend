

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { auth } from '../../../lib/auth'

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Resolve the currently logged-in user (if any) so we can prefill Stripe's email field.
    const authSession = await auth.api.getSession({ headers: headersList })
    const userEmail = authSession?.user?.email

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1Tkdpb7w2QoDWzpTyUCyUWqV',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      ...(userEmail ? { customer_email: userEmail } : {}),
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}