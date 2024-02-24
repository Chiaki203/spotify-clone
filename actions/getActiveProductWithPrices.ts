import { createClient } from '@/lib/server/action'
import { ProductWithPrice } from '@/types'
import { cookies } from 'next/headers'

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' })
  if (error) {
    console.log('error getting songs', error)
  }
  return data || []
}

export default getActiveProductsWithPrices
