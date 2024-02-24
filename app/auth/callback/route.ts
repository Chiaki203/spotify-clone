import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server/action'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  console.log('auth callback request.url', request.url)
  const requestUrl = new URL(request.url)
  console.log('auth callback requestUrl', requestUrl)
  const { searchParams } = requestUrl
  const token_hash = searchParams.get('token_hash')
  console.log('auth callback token_hash', token_hash)
  const type = searchParams.get('type') as EmailOtpType | null
  console.log('auth callback type', type)
  const next = searchParams.get('next') ?? '/'
  const redirectTo = requestUrl.origin + next
  console.log('auth callback redirectTo', redirectTo)
  const code = searchParams.get('code')
  console.log('auth callback code', code)
  const _redirectTo = request.nextUrl.clone()
  console.log('auth callback request.nextUrl.clone()', _redirectTo)
  _redirectTo.pathname = next
  _redirectTo.searchParams.delete('token_hash')
  _redirectTo.searchParams.delete('type')
  if (code) {
    const supabase = createClient(cookieStore)
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log('auth callback exchangeCodeForSession data', data)
      return NextResponse.redirect(redirectTo)
    }
  } else if (token_hash && type) {
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log('auth callback verifyOtp data', data)
    if (!error) {
      _redirectTo.searchParams.delete('next')
      return NextResponse.redirect(_redirectTo)
    }
  } else {
    console.log('Missing token_hash or type for OTP verification')
  }
  _redirectTo.pathname = '/auth/auth-code-error'
  return NextResponse.redirect(_redirectTo)
}
