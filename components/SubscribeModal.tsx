'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { Price, ProductWithPrice, SubscriptionWithPrice } from '@/types'
import Button from './Button'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { toast } from 'react-hot-toast'
import { postData } from '@/lib/stripe/helpers'
import { getStripe } from '@/lib/stripe/stripeClient'
import useSubscribeModal from '@/hooks/useSubscribeModal'

interface SubscribeModalProps {
  user: User | null
  products: ProductWithPrice[]
  subscription: SubscriptionWithPrice
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100)
  return priceString
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  user,
  products,
  subscription,
}) => {
  console.log('subscribe modal products', products)
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen, onOpen, onClose } = useSubscribeModal()
  const [priceIdLoading, setPriceIdLoading] = useState<string>()
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)
    if (!user) {
      setPriceIdLoading(undefined)
      return toast.error('Must be logged in')
    }
    if (subscription) {
      setPriceIdLoading(undefined)
      return toast('Already subscribed')
    }
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      })
      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error: any) {
      console.log('handleCheckout error', error)
      toast.error(error.message)
    } finally {
      setPriceIdLoading(undefined)
    }
  }
  let content = <div className="text-center">No Products available</div>
  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>
          }
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={price.id === priceIdLoading}
              className="mb-4"
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ))
        })}
      </div>
    )
  }
  if (subscription) {
    console.log('SubscribeModal subscription', subscription)
    content = <div className="text-center">Already subscribed</div>
  }
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null
  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify premium"
      isOpen={isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  )
}

export default SubscribeModal
