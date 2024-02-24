// 'use client'

import { useEffect, useState } from 'react'

import Modal from '@/components/Modal'
import AuthModal from '@/components/AuthModal'
import { getSession, getSubscription, getUser } from '@/lib/client/supbase'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import { AuthForm } from '@/components/AuthForm'
import UploadModal from '@/components/UploadModal'
import SubscribeModal from '@/components/SubscribeModal'
import { ProductWithPrice } from '@/types'

interface ModalProviderProps {
  products: ProductWithPrice[]
}

const ModalProvider: React.FC<ModalProviderProps> = async ({ products }) => {
  const session = await getSession()
  const user = await getUser()
  const subscription = await getSubscription()

  console.log('modal session', session)
  // const [isMounted, setIsMounted] = useState(false)
  // useEffect(() => {
  //   setIsMounted(true)
  // }, [])
  // if (!isMounted) return null
  return (
    <div>
      <AuthModal session={session} />
      <UploadModal user={user} />
      <SubscribeModal
        user={user}
        subscription={subscription}
        products={products}
      />
    </div>
  )
}

export default ModalProvider
