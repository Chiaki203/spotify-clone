'use client'

import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { SubscriptionWithPrice } from '@/types'
import { useEffect, useState } from 'react'
import { postData } from '@/lib/stripe/helpers'
import { toast } from 'react-hot-toast'
import Button from '@/components/Button'

interface AccountContentProps {
  user: User | null
  subscription: SubscriptionWithPrice
}

const AccountContent: React.FC<AccountContentProps> = ({
  user,
  subscription,
}) => {
  const router = useRouter()
  const subscribeModal = useSubscribeModal()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [user, router])
  const redirectToCustomerPortal = async () => {
    setLoading(true)
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      })
      // window.location.assign(url)
      router.push(url)
    } catch (error: any) {
      if (error) {
        console.log('redirectToCustomerPortal error', error)
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active plan.</p>
          <Button onClick={subscribeModal.onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the{' '}
            <b>{subscription.prices?.products?.name}</b> plan.
          </p>
          <Button
            onClick={redirectToCustomerPortal}
            disabled={loading}
            className="w-[300px]"
          >
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  )
}

export default AccountContent
