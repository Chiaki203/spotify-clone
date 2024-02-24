import { createClient } from '@/lib/client/client'
import { Song } from '@/types'
import { cookies } from 'next/headers'

const useLoadImage = (song: Song) => {
  // const cookieStore = cookies()
  // const supabase = createClient(cookieStore)
  const supabase = createClient()

  if (!song) {
    return null
  }
  const { data: imageData } = supabase.storage
    .from('images')
    .getPublicUrl(song.image_path)
  // console.log('useLoadImage imageData', imageData)
  return imageData.publicUrl
}

export default useLoadImage
