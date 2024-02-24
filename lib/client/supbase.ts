import { cache } from 'react'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  // console.log('next/headers cookies()', cookieStore)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
  return supabase
}

export const getSession = cache(async () => {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting supabase session:', error)
    return null
  }
})
// export const getSession = async () => {
//   const supabase = createServerSupabaseClient()
//   try {
//     const {
//       data: { session },
//     } = await supabase.auth.getSession()
//     return session
//   } catch (error) {
//     console.error('Error getting supabase session:', error)
//     return null
//   }
// }

export const getUser = cache(async () => {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting supabase user:', error)
    return null
  }
})

export const getUserDetails = cache(async () => {
  const supabase = createServerSupabaseClient()
  try {
    const { data, error } = await supabase.from('users').select('*').single()
    if (error) {
      console.error('Error getting user details:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
})

export const getSubscription = cache(async () => {
  const supabase = createServerSupabaseClient()
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single()
    if (error) {
      console.error('Error getting subscription:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
})
