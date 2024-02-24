import { Auth } from '@supabase/auth-ui-react'
import { createClient } from '@/lib/server/action'
import { cookies } from 'next/headers'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export const AuthForm = () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  return (
    <div>
      <Auth
        theme="dark"
        magicLink
        providers={['github']}
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e',
              },
            },
          },
        }}
      />
    </div>
  )
}
