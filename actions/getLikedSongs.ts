import { getUser } from '@/lib/client/supbase'
import { createClient } from '@/lib/server/action'
import { Song } from '@/types'
import { cookies } from 'next/headers'

const getLikedSongs = async (): Promise<Song[]> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUser()
  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
  if (error) {
    console.log('error getting liked songs', error)
    return []
  }
  if (!data) {
    return []
  }
  console.log('liked songs data', data)
  return data.map((item) => ({
    ...item.songs,
  }))
}

export default getLikedSongs
