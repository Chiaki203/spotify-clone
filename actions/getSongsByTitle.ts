import { createClient } from '@/lib/server/action'
import { Song } from '@/types'
import { cookies } from 'next/headers'
import getSongs from './getSongs'

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  if (!title) {
    const allSongs = await getSongs()
    return allSongs
  }
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false })
  if (error) {
    console.log('error getting songs', error)
  }
  return data || []
}

export default getSongsByTitle
