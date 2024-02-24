import { createClient } from '@/lib/server/action'
import { Song } from '@/types'
import { cookies } from 'next/headers'

const getSongs = async (): Promise<Song[]> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.log('error getting songs', error)
  }
  return data || []
}

export default getSongs
