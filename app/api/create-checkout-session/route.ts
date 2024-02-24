import { createClient } from '@/lib/server/action'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe/stripe'
import { getURL } from '@/lib/stripe/helpers'
import { createOrRetrieveCustomer } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const { price, quantity = 1, metadata = {} } = await request.json()
  try {
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log('checkout session supabase user', user)
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    })
    let params: Stripe.Checkout.SessionCreateParams

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 30,
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}`,
    })
    console.log('checkout session created data', session)
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.log('Error while creating a session', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
