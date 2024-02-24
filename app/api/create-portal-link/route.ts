import { createClient } from '@/lib/server/action'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe/stripe'
import { getURL } from '@/lib/stripe/helpers'
import { createOrRetrieveCustomer } from '@/lib/supabaseAdmin'

export async function POST() {
  const cookieStore = cookies()
  try {
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Could not get user')
    const customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || '',
    })
    if (!customer) throw new Error('Could not get customer')
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    })
    return NextResponse.json({ url })
  } catch (error) {
    console.log('Billing portal session error', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
