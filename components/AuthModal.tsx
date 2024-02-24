'use client'

import { SupabaseClient } from '@supabase/supabase-js'
import Modal from './Modal'
import { createClient } from '@/lib/client/client'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/client/supbase'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState, memo } from 'react'
import useAuthModal from '@/hooks/useAuthModal'

interface AuthModalProps {
  session: Session | null
  // children: React.ReactNode
}

const AuthModal = ({ session }: AuthModalProps) => {
  // console.log('authModal session', session)
  const supabase: SupabaseClient = createClient()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useAuthModal()
  const [isMounted, setIsMounted] = useState(false)
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
      router.refresh()
    }
  }
  useEffect(() => {
    if (session) {
      // router.refresh()
      onClose()
    }
  }, [router, onClose, session])
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null
  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      {/* {children} */}
      {/* <AuthForm /> */}
      <Auth
        theme="dark"
        magicLink
        providers={['github']}
        supabaseClient={supabase}
        // redirectTo="/"
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
    </Modal>
  )
}

const AuthModalMemo = memo(AuthModal)

export default AuthModal
